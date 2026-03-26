import { databases, ID } from "@/lib/appwrite";
import {
  CHAPTER_COLLECTION,
  CHAPTER_WORK_COLLECTION,
  DB_ID,
  TASK_COLLECTION,
} from "@/types/collections";
import { Query } from "appwrite";
import { getMemberId } from "./member-service";
import { createZipFromS3Files } from "@/helper/createZipFromS3Files";
import { sendDiscordWebhook } from "@/lib/discord";
import { increaseCompletedChapterCount } from "./manga-service";
import { uploadToS3 } from "@/helper/uploadToS3";

export const getTasks = async () => {
  const res = await databases.listDocuments({
    databaseId: DB_ID,
    collectionId: TASK_COLLECTION,
    queries: [
      Query.isNull("deletedAt"),
      Query.select([
        "*",
        "chapters.*",
        "assignedTo.*",
        "assignedBy.*",
        "manga.*",
        "role.*",
      ]),
    ],
  });

  return res.documents;
};

export const getTasksByChapterId = async (chapterId: string) => {
  const res = await databases.listDocuments({
    databaseId: DB_ID,
    collectionId: TASK_COLLECTION,
    queries: [Query.equal("chapters", chapterId), Query.isNull("deletedAt")],
  });

  return res.documents;
};

export const createTask = async (data: {
  note?: string;
  chapterId: string;
  memberId: string;
  roleId: string;
  deadline: Date;
  taskFiles: File[];
  assignedBy: string;
  mangaId: string;
}) => {
  const assignedBy = await getMemberId(data.assignedBy);

  const uploadedUrls = await Promise.all(
    data.taskFiles.map((file) => uploadToS3(file)),
  );

  // 1️⃣ tạo task
  const task = await databases.createDocument({
    databaseId: DB_ID,
    collectionId: TASK_COLLECTION,
    documentId: ID.unique(),
    data: {
      chapters: data.chapterId,
      assignedTo: data.memberId,
      assignedBy: assignedBy,
      manga: data.mangaId,
      role: data.roleId,
      note: data.note ?? null,
      deadline: data.deadline.toISOString(),
      taskFiles: uploadedUrls,
    },
  });

  // 2️⃣ tìm chapter_work rỗng của chapter
  const chapterWork = await databases.listDocuments({
    databaseId: DB_ID,
    collectionId: CHAPTER_WORK_COLLECTION,
    queries: [
      Query.equal("chapters", [data.chapterId]),
      Query.limit(1),
      Query.isNull("members"),
      Query.isNull("roles"),
      Query.isNull("task"),
    ],
  });

  // 3️⃣ nếu có record rỗng → update
  if (chapterWork.total > 0) {
    await databases.updateDocument({
      databaseId: DB_ID,
      collectionId: CHAPTER_WORK_COLLECTION,
      documentId: chapterWork.documents[0].$id,
      data: {
        members: data.memberId,
        roles: data.roleId,
        manga: data.mangaId,
        task: task.$id,
        chapters: data.chapterId,
      },
    });
  }

  // 4️⃣ nếu không có → tạo mới
  else {
    await databases.createDocument({
      databaseId: DB_ID,
      collectionId: CHAPTER_WORK_COLLECTION,
      documentId: ID.unique(),
      data: {
        chapters: data.chapterId,
        members: data.memberId,
        roles: data.roleId,
        manga: data.mangaId,
        task: task.$id,
      },
    });
  }

  await databases.updateDocument({
    databaseId: DB_ID,
    collectionId: CHAPTER_COLLECTION,
    documentId: data.chapterId,
    data: { status: "in-progress" },
  });

  // 5️⃣ gửi notification qua Discord
  await sendDiscordWebhook({
    content: `<@${task.assignedTo.discordId}> có task mới`,
    embeds: [
      {
        title: "📢 Task mới được giao",
        color: 5814783,
        fields: [
          {
            name: "Chapter",
            value: `${task.chapters.number}`,
            inline: true,
          },
          {
            name: "Role",
            value: task.role.label,
            inline: true,
          },
          {
            name: "Người giao",
            value: task.assignedBy.name,
            inline: true,
          },
          {
            name: "Hạn nộp",
            value: new Date(task.deadline).toLocaleDateString(),
            inline: true,
          },
          {
            name: "Note",
            value: task.note || "Không có",
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  });

  return task;
};

export const startTask = async (taskId: string) => {
  const task = await databases.updateDocument({
    databaseId: DB_ID,
    collectionId: TASK_COLLECTION,
    documentId: taskId,
    data: { status: "in-progress" },
  });

  const chapterId = task.chapters.$id;

  const [_, chapterWorkRes] = await Promise.all([
    databases.updateDocument({
      databaseId: DB_ID,
      collectionId: CHAPTER_COLLECTION,
      documentId: chapterId,
      data: { status: "in-progress" },
    }),

    databases.listDocuments({
      databaseId: DB_ID,
      collectionId: CHAPTER_WORK_COLLECTION,
      queries: [Query.equal("task", taskId), Query.limit(1)],
    }),
  ]);

  if (chapterWorkRes.documents.length) {
    await databases.updateDocument({
      databaseId: DB_ID,
      collectionId: CHAPTER_WORK_COLLECTION,
      documentId: chapterWorkRes.documents[0].$id,
      data: { status: "in-progress" },
    });
  }

  const zip = await createZipFromS3Files(
    task.taskFiles || [],
    `task-${taskId}.zip`,
  );

  return {
    ...task,
    zip,
  };
};

export const reviewTask = async (
  taskId: string,
  status: "approved" | "rejected",
  reviewNote?: string,
) => {
  const res = await databases.updateDocument({
    databaseId: DB_ID,
    collectionId: TASK_COLLECTION,
    documentId: taskId,
    data: {
      status,
      reviewedAt: new Date().toISOString(),
      reviewNote: reviewNote ?? null,
    },
  });

  await increaseCompletedChapterCount(res.manga.$id);

  // =========================
  // Nếu task được approved
  // =========================
  if (status === "approved") {
    // tìm chapter_work của task
    const chapterWorkRes = await databases.listDocuments({
      databaseId: DB_ID,
      collectionId: CHAPTER_WORK_COLLECTION,
      queries: [Query.equal("task", taskId), Query.limit(1)],
    });

    if (chapterWorkRes.documents.length) {
      const chapterWork = chapterWorkRes.documents[0];
      const chapterId = chapterWork.chapters;

      // lấy tất cả chapter_work của chapter
      const allChapterWorks = await databases.listDocuments({
        databaseId: DB_ID,
        collectionId: CHAPTER_WORK_COLLECTION,
        queries: [Query.equal("chapters", chapterId)],
      });

      const isAllCompleted = allChapterWorks.documents.every(
        (cw) => cw.status === "completed",
      );

      // nếu tất cả completed -> update chapter
      if (isAllCompleted) {
        // update chapter_work
        await databases.updateDocument({
          databaseId: DB_ID,
          collectionId: CHAPTER_WORK_COLLECTION,
          documentId: chapterWork.$id,
          data: {
            status: "completed",
          },
        });

        // update chapter
        await databases.updateDocument({
          databaseId: DB_ID,
          collectionId: CHAPTER_COLLECTION,
          documentId: chapterId,
          data: {
            status: "completed",
          },
        });
      }
    }
  }

  // Nếu task bị rejected → gửi notification qua Discord
  if (status === "rejected") {
    await sendDiscordWebhook({
      content: `<@${res.assignedTo.discordId}> task của bạn được yêu cầu sửa lại bởi <@${res.assignedBy.discordId}>, hãy kiểm tra và nộp lại nhé!`,
      embeds: [
        {
          title: "Task bị từ chối",
          color: 16711680,
          fields: [
            {
              name: "Chapter",
              value: `${res.chapters.number}`,
              inline: true,
            },
            {
              name: "Role",
              value: res.role.label,
              inline: true,
            },
            {
              name: "Người review",
              value: res.assignedBy.name,
              inline: true,
            },
            {
              name: "Ghi chú",
              value: reviewNote || "Không có",
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    });
  }

  return res;
};

export const submitTask = async (
  taskId: string,
  files: File[],
  note?: string,
) => {
  const uploadedUrls = await Promise.all(files.map((file) => uploadToS3(file)));

  const task = await databases.updateDocument({
    databaseId: DB_ID,
    collectionId: TASK_COLLECTION,
    documentId: taskId,
    data: {
      ...(files.length > 0 && { submittedFiles: uploadedUrls }),
      submittedAt: new Date().toISOString(),
      noteSubmited: note ?? null,
      status: "submitted",
    },
  });

  await sendDiscordWebhook({
    content: `<@${task.assignedBy?.discordId}> task đã được nộp bởi <@${task.assignedTo?.discordId}>, hãy kiểm tra và review nhé!`,
    embeds: [
      {
        title: "Task đã được nộp",
        color: 3447003,
        fields: [
          {
            name: "Task ID",
            value: task.$id,
            inline: true,
          },
          {
            name: "Chapter",
            value: task.chapters?.number,
            inline: true,
          },
          {
            name: "Người nộp",
            value: task.assignedTo?.name,
            inline: true,
          },
          {
            name: "Ghi chú",
            value: note || "Không có",
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  });

  return task;
};

export const downloadSubmittedFiles = async (taskId: string) => {
  const task = await databases.getDocument({
    databaseId: DB_ID,
    collectionId: TASK_COLLECTION,
    documentId: taskId,
  });

  if (!task.submittedFiles || task.submittedFiles.length === 0) {
    throw new Error("Task chưa có file nộp");
  }

  const zip = await createZipFromS3Files(
    task.submittedFiles,
    `submitted-task-${taskId}.zip`,
  );

  return {
    ...task,
    zip,
  };
};
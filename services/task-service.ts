import { databases, ID } from "@/lib/appwrite";
import {
  CHAPTER_COLLECTION,
  CHAPTER_WORK_COLLECTION,
  DB_ID,
  TASK_COLLECTION,
} from "@/types/collections";
import { Query } from "appwrite";
import { getMemberId } from "./member-service";
import { uploadFile } from "@/helper/upload-file";

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
    data.taskFiles.map((file) => uploadFile(file))
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

  // 5️⃣ gửi notification qua Discord
  await fetch(process.env.NEXT_PUBLIC_DISCORD_WEBHOOK!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: `<@${task.assignedTo.discordId}> có task mới`,
      embeds: [
        {
          title: "📢 Task mới được giao",
          color: 5814783,
          fields: [
            {
              name: "Chapter",
              value: `Chapter ${task.chapters.number}`,
              inline: true,
            },
            {
              name: "Role",
              value: task.role.label,
              inline: true,
            },
            {
              name: "Người giao",
              value: task.assignedTo.name,
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
        },
      ],
    }),
  });

  return task;
};

export const startTask = async (taskId: string) => {
  // update task trước để lấy chapterId
  const task = await databases.updateDocument({
    databaseId: DB_ID,
    collectionId: TASK_COLLECTION,
    documentId: taskId,
    data: {
      status: "in-progress",
    },
  });

  const chapterId = task.chapters.$id;

  // chạy song song
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
      queries: [
        Query.equal("task", taskId),
        Query.limit(1), // tránh lấy dư
      ],
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

  return task;
};

export const reviewTask = async (
  taskId: string,
  status: "approved" | "rejected",
  reviewNote?: string,
) => {
  return await databases.updateDocument({
    databaseId: DB_ID,
    collectionId: TASK_COLLECTION,
    documentId: taskId,
    data: {
      status,
      reviewedAt: new Date().toISOString(),
      reviewNote: reviewNote ?? null,
    },
  });
};

export const submitTask = async (
  taskId: string,
  files: File[],
  note?: string,
) => {

  const uploadedUrls = await Promise.all(
    files.map((file) => uploadFile(file))
  );

  const task = await databases.updateDocument({
    databaseId: DB_ID,
    collectionId: TASK_COLLECTION,
    documentId: taskId,
    data: {
      submittedFiles: uploadedUrls,
      submittedAt: new Date().toISOString(),
      noteSubmited: note ?? null,
      status: "submitted",
    },
  });

  return task;
};

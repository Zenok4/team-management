import { databases, ID } from "@/lib/appwrite";
import { Query } from "appwrite";
import { DB_ID, CHAPTER_WORK_COLLECTION } from "@/types/collections";

export const getChapterWorksByMangaId = async (mangaId: string) => {
  const res = await databases.listDocuments({
    databaseId: DB_ID,
    collectionId: CHAPTER_WORK_COLLECTION,
    queries: [
      Query.equal("manga", mangaId),
      Query.select(["*", "members.*", "roles.*", "chapters.*", "manga.*"]),
    ],
  });

  return res.documents;
};

export const getChapterWorkers = async (chapterId: string) => {
  const res = await databases.listDocuments({
    databaseId: DB_ID,
    collectionId: CHAPTER_WORK_COLLECTION,
    queries: [
      Query.equal("chapters", chapterId),
      Query.select(["*", "members.*", "roles.*", "chapters.*"]),
    ],
  });

  return res.documents;
};

export const getMemberWorks = async (memberId: string) => {
  const res = await databases.listDocuments({
    databaseId: DB_ID,
    collectionId: CHAPTER_WORK_COLLECTION,
    queries: [
      Query.equal("members", memberId),
      Query.select(["*", "chapters.*", "members.*", "roles.*"]),
    ],
  });

  return res.documents;
};

export const createChapterWork = async ({
  mangaId,
  chapterId,
  memberId,
  role,
}: {
  mangaId: string;
  chapterId: string;
  memberId?: string;
  role?: string;
}) => {
  return await databases.createDocument({
    databaseId: DB_ID,
    collectionId: CHAPTER_WORK_COLLECTION,
    documentId: ID.unique(),
    data: {
      manga: mangaId,
      chapters: chapterId,
      members: memberId,
      roles: role,
    },
  });
};

export const deleteChapterWork = async (id: string) => {
  return await databases.deleteDocument(
    DB_ID,
    CHAPTER_WORK_COLLECTION,
    id
  );
};
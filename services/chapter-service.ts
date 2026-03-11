import { databases, ID } from "@/lib/appwrite";
import { DB_ID, CHAPTER_COLLECTION } from "@/types/collections";
import { Query } from "appwrite";

export const getChaptersByMangaId = async (mangaId: string) => {
  const res = await databases.listDocuments({
    databaseId: DB_ID,
    collectionId: CHAPTER_COLLECTION,
    queries: [Query.equal("manga", mangaId), Query.orderAsc("number")],
  });

  return res.documents;
};

export const createChapter = async ({
  number,
  title,
  mangaId,
}: {
  number: number;
  title?: string;
  mangaId: string;
}) => {
  const res = await databases.createDocument({
    databaseId: DB_ID,
    collectionId: CHAPTER_COLLECTION,
    documentId: ID.unique(),
    data: {
      number,
      title,
      manga: mangaId,
      status: "pending",
    },
  });

  return res;
};

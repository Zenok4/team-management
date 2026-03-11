import { databases } from "@/lib/appwrite";
import { DB_ID, MANGA_COLLECTION } from "@/types/collections";

export const getMangas = async () => {
  const res = await databases.listDocuments({
    databaseId: DB_ID,
    collectionId: MANGA_COLLECTION,
  });
  return res.documents;
}

export const getMangaById = async (id: string) => {
  const res = await databases.getDocument({
    databaseId: DB_ID,
    collectionId: MANGA_COLLECTION,
    documentId: id,
  });
  return res;
}

export const createManga = async (title: string, description: string, cover: string) => {
  const res = await databases.createDocument({
    databaseId: DB_ID,
    collectionId: MANGA_COLLECTION,
    documentId: "unique()",
    data: {
      title,
      description,
      cover,
      totalChapters: 0,
      completedChapters: 0,
    },
  });
  return res;
}
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

export const increaseMangaChapterCount = async (mangaId: string) => {
  const manga = await databases.getDocument(
    DB_ID,
    MANGA_COLLECTION,
    mangaId
  );

  return await databases.updateDocument(
    DB_ID,
    MANGA_COLLECTION,
    mangaId,
    {
      totalChapters: (manga.totalChapters ?? 0) + 1,
    }
  );
};

export const increaseCompletedChapterCount = async (mangaId: string) => {
  const manga = await databases.getDocument(
    DB_ID,
    MANGA_COLLECTION,
    mangaId
  );

  return await databases.updateDocument(
    DB_ID,
    MANGA_COLLECTION,
    mangaId,
    {
      completedChapters: (manga.completedChapters ?? 0) + 1,
    }
  );
};
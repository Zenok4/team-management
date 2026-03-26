import { getFileUrl } from "@/helper/generate-signed-url";
import { uploadToS3 } from "@/helper/uploadToS3";
import { databases } from "@/lib/appwrite";
import { DB_ID, MANGA_COLLECTION } from "@/types/collections";

export const getMangas = async () => {
  const res = await databases.listDocuments({
    databaseId: DB_ID,
    collectionId: MANGA_COLLECTION,
  });

  const mangas = await Promise.all(
    res.documents.map(async (manga) => {
      if (!manga.cover) return manga;

      const key = manga.cover.split("/").pop();

      const signedUrl = await getFileUrl(key);

      return {
        ...manga,
        cover: signedUrl,
      };
    }),
  );
  return mangas;
};

export const getMangaById = async (id: string) => {
  const res = await databases.getDocument({
    databaseId: DB_ID,
    collectionId: MANGA_COLLECTION,
    documentId: id,
  });

  const manga = res;

  if (manga.cover) {
    const key = manga.cover.split("/").pop();

    const signedUrl = await getFileUrl(key);
    manga.cover = signedUrl;
  }

  return res;
};

export const createManga = async (
  title: string,
  description: string,
  cover?: File,
) => {
  let uploadedUrls: string | null = "";
  if (cover) {
    uploadedUrls = await uploadToS3(cover);
  }

  const res = await databases.createDocument({
    databaseId: DB_ID,
    collectionId: MANGA_COLLECTION,
    documentId: "unique()",
    data: {
      title,
      description,
      cover: uploadedUrls || "",
      totalChapters: 0,
      completedChapters: 0,
    },
  });
  return res;
};

export const increaseMangaChapterCount = async (mangaId: string) => {
  const manga = await databases.getDocument(DB_ID, MANGA_COLLECTION, mangaId);

  return await databases.updateDocument(DB_ID, MANGA_COLLECTION, mangaId, {
    totalChapters: (manga.totalChapters ?? 0) + 1,
  });
};

export const increaseCompletedChapterCount = async (mangaId: string) => {
  const manga = await databases.getDocument(DB_ID, MANGA_COLLECTION, mangaId);

  return await databases.updateDocument({
    databaseId: DB_ID, 
    collectionId: MANGA_COLLECTION, 
    documentId: mangaId, 
    data: {
    completedChapters: (manga.completedChapters ?? 0) + 1,
  }
});
};

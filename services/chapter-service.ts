import { databases, ID } from "@/lib/appwrite";
import { DB_ID, CHAPTER_COLLECTION } from "@/types/collections";
import { Query } from "appwrite";
import { createChapterWork } from "./chapter-work-service";
import { increaseMangaChapterCount } from "./manga-service";

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
  let chapterId: string | null = null;

  try {
    const chapter = await databases.createDocument({
      databaseId: DB_ID,
      collectionId: CHAPTER_COLLECTION,
      documentId: ID.unique(),
      data: {
        number,
        title: title ?? null,
        manga: mangaId,
      },
    });

    chapterId = chapter.$id;

    await Promise.all([
      createChapterWork({
        chapterId: chapter.$id,
        mangaId,
      }),
      increaseMangaChapterCount(mangaId),
    ]);

    return chapter;
  } catch (err) {
    if (chapterId) {
      await databases.deleteDocument(
        DB_ID,
        CHAPTER_COLLECTION,
        chapterId
      );
    }
    throw err;
  }
};
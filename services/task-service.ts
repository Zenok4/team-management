import { databases } from "@/lib/appwrite";
import { DB_ID, TASK_COLLECTION } from "@/types/collections";

export const getTasks = async () => {
  const res = await databases.listDocuments({
    databaseId: DB_ID,
    collectionId: TASK_COLLECTION,
  });
  return res.documents;
};

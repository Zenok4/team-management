import { databases } from "@/lib/appwrite";
import { DB_ID, ROLE_COLLECTION } from "@/types/collections";
import { Query } from "appwrite";

export const getRoles = async () => {
  const res = await databases.listDocuments({
    databaseId: DB_ID,
    collectionId: ROLE_COLLECTION,
    queries: [
      Query.isNull("deletedAt")
    ],
  });

  return res.documents;
};

export const deleteRole = async (id: string) => {
  return await databases.updateDocument({
    databaseId: DB_ID,
    collectionId: ROLE_COLLECTION,
    documentId: id,
    data: {
      deletedAt: new Date().toISOString(),
    },
  });
};
import { account, databases } from "@/lib/appwrite";
import { DB_ID, MEMBER_COLLECTION } from "@/types/collections";
import { Query } from "appwrite";

export const getMembers = async () => {
  const res = await databases.listDocuments({
    databaseId: DB_ID,
    collectionId: MEMBER_COLLECTION,
    queries: [
      Query.isNull("deletedAt"),
      Query.select([
        "*",
        "roles.*"
      ])
    ],
  });

  return res.documents;
};

export const getMemberId = async (userId: string) => {

  const member = await databases.listDocuments({
    databaseId: DB_ID,
    collectionId: MEMBER_COLLECTION,
    queries: [Query.equal("userId", userId), Query.limit(1)],
  });

  if (member.total === 0) {
    throw new Error("Member not found");
  }

  return member.documents[0].$id;
};
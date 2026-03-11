// lib/appwrite.ts
import { Client, Account, Databases, Teams, ID, Functions } from "appwrite";

export const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);
export const teams = new Teams(client);
export const functions = new Functions(client);
export { ID };

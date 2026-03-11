// hooks/useCrudPermission.ts
import { PermissionAction } from "@/types/permission-type";
import useCan from "./useCan";

const useCrudPermission = (resource: string, action: PermissionAction) => {
  return useCan(`${resource}:${action}`);
};

export default useCrudPermission;

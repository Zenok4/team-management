import { PermissionAction } from "@/types/permission-type";

const hasPermission = (
  permissions: string[],
  action: PermissionAction
) => {
  return permissions.some(p => p.startsWith(action));
}

export default hasPermission

// hooks/useCan.ts
import { usePermissionContext } from "@/context/PermissionContext";

const useCan = (permissionKey: string) => {
  const { permissions, loading } = usePermissionContext();

  return {
    can: permissions.has(permissionKey),
    loading,
  };
};

export default useCan;

import useCan from "@/hooks/useCan";

const RequirePermission = ({
  permission,
  children,
}: {
  permission: string;
  children: React.ReactNode;
}) => {
  const { can, loading } = useCan(permission);

  if (loading) return null;
  if (!can) return null;

  return <>{children}</>;
};

export default RequirePermission;

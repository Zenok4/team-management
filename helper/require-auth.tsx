import { useAuth } from "@/context/AuthContext";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return null;

  return <>{children}</>;
};

export default RequireAuth;

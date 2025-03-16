
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const isAdminUser = (email: string) => {
  return email === "janedoe@gmail.com";
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Special case for admin route
    if (location.pathname === "/admin") {
      // For the admin page, we'll use the sessionStorage to check if admin has logged in
      const adminEmail = sessionStorage.getItem("adminEmail");
      if (adminEmail && isAdminUser(adminEmail)) {
        // Admin is authenticated
        return;
      }
    }

    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // For admin route, we need special handling
  if (location.pathname === "/admin") {
    const adminEmail = sessionStorage.getItem("adminEmail");
    if (adminEmail && isAdminUser(adminEmail)) {
      // Admin is authenticated
      return <>{children}</>;
    } else {
      // Not admin, redirect
      navigate("/login");
      return null;
    }
  }

  return user ? <>{children}</> : null;
};

export default ProtectedRoute;

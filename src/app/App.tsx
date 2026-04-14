import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { RootLayout } from "@/app/layouts/RootLayout";
import { ProtectedRoute } from "@/app/components/ProtectedRoute";
import { Login } from "@/app/pages/Login";
import { Signup } from "@/app/pages/Signup";
import { AcceptInvite } from "@/app/pages/AcceptInvite";
import { ResetPassword } from "@/app/pages/ResetPassword";
import { Dashboard } from "@/app/pages/Dashboard";
import { Profile } from "@/app/pages/Profile";
import { Settings } from "@/app/pages/Settings";
import { Projects } from "@/app/pages/Projects";
import { CreateProject } from "@/app/pages/CreateProject";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/invite/accept" element={<AcceptInvite />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RootLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="admin" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/new" element={<CreateProject />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: { borderRadius: "12px", fontSize: "14px" },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

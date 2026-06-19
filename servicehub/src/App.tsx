import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, AppContext } from "@/context/AppContext";
import { useContext } from "react";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/Landing";
import BrowseServices from "@/pages/BrowseServices";
import ServiceDetail from "@/pages/ServiceDetail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

import CustomerOverview from "@/pages/dashboard/customer/CustomerOverview";
import CustomerRequests from "@/pages/dashboard/customer/CustomerRequests";
import CustomerProfile from "@/pages/dashboard/customer/CustomerProfile";

import ProviderOverview from "@/pages/dashboard/provider/ProviderOverview";
import ProviderServices from "@/pages/dashboard/provider/ProviderServices";
import ProviderRequests from "@/pages/dashboard/provider/ProviderRequests";
import ProviderEarnings from "@/pages/dashboard/provider/ProviderEarnings";
import ProviderProfile from "@/pages/dashboard/provider/ProviderProfile";

import AdminOverview from "@/pages/dashboard/admin/AdminOverview";
import AdminUsers from "@/pages/dashboard/admin/AdminUsers";
import AdminServices from "@/pages/dashboard/admin/AdminServices";
import AdminProjects from "@/pages/dashboard/admin/AdminProjects";

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1 } } });

function RequireAuth({ children, roles }: { children: JSX.Element; roles: string[] }) {
  const { currentUser } = useContext(AppContext);
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!roles.includes(currentUser.role)) {
    if (currentUser.role === "admin") return <Navigate to="/dashboard/admin" replace />;
    if (currentUser.role === "provider") return <Navigate to="/dashboard/provider" replace />;
    return <Navigate to="/dashboard/customer" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/services" element={<BrowseServices />} />
      <Route path="/services/:id" element={<ServiceDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard/customer" element={<RequireAuth roles={["customer"]}><CustomerOverview /></RequireAuth>} />
      <Route path="/dashboard/customer/requests" element={<RequireAuth roles={["customer"]}><CustomerRequests /></RequireAuth>} />
      <Route path="/dashboard/customer/profile" element={<RequireAuth roles={["customer"]}><CustomerProfile /></RequireAuth>} />

      <Route path="/dashboard/provider" element={<RequireAuth roles={["provider"]}><ProviderOverview /></RequireAuth>} />
      <Route path="/dashboard/provider/services" element={<RequireAuth roles={["provider"]}><ProviderServices /></RequireAuth>} />
      <Route path="/dashboard/provider/requests" element={<RequireAuth roles={["provider"]}><ProviderRequests /></RequireAuth>} />
      <Route path="/dashboard/provider/earnings" element={<RequireAuth roles={["provider"]}><ProviderEarnings /></RequireAuth>} />
      <Route path="/dashboard/provider/profile" element={<RequireAuth roles={["provider"]}><ProviderProfile /></RequireAuth>} />

      <Route path="/dashboard/admin" element={<RequireAuth roles={["admin"]}><AdminOverview /></RequireAuth>} />
      <Route path="/dashboard/admin/users" element={<RequireAuth roles={["admin"]}><AdminUsers /></RequireAuth>} />
      <Route path="/dashboard/admin/services" element={<RequireAuth roles={["admin"]}><AdminServices /></RequireAuth>} />
      <Route path="/dashboard/admin/projects" element={<RequireAuth roles={["admin"]}><AdminProjects /></RequireAuth>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <AppRoutes />
          </BrowserRouter>
          <Toaster position="bottom-right" richColors />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;

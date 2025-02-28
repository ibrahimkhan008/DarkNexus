import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Gateway from "@/pages/gateway";
import Profile from "@/pages/profile";
import Sidebar from "@/components/layout/sidebar"; // Added import for Sidebar
import NotFound from "@/pages/not-found";
import { AuthProvider, useAuth } from "@/lib/auth"; // Import AuthProvider and useAuth
import "./lib/i18n";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated, loading } = useAuth();
  const [location] = useLocation();

  if (loading) return null;

  if (!isAuthenticated) return <Login />;

  return (
    <>
      <Sidebar />
      <Component {...rest} />
    </>
  );
}


function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/dashboard" component={()=> <ProtectedRoute component={Dashboard} />} />
      <Route path="/gateway/:id" component={()=> <ProtectedRoute component={Gateway} />} />
      <Route path="/profile" component={()=> <ProtectedRoute component={Profile} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
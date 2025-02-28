import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Gateway from "@/pages/gateway";
import Profile from "@/pages/profile";
import Sidebar from "@/components/layout/sidebar";
import NotFound from "@/pages/not-found";
import { AuthProvider, useAuth } from "@/lib/auth";
import "./lib/i18n";
import NewsPage from "@/pages/news"; // Added import for NewsPage


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
      <Route path="/news" component={()=> <ProtectedRoute component={NewsPage} />} /> {/* Added News route */}
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
import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import Gateway from "@/pages/gateway";
import Profile from "@/pages/profile";
import Dashboard from "@/pages/dashboard";

// Import other necessary components

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Route path="/login" />;
  }
  
  return <Component {...rest} />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/dashboard">
            {() => <ProtectedRoute component={Dashboard} />}
          </Route>
          <Route path="/gateway/:id">
            {(params) => <ProtectedRoute component={Gateway} params={params} />}
          </Route>
          <Route path="/profile">
            {() => <ProtectedRoute component={Profile} />}
          </Route>
          <Route path="/">
            {() => <ProtectedRoute component={Dashboard} />}
          </Route>
        </Switch>
      </AuthProvider>
    </QueryClientProvider>
  );
}

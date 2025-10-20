// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedDashboard from "./components/protectedDashboard/ProtectedDashboard";
import Dashboard from "./components/dashboard/Dashboard";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/config";

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Create a client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="selfassessment-ui-theme">
        <Router>
          <Routes>
            {/* Login and root */}
            <Route path="/" element={<ProtectedDashboard />} />

            {/* Dashboard routes - handles all /dashboard/* paths */}
            <Route
              path="dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster position="bottom-right" richColors closeButton />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

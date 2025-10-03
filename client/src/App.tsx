// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedDashboard from "./components/protectedDashboard/ProtectedDashboard";
import Dashboard from "./components/dashboard/Dashboard";

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
            {/* Redirect root to dashboard */}
            <Route path="/" element={<ProtectedDashboard />} />

            {/* Dashboard routes - handles all /dashboard/* paths */}
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Routes>
          <Toaster position="bottom-right" richColors closeButton />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

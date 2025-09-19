// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedDashboard from "./components/protectedDashboard/ProtectedDashboard";
import Dashboard from "./components/dashboard/Dashboard";

function App() {
  return (
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
  );
}

export default App;

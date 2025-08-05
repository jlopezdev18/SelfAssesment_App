// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedDashboard from './components/protectedDashboard/ProtectedDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard routes - handles all /dashboard/* paths */}
        <Route path="/dashboard/*" element={<ProtectedDashboard />} />
        
        {/* Catch-all route - redirect unknown paths to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
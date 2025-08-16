// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedDashboard from './components/protectedDashboard/ProtectedDashboard';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<ProtectedDashboard />} />
        
        {/* Dashboard routes - handles all /dashboard/* paths */}
        <Route path="/dashboard/*" element={<Dashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;
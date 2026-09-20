import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateJob from './pages/Createjob';
import JobDetails from './pages/JobDetails';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-job" element={<CreateJob />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
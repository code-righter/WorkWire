
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { AppRoutes } from './routes/AppRoutes.tsx';

console.log("Frontend app started")
function App() {
  console.log("Frontend app started")
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
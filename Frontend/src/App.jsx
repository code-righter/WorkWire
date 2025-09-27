// src/App.jsx
import React from 'react';
import Login from './pages/Login.jsx';
import ManagerDashboard from './components/ManagerDashboard.jsx';
import AppLayout from './layout/AppLayout.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

function App() {
  return (
    <AppRoutes/>
  );
}

export default App;


  // <AuthContextProvider>
    //   <Routes>
    //     <Route path="/" element={<Login />} />
    //     <Route path="/dashboard" element={<ManagerView />} />
    //   </Routes>
    // </AuthContextProvider>

      //     <AppLayout>
      //   <div className="flex h-screen w-screen overflow-hidden">
      //     <Sidebar />
      //     <main className="flex-1 h-screen p-4 bg-stone-100">
      //       <div className="min-w-[1200px]">
      //         <ManagerDashboard/>
      //       </div>
      //     </main>
      //   </div>
      // </AppLayout>
// App Component
import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import TopBar from './components/layout/TopBar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AppRoutes from './routes';
import './assets/styles/global.css';
import AdminHeader from './components/layout/AdminHeader/AdminHeader';
import AdminFooter from './components/layout/AdminFooter/AdminFooter';
import { useAuth } from './hooks/useAuth';

function LayoutSwitcher() {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();

  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath || (isAuthenticated && isAdmin)) {
    return (
      <div className="App">
        <AdminHeader />
        <main className="App-main">
          <AppRoutes />
        </main>
        <AdminFooter />
      </div>
    );
  }

  return (
    <div className="App">
      <TopBar />
      <Header />
      <main className="App-main">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LayoutSwitcher />
    </BrowserRouter>
  );
}

export default App;


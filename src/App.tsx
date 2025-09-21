import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './contexts/StoreContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import OrderForm from './components/OrderForm';
import AdminPanel from './components/AdminPanel';
import LoginForm from './components/LoginForm';

function AppContent() {
  const { state } = useStore();
  const { user, loading } = useAuth();

  // Handle routing based on URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      // Don't change view automatically, let the component handle it
    } else if (path.startsWith('/order')) {
      // Handle order routing if needed
    }
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-pink-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }
  
  const renderCurrentView = () => {
    const path = window.location.pathname;
    
    if (path === '/admin' || state.currentView === 'admin') {
      return user ? <AdminPanel /> : <LoginForm />;
    }
    
    switch (state.currentView) {
      case 'order':
        return <OrderForm />;
      default:
        return <ProductGrid />;
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {renderCurrentView()}
      </main>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <StoreProvider>
          <AppContent />
        </StoreProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
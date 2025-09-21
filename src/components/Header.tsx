import React from 'react';
import { User, Search, LogOut } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  const { dispatch } = useStore();
  const { t, isRTL } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-50
        bg-gradient-to-r from-pink-500 to-rose-500 shadow-2xl
      "
    >
      <div className="container mx-auto px-4 py-4">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>

          {/* Logo & Tagline */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            <div
              className="text-3xl font-black text-white cursor-pointer hover:text-pink-100 smooth-transition tracking-wider"
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'store' })}
            >
              F.H Store
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1"></div>

          {/* Language Selector and User Controls */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            <LanguageSelector />

            <div className="flex items-center space-x-2">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      window.history.pushState({}, '', '/admin');
                      dispatch({ type: 'SET_VIEW', payload: 'admin' });
                    }}
                    className="px-4 py-2 bg-white hover:bg-pink-50 text-pink-600 rounded-full smooth-transition font-bold"
                    title={t('admin.mode')}
                  >
                    <User className="h-4 w-4 inline mr-2" />
                    {t('admin.mode')}
                  </button>
                  <button
                    onClick={logout}
                    className="p-2 hover:bg-white/20 text-white rounded-full smooth-transition"
                    title={t('logout')}
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    window.history.pushState({}, '', '/admin');
                    dispatch({ type: 'SET_VIEW', payload: 'admin' });
                  }}
                  className="px-4 py-2 bg-white hover:bg-pink-50 text-pink-600 rounded-full smooth-transition font-bold"
                >
                  <User className="h-4 w-4 inline mr-2" />
                  {t('admin.mode')}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
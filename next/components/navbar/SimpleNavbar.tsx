'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export function SimpleNavbar() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-xl sm:text-2xl font-bold text-primary cursor-pointer">
                LEAD BLOCKS
              </h1>
            </Link>
          </div>

          {/* Desktop view */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="text-sm text-text-muted">Loading...</div>
            ) : (
              <>
                {isAuthenticated && user ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-text">
                      {user?.username || user?.email?.split('@')[0]}
                    </span>
                    <Button variant="primary" size="sm" onClick={logout}>
                      Logout
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="outline" size="sm">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button variant="primary" size="sm">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile view */}
          <div className="md:hidden">
            {isLoading ? (
              <div className="text-sm text-text-muted">Loading...</div>
            ) : (
              <>
                {isAuthenticated && user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      aria-label="User menu"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                        {(user?.username?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase()}
                      </div>
                    </button>
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-text">
                            {user?.username || user?.email?.split('@')[0]}
                          </p>
                          <p className="text-xs text-text-muted truncate">
                            {user?.email}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      aria-label="Menu"
                    >
                      <svg
                        className="w-5 h-5 text-text"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {isMenuOpen ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        )}
                      </svg>
                    </button>
                    {isMenuOpen && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                        <Link
                          href="/login"
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-text hover:bg-gray-50 transition-colors"
                        >
                          Login
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-text hover:bg-gray-50 transition-colors"
                        >
                          Sign Up
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

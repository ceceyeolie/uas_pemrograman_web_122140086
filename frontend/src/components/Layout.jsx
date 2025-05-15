// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow py-6">
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>
      <footer className="bg-black text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Portal Berita. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
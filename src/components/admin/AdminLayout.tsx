'use client';

import { useState } from 'react';
import { Bell, User, ExternalLink, Menu, X } from 'lucide-react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  activePage: string;
}

const AdminLayout = ({ children, activePage }: AdminLayoutProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-emerald-50 text-gray-900">
      <div className="flex">
        <AdminSidebar
          activePage={activePage}
          isMobileOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
        )}

        <div className="flex-1 flex flex-col min-h-screen">
          <header className="bg-white border-b border-emerald-100 sticky top-0 z-10">
            <div className="px-4 py-3 flex items-center gap-4 justify-between">
              <div className="flex items-center gap-3">
                <button
                  className="md:hidden p-2 rounded-lg border border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  aria-label="Toggle sidebar"
                >
                  {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Admin</p>
                  <h1 className="text-xl font-semibold text-emerald-900">
                    {activePage.charAt(0).toUpperCase() + activePage.slice(1)}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-200 text-emerald-800 hover:bg-emerald-50 transition"
                  target="_blank"
                >
                  <ExternalLink size={16} />
                  <span>View site</span>
                </Link>

                <button className="p-2 rounded-full hover:bg-emerald-50 text-emerald-800">
                  <Bell size={18} />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-700 text-white"
                    aria-label="Account menu"
                  >
                    <User size={16} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30 border border-emerald-100">
                      <Link
                        href="/admin/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <Link
                        href="/admin/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Settings
                      </Link>
                      <Link
                        href="/admin/logout"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Sign out
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6">
            <div className="max-w-6xl mx-auto space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

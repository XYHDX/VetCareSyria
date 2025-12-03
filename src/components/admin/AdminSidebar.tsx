'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  LogOut,
  Home,
  Briefcase,
  Mail,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';

interface AdminSidebarProps {
  activePage: string;
  isMobileOpen: boolean;
  onClose: () => void;
}

const AdminSidebar = ({ activePage, isMobileOpen, onClose }: AdminSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: 'dashboard', label: 'Dashboard', icon: <Home size={20} />, path: '/admin' },
    { name: 'partners', label: 'Partners', icon: <Settings size={20} />, path: '/admin/partners' },
    { name: 'products', label: 'Products', icon: <Briefcase size={20} />, path: '/admin/products' },
    { name: 'contact', label: 'Contact', icon: <Mail size={20} />, path: '/admin/contact' },
    { name: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-30 bg-emerald-900 text-white ${collapsed ? 'w-20' : 'w-72'} transform transition-all duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } flex flex-col shadow-lg`}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-emerald-800">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 bg-white/10 rounded-full overflow-hidden">
            <Image
              src="/images/vetcare-logo.svg"
              alt="VetcareSyria"
              fill
              sizes="40px"
              className="object-contain"
            />
          </div>
          {!collapsed && (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Admin</p>
              <p className="text-lg font-semibold">VetcareSyria</p>
            </div>
          )}
        </div>
        <button
          onClick={() => (collapsed ? setCollapsed(false) : setCollapsed(true))}
          className="hidden md:inline-flex items-center justify-center text-emerald-100 hover:text-white"
          aria-label="Toggle collapse"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-grow py-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`mx-3 flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${activePage === item.name
                    ? 'bg-white text-emerald-900'
                    : 'text-emerald-100 hover:bg-emerald-800/80'
                  }`}
                onClick={onClose}
              >
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-emerald-800">
        <Link
          href="/logout"
          className="flex items-center text-emerald-100 hover:text-white transition-colors"
          onClick={onClose}
        >
          <LogOut size={20} className="mr-3" />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;

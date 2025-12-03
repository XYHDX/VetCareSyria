'use client';

import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Clock, Users, Eye, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface Stat {
  title: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
}

interface Update {
  section: string;
  updatedAt: string;
}

interface ApiStatsResponse {
  stats: {
    id: string;
    title: string;
    value: string;
    accent: string;
  }[];
  recentUpdates: Update[];
  lastUpdated?: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const iconMap: Record<string, React.ReactNode> = useMemo(
    () => ({
      partners: <Users size={20} />,
      products: <Eye size={20} />,
      site: <Clock size={20} />,
      contact: <Clock size={20} />
    }),
    []
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/admin/stats', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data: ApiStatsResponse = await res.json();

        setStats(
          data.stats.map((stat) => ({
            title: stat.title,
            value: stat.value,
            accent: stat.accent,
            icon: iconMap[stat.id] || <Clock size={20} />
          }))
        );
        setRecentUpdates(data.recentUpdates || []);
        setError('');
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Unable to load dashboard stats right now.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <AdminLayout activePage="dashboard">
      <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-700">Overview</p>
            <h1 className="text-2xl font-bold text-emerald-900">Welcome to the Admin Dashboard</h1>
            <p className="text-gray-600">Manage and update the VetcareSyria site content.</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition"
            target="_blank"
          >
            Go to site
            <ArrowUpRight size={18} />
          </Link>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 text-red-700 px-4 py-2">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {(loading
            ? [
                { title: 'Loading', value: '—', icon: <Clock size={20} className="animate-pulse" />, accent: 'bg-emerald-100 text-emerald-800' },
                { title: 'Loading', value: '—', icon: <Clock size={20} className="animate-pulse" />, accent: 'bg-teal-100 text-teal-800' },
                { title: 'Loading', value: '—', icon: <Clock size={20} className="animate-pulse" />, accent: 'bg-sky-100 text-sky-800' }
              ]
            : stats
          ).map((stat, index) => (
            <div
              key={index}
              className="rounded-xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm flex items-center gap-4"
            >
              <div className={`p-3 rounded-lg ${stat.accent}`}>{stat.icon}</div>
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-emerald-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-emerald-100 rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-emerald-900 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: '/admin/partners', label: 'Manage Partners' },
                { href: '/admin/products', label: 'Manage Products' },
                { href: '/admin/contact', label: 'Contact Details' },
                { href: '/admin/settings', label: 'Site Settings' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-4 py-3 rounded-lg border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50 text-emerald-900 transition"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight size={16} className="text-emerald-700" />
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white border border-emerald-100 rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-emerald-900 mb-3">Recent Updates</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-500">
                    <th className="py-2 pr-6 font-medium">Section</th>
                    <th className="py-2 pr-6 font-medium">Date</th>
                    <th className="py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100">
                  {(loading ? [] : recentUpdates).map((update, index) => (
                    <tr key={index} className="text-gray-800">
                      <td className="py-3 pr-6 font-medium">{update.section}</td>
                      <td className="py-3 pr-6 text-gray-600">
                        {new Date(update.updatedAt).toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span className="inline-flex px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                          Updated
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!loading && recentUpdates.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-4 text-gray-600">
                        No updates recorded yet.
                      </td>
                    </tr>
                  )}
                  {loading && (
                    <tr>
                      <td colSpan={3} className="py-4 text-gray-600">
                        Loading…
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Save, Trash2, Upload, Globe } from 'lucide-react';
import type { Partner } from '@/lib/partners';

const emptyPartner: Partner = {
  id: '',
  name: '',
  website: '',
  logo: ''
};

const PartnersPage = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [editing, setEditing] = useState<Partner>(emptyPartner);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadPartners = async () => {
    try {
      const res = await fetch('/api/admin/partners');
      const data: Partner[] = await res.json();
      setPartners(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load partners.');
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const startNew = () => {
    setEditing({ ...emptyPartner, id: crypto.randomUUID() });
    setIsEditing(true);
    setMessage('');
    setError('');
  };

  const startEdit = (partner: Partner) => {
    setEditing(partner);
    setIsEditing(true);
    setMessage('');
    setError('');
  };

  const removePartner = async (id: string) => {
    if (!confirm('Delete this partner?')) return;
    const updated = partners.filter((p) => p.id !== id);
    await persist(updated, 'Partner deleted');
  };

  const persist = async (list: Partner[], success: string) => {
    setIsSaving(true);
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/admin/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(list)
      });
      if (!res.ok) throw new Error(await res.text());
      setPartners(list);
      setIsEditing(false);
      setMessage(success);
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      console.error(err);
      setError('Could not save partners. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing.name) {
      setError('Name is required');
      return;
    }
    const exists = partners.find((p) => p.id === editing.id);
    const updated = exists
      ? partners.map((p) => (p.id === editing.id ? editing : p))
      : [...partners, editing];
    await persist(updated, 'Partners saved');
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error(await res.text());
      const data: { url?: string } = await res.json();
      if (data?.url) {
        setEditing((prev) => ({ ...prev, logo: data.url }));
      } else {
        throw new Error('No URL returned from upload');
      }
    } catch (err) {
      console.error('Upload failed', err);
      setError('Logo upload failed. Please try again.');
    }
  };

  return (
    <AdminLayout activePage="partners">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-emerald-900">Partners</h1>
          <p className="text-gray-600">Manage partner companies, logos, and websites</p>
        </div>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 rounded-md bg-emerald-700 text-white px-3 py-2 hover:bg-emerald-800"
        >
          <Plus size={16} /> New partner
        </button>
      </div>

      {message && <div className="rounded-md bg-emerald-50 text-emerald-700 px-4 py-2">{message}</div>}
      {error && <div className="rounded-md bg-red-50 text-red-700 px-4 py-2">{error}</div>}

      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="rounded-lg border border-emerald-100 bg-white p-4 shadow-sm flex items-start justify-between gap-3"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  {partner.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={partner.logo} alt={partner.name} className="h-10 w-10 object-contain rounded-md border border-emerald-100" />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center text-sm text-emerald-700">
                      Logo
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-900">{partner.name}</h3>
                    {partner.website && (
                      <div className="text-sm text-emerald-700 flex items-center gap-1">
                        <Globe size={14} />
                        <span className="break-all">{partner.website}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => startEdit(partner)}
                  className="text-emerald-700 hover:text-emerald-900 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => removePartner(partner.id)}
                  className="text-red-600 hover:text-red-700 text-sm inline-flex items-center gap-1"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
          {partners.length === 0 && (
            <div className="rounded-lg border border-dashed border-emerald-200 bg-white p-6 text-center text-gray-600">
              No partners yet. Click “New partner” to add your first item.
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-white border border-emerald-100 rounded-lg p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring focus:ring-emerald-200 focus:border-emerald-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="text"
              value={editing.website || ''}
              onChange={(e) => setEditing({ ...editing, website: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring focus:ring-emerald-200 focus:border-emerald-400"
              placeholder="https://partner-website.com"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700">Logo URL</label>
              <input
                type="text"
                value={editing.logo || ''}
                onChange={(e) => setEditing({ ...editing, logo: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring focus:ring-emerald-200 focus:border-emerald-400"
                placeholder="/images/partners/logo.png"
              />
            </div>
            <div className="flex gap-2">
              <label
                htmlFor="logoUpload"
                className="inline-flex items-center gap-2 rounded-md border border-emerald-200 px-3 py-2 text-emerald-800 hover:bg-emerald-50 cursor-pointer"
              >
                <Upload size={16} />
                Upload
              </label>
              <input
                id="logoUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                }}
              />
              {editing.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={editing.logo} alt="logo preview" className="h-10 w-10 object-contain rounded-md border border-emerald-100" />
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-700 text-white px-4 py-2 hover:bg-emerald-800 disabled:opacity-60"
            >
              <Save size={16} /> {isSaving ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-md px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
};

export default PartnersPage;

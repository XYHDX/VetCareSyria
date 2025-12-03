'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Save, Globe, ArrowUpDown } from 'lucide-react';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteLanguage: string;
  heroNote?: string;
  primaryCta?: string;
  maxItemsPerPage: number;
}

// Moved outside the component
const defaultSettings: SiteSettings = {
  siteName: 'VetcareSyria',
  siteDescription: 'Trusted veterinary medicines, vaccines, and feed additives.',
  heroNote: 'Since 2005 • Damascus, Syria',
  primaryCta: 'Contact us',
  siteLanguage: 'en',
  maxItemsPerPage: 10
};

const SettingsPage = () => {
  const [formData, setFormData] = useState<SiteSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load settings on initial render
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/settings', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load settings');
        const data = await res.json();
        setFormData({
          ...defaultSettings,
          ...data,
        });
      } catch (err) {
        console.warn('Using default settings fallback', err);
        setFormData(defaultSettings);
      }
    };
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    // Handle different input types
    const newValue = type === 'checkbox' 
      ? checked 
      : type === 'number' 
        ? parseInt(value, 10) 
        : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      setSaveMessage('Settings updated successfully!');
    } catch (err) {
      console.error(err);
      setSaveMessage('An error occurred while saving. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout activePage="settings">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-emerald-900">Site Settings</h1>
        <p className="text-gray-700">Configure your website settings and preferences</p>
      </div>

      {saveMessage && (
        <div className={`p-4 mb-6 rounded-md ${saveMessage.includes('error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {saveMessage}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
        <form onSubmit={handleSubmit}>
          {/* General Settings */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-emerald-100 flex items-center text-emerald-900">
              <Globe size={18} className="mr-2 text-emerald-700" />
              General Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label htmlFor="siteName" className="block text-sm font-medium text-gray-800 mb-1">
                    Site Name
                  </label>
                  <input
                    type="text"
                    id="siteName"
                    name="siteName"
                    value={formData.siteName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-emerald-200 rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="heroNote" className="block text-sm font-medium text-gray-800 mb-1">
                    Hero Note (small line)
                  </label>
                  <input
                    type="text"
                    id="heroNote"
                    name="heroNote"
                    value={formData.heroNote || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-emerald-200 rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="siteLanguage" className="block text-sm font-medium text-gray-800 mb-1">
                    Default Language
                  </label>
                  <select
                    id="siteLanguage"
                    name="siteLanguage"
                    value={formData.siteLanguage}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-emerald-200 rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 bg-white"
                  >
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-800 mb-1">
                    Site Description
                  </label>
                  <textarea
                    id="siteDescription"
                    name="siteDescription"
                    rows={4}
                    value={formData.siteDescription}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-emerald-200 rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="primaryCta" className="block text-sm font-medium text-gray-800 mb-1">
                    Primary CTA text
                  </label>
                  <input
                    type="text"
                    id="primaryCta"
                    name="primaryCta"
                    value={formData.primaryCta || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-emerald-200 rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="maxItemsPerPage" className="block text-sm font-medium text-gray-800 mb-1">
                    Items Per Page
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      id="maxItemsPerPage"
                      name="maxItemsPerPage"
                      min="5"
                      max="50"
                      value={formData.maxItemsPerPage}
                      onChange={handleChange}
                      className="w-24 px-4 py-2 border border-emerald-200 rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                    />
                    <ArrowUpDown size={18} className="ml-2 text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className={`flex items-center px-6 py-2 rounded-md text-white ${
                isSaving ? 'bg-emerald-400' : 'bg-emerald-700 hover:bg-emerald-800'
              } transition-colors`}
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
              {!isSaving && <Save size={18} className="ml-2" />}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage; 

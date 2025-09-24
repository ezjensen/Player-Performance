import React, { useState } from 'react';
import { Settings as SettingsIcon, Sun, Moon, Monitor, Upload, Building2, Save, X } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useSettings();
  const [companyName, setCompanyName] = useState(settings.companyName || '');

  if (!isOpen) return null;

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoDataUrl = e.target?.result as string;
        updateSettings({ companyLogo: logoDataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCompanyName = () => {
    updateSettings({ companyName });
  };

  const removeLogo = () => {
    updateSettings({ companyLogo: undefined });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <SettingsIcon className="h-6 w-6 text-gray-900 dark:text-white mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'system', label: 'System', icon: Monitor },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => handleThemeChange(value as any)}
                  className={`flex flex-col items-center p-3 rounded-lg border-2 transition-colors ${
                    settings.theme === value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="h-5 w-5 mb-1 text-gray-700 dark:text-gray-300" />
                  <span className="text-xs text-gray-700 dark:text-gray-300">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Company Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
              Company Logo
            </label>
            {settings.companyLogo ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <img
                    src={settings.companyLogo}
                    alt="Company Logo"
                    className="max-h-16 max-w-32 object-contain"
                  />
                </div>
                <button
                  onClick={removeLogo}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-md transition-colors"
                >
                  Remove Logo
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload logo</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or SVG</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
              Company Name
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <button
                onClick={handleSaveCompanyName}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center"
              >
                <Save className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
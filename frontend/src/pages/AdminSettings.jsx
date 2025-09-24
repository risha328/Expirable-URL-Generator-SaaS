import React, { useState, useEffect } from 'react';
import api from '../api/api';
import AdminLayout from '../components/admin/AdminLayout';

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('general');

  // Settings state
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Expireo',
    siteDescription: 'Professional URL Shortening Service',
    adminEmail: 'admin@expireo.com',
    supportEmail: 'support@expireo.com',
    defaultUrlExpiration: 30, // days
    maxUrlLength: 2048,
    
    // Security Settings
    requireEmailVerification: true,
    enable2FA: false,
    sessionTimeout: 24, // hours
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    
    // Appearance Settings
    theme: 'light',
    primaryColor: '#EF4444',
    secondaryColor: '#F97316',
    logoUrl: '',
    faviconUrl: '',
    
    // Advanced Settings
    enableAnalytics: true,
    dataRetentionPeriod: 365, // days
    autoDeleteExpiredUrls: true,
    backupFrequency: 'weekly',
    maxFileUploadSize: 10, // MB
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/settings');
      if (response.data) {
        setSettings(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      showMessage('error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaveLoading(true);
      await api.put('/admin/settings', settings);
      showMessage('success', 'Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      showMessage('error', 'Failed to save settings');
    } finally {
      setSaveLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings({
        siteName: 'Expireo',
        siteDescription: 'Professional URL Shortening Service',
        adminEmail: 'admin@expireo.com',
        supportEmail: 'support@expireo.com',
        defaultUrlExpiration: 30,
        maxUrlLength: 2048,
        requireEmailVerification: true,
        enable2FA: false,
        sessionTimeout: 24,
        maxLoginAttempts: 5,
        passwordMinLength: 8,
        theme: 'light',
        primaryColor: '#EF4444',
        secondaryColor: '#F97316',
        logoUrl: '',
        faviconUrl: '',
        enableAnalytics: true,
        dataRetentionPeriod: 365,
        autoDeleteExpiredUrls: true,
        backupFrequency: 'weekly',
        maxFileUploadSize: 10,
      });
      showMessage('info', 'Settings reset to defaults');
    }
  };

  const SettingSection = ({ title, description, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const SettingField = ({ label, description, type = 'text', value, onChange, options, min, max, step }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="sm:w-1/2 mb-2 sm:mb-0">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>
      <div className="sm:w-1/2">
        {type === 'select' ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'checkbox' ? (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
          </label>
        ) : type === 'color' ? (
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
            />
            <span className="text-sm text-gray-600 font-mono">{value}</span>
          </div>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            min={min}
            max={max}
            step={step}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
          />
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'appearance', name: 'Appearance', icon: '🎨' },
    { id: 'advanced', name: 'Advanced', icon: '🔧' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Settings</h1>
          <p className="text-gray-600">Manage your application settings and configuration</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
            message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
            'bg-blue-50 border border-blue-200 text-blue-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <SettingSection
                title="General Settings"
                description="Basic configuration for your URL shortening service"
              >
                <SettingField
                  label="Site Name"
                  description="The name of your application"
                  value={settings.siteName}
                  onChange={(value) => handleInputChange('general', 'siteName', value)}
                />
                <SettingField
                  label="Site Description"
                  description="A brief description of your service"
                  value={settings.siteDescription}
                  onChange={(value) => handleInputChange('general', 'siteDescription', value)}
                />
                <SettingField
                  label="Admin Email"
                  description="Primary email for administrative notifications"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(value) => handleInputChange('general', 'adminEmail', value)}
                />
                <SettingField
                  label="Support Email"
                  description="Email address for user support"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(value) => handleInputChange('general', 'supportEmail', value)}
                />
                <SettingField
                  label="Default URL Expiration"
                  description="Default expiration time for shortened URLs (in days)"
                  type="number"
                  min="1"
                  max="365"
                  value={settings.defaultUrlExpiration}
                  onChange={(value) => handleInputChange('general', 'defaultUrlExpiration', parseInt(value))}
                />
                <SettingField
                  label="Maximum URL Length"
                  description="Maximum allowed length for target URLs"
                  type="number"
                  min="100"
                  max="5000"
                  value={settings.maxUrlLength}
                  onChange={(value) => handleInputChange('general', 'maxUrlLength', parseInt(value))}
                />
              </SettingSection>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <SettingSection
                title="Security Settings"
                description="Configure security policies and authentication"
              >
                <SettingField
                  label="Require Email Verification"
                  description="Users must verify their email address before using the service"
                  type="checkbox"
                  value={settings.requireEmailVerification}
                  onChange={(value) => handleInputChange('security', 'requireEmailVerification', value)}
                />
                <SettingField
                  label="Enable Two-Factor Authentication"
                  description="Allow users to enable 2FA for additional security"
                  type="checkbox"
                  value={settings.enable2FA}
                  onChange={(value) => handleInputChange('security', 'enable2FA', value)}
                />
                <SettingField
                  label="Session Timeout"
                  description="User session duration in hours"
                  type="number"
                  min="1"
                  max="720"
                  value={settings.sessionTimeout}
                  onChange={(value) => handleInputChange('security', 'sessionTimeout', parseInt(value))}
                />
                <SettingField
                  label="Maximum Login Attempts"
                  description="Number of failed login attempts before account lockout"
                  type="number"
                  min="1"
                  max="10"
                  value={settings.maxLoginAttempts}
                  onChange={(value) => handleInputChange('security', 'maxLoginAttempts', parseInt(value))}
                />
                <SettingField
                  label="Minimum Password Length"
                  description="Minimum required characters for user passwords"
                  type="number"
                  min="6"
                  max="32"
                  value={settings.passwordMinLength}
                  onChange={(value) => handleInputChange('security', 'passwordMinLength', parseInt(value))}
                />
              </SettingSection>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <SettingSection
                title="Appearance Settings"
                description="Customize the look and feel of your application"
              >
                <SettingField
                  label="Theme"
                  description="Default theme for the application"
                  type="select"
                  value={settings.theme}
                  onChange={(value) => handleInputChange('appearance', 'theme', value)}
                  options={[
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                    { value: 'auto', label: 'Auto (System Preference)' }
                  ]}
                />
                <SettingField
                  label="Primary Color"
                  description="Main brand color for buttons and links"
                  type="color"
                  value={settings.primaryColor}
                  onChange={(value) => handleInputChange('appearance', 'primaryColor', value)}
                />
                <SettingField
                  label="Secondary Color"
                  description="Secondary color for accents and highlights"
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(value) => handleInputChange('appearance', 'secondaryColor', value)}
                />
                <SettingField
                  label="Logo URL"
                  description="URL to your site's logo image"
                  type="url"
                  value={settings.logoUrl}
                  onChange={(value) => handleInputChange('appearance', 'logoUrl', value)}
                />
                <SettingField
                  label="Favicon URL"
                  description="URL to your site's favicon"
                  type="url"
                  value={settings.faviconUrl}
                  onChange={(value) => handleInputChange('appearance', 'faviconUrl', value)}
                />
              </SettingSection>
            )}

            {/* Advanced Settings */}
            {activeTab === 'advanced' && (
              <SettingSection
                title="Advanced Settings"
                description="Advanced configuration and system preferences"
              >
                <SettingField
                  label="Enable Analytics"
                  description="Collect and display usage analytics"
                  type="checkbox"
                  value={settings.enableAnalytics}
                  onChange={(value) => handleInputChange('advanced', 'enableAnalytics', value)}
                />
                <SettingField
                  label="Data Retention Period"
                  description="How long to keep analytics data (in days)"
                  type="number"
                  min="30"
                  max="1095"
                  value={settings.dataRetentionPeriod}
                  onChange={(value) => handleInputChange('advanced', 'dataRetentionPeriod', parseInt(value))}
                />
                <SettingField
                  label="Auto-delete Expired URLs"
                  description="Automatically remove expired shortened URLs"
                  type="checkbox"
                  value={settings.autoDeleteExpiredUrls}
                  onChange={(value) => handleInputChange('advanced', 'autoDeleteExpiredUrls', value)}
                />
                <SettingField
                  label="Backup Frequency"
                  description="How often to create system backups"
                  type="select"
                  value={settings.backupFrequency}
                  onChange={(value) => handleInputChange('advanced', 'backupFrequency', value)}
                  options={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' }
                  ]}
                />
                <SettingField
                  label="Maximum File Upload Size"
                  description="Maximum allowed size for file uploads (in MB)"
                  type="number"
                  min="1"
                  max="100"
                  value={settings.maxFileUploadSize}
                  onChange={(value) => handleInputChange('advanced', 'maxFileUploadSize', parseInt(value))}
                />
              </SettingSection>
            )}
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <button
                  onClick={resetToDefaults}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Reset to Defaults
                </button>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={fetchSettings}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Discard Changes
                </button>
                <button
                  onClick={saveSettings}
                  disabled={saveLoading}
                  className="px-6 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                >
                  {saveLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Settings'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
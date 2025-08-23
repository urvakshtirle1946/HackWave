import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Globe, Palette, Database, Mail, Smartphone } from 'lucide-react';

const settingsSections = [
  {
    id: 'general',
    name: 'General',
    icon: SettingsIcon,
    description: 'Basic application settings'
  },
  {
    id: 'notifications',
    name: 'Notifications',
    icon: Bell,
    description: 'Alert and notification preferences'
  },
  {
    id: 'security',
    name: 'Security',
    icon: Shield,
    description: 'Security and access control'
  },
  {
    id: 'integrations',
    name: 'Integrations',
    icon: Globe,
    description: 'External system connections'
  },
  {
    id: 'appearance',
    name: 'Appearance',
    icon: Palette,
    description: 'UI customization options'
  },
  {
    id: 'data',
    name: 'Data Management',
    icon: Database,
    description: 'Data retention and backup settings'
  }
];

const notificationSettings = [
  { name: 'Critical Risk Alerts', enabled: true, email: true, sms: false, push: true },
  { name: 'Supplier Performance', enabled: true, email: true, sms: false, push: false },
  { name: 'Cost Variance Alerts', enabled: false, email: false, sms: false, push: true },
  { name: 'System Maintenance', enabled: true, email: true, sms: true, push: true },
  { name: 'Weekly Reports', enabled: true, email: true, sms: false, push: false },
];

const securitySettings = [
  { name: 'Two-Factor Authentication', enabled: true, description: 'Add an extra layer of security' },
  { name: 'Session Timeout', enabled: true, description: 'Auto logout after 30 minutes of inactivity' },
  { name: 'IP Restrictions', enabled: false, description: 'Limit access to specific IP addresses' },
  { name: 'Audit Logging', enabled: true, description: 'Track all user activities' },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState('general');

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-white font-medium mb-4">Application Preferences</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Organization Name</label>
            <input
              type="text"
              defaultValue="Supply Chain Solutions Inc."
              className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Default Currency</label>
            <select className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white">
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="GBP">British Pound (GBP)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Timezone</label>
            <select className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white">
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time</option>
              <option value="PST">Pacific Time</option>
              <option value="GMT">Greenwich Mean Time</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Date Format</label>
            <select className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white">
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-white font-medium mb-4">Risk Assessment Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Risk Calculation Method</label>
            <select className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white">
              <option value="weighted">Weighted Average</option>
              <option value="max">Maximum Risk</option>
              <option value="custom">Custom Formula</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Auto-refresh Interval</label>
            <select className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white">
              <option value="5">5 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-white font-medium mb-4">Notification Channels</h4>
        <div className="space-y-4">
          {notificationSettings.map((setting, index) => (
            <div key={index} className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-white font-medium">{setting.name}</h5>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={setting.enabled} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {setting.enabled && (
                <div className="grid grid-cols-3 gap-4">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked={setting.email} />
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-300">Email</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked={setting.sms} />
                    <Smartphone size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-300">SMS</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked={setting.push} />
                    <Bell size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-300">Push</span>
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-white font-medium mb-4">Notification Schedule</h4>
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Quiet Hours Start</label>
              <input
                type="time"
                defaultValue="22:00"
                className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Quiet Hours End</label>
              <input
                type="time"
                defaultValue="07:00"
                className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-white font-medium mb-4">Security Features</h4>
        <div className="space-y-4">
          {securitySettings.map((setting, index) => (
            <div key={index} className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h5 className="text-white font-medium mb-1">{setting.name}</h5>
                  <p className="text-sm text-gray-400">{setting.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={setting.enabled} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-white font-medium mb-4">Password Policy</h4>
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Minimum Length</label>
              <select className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white">
                <option value="8">8 characters</option>
                <option value="10">10 characters</option>
                <option value="12">12 characters</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password Expiry</label>
              <select className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white">
                <option value="never">Never</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
                <option value="365">1 year</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'integrations':
        return (
          <div className="text-center py-8">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Integration settings coming soon</p>
          </div>
        );
      case 'appearance':
        return (
          <div className="text-center py-8">
            <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Appearance customization coming soon</p>
          </div>
        );
      case 'data':
        return (
          <div className="text-center py-8">
            <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Data management settings coming soon</p>
          </div>
        );
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>
          <nav className="space-y-2">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                    }`}
                >
                  <Icon size={20} />
                  <div>
                    <div className="font-medium">{section.name}</div>
                    <div className="text-xs opacity-75">{section.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              {settingsSections.find(s => s.id === activeSection)?.name}
            </h3>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm">
              Save Changes
            </button>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
}
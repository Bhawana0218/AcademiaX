import React, { useState } from 'react'
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Bell,
  Shield,
  Database,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Globe,
} from 'lucide-react'
import Button from '../components/Button'
import toast from 'react-hot-toast'

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    tasks: true,
    students: true,
    system: false,
  })

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
    toast.success(`Dark mode ${!darkMode ? 'enabled' : 'disabled'}`)
  }

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
    toast.success('Notification settings updated')
  }

  const settingsSections = [
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Moon,
      items: [
        {
          label: 'Dark Mode',
          description: 'Toggle dark mode theme',
          type: 'toggle',
          value: darkMode,
          onChange: handleDarkModeToggle,
        },
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Email Notifications',
          description: 'Receive email updates',
          type: 'toggle',
          value: notifications.email,
          onChange: () => handleNotificationChange('email'),
        },
        {
          label: 'Push Notifications',
          description: 'Receive push notifications',
          type: 'toggle',
          value: notifications.push,
          onChange: () => handleNotificationChange('push'),
        },
        {
          label: 'Task Updates',
          description: 'Get notified about task changes',
          type: 'toggle',
          value: notifications.tasks,
          onChange: () => handleNotificationChange('tasks'),
        },
        {
          label: 'Student Updates',
          description: 'Get notified about student changes',
          type: 'toggle',
          value: notifications.students,
          onChange: () => handleNotificationChange('students'),
        },
        {
          label: 'System Updates',
          description: 'Get notified about system changes',
          type: 'toggle',
          value: notifications.system,
          onChange: () => handleNotificationChange('system'),
        },
      ],
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: Shield,
      items: [
        {
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security',
          type: 'action',
          action: 'Enable',
        },
        {
          label: 'Login History',
          description: 'View your recent login activity',
          type: 'action',
          action: 'View',
        },
        {
          label: 'Data Export',
          description: 'Download your personal data',
          type: 'action',
          action: 'Export',
        },
      ],
    },
    {
      id: 'data',
      title: 'Data Management',
      icon: Database,
      items: [
        {
          label: 'Backup Data',
          description: 'Create a backup of your data',
          type: 'action',
          action: 'Backup',
        },
        {
          label: 'Restore Data',
          description: 'Restore from a backup',
          type: 'action',
          action: 'Restore',
        },
        {
          label: 'Clear Cache',
          description: 'Clear application cache',
          type: 'action',
          action: 'Clear',
        },
      ],
    },
  ]

  const handleActionClick = (item) => {
    toast.info(`${item.label} feature coming soon`)
  }

  return (

    <div className="space-y-6 bg-slate-50/40 min-h-screen p-4 sm:p-6 lg:p-8">
  {/* Page Header */}
  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
    <p className="text-sm text-slate-500 mt-1 font-medium">Manage your application preferences</p>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Settings Navigation */}
    <div className="lg:col-span-1">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm sticky top-6 hover:shadow-md transition-shadow duration-300">
        <nav className="space-y-1.5">
          {settingsSections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-900 hover:pl-4 transition-all duration-200 group"
              >
                <Icon className="w-5 h-5 mr-3 text-slate-400 group-hover:text-blue-900 transition-colors duration-200" />
                {section.title}
              </button>
            )
          })}
        </nav>
      </div>
    </div>

    {/* Settings Content */}
    <div className="lg:col-span-2 space-y-6">
      {settingsSections.map((section) => {
        const Icon = section.icon
        return (
          <div key={section.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mr-3">
                <Icon className="w-5 h-5 text-blue-900" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {section.title}
              </h3>
            </div>

            <div className="space-y-1">
              {section.items.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60 rounded-xl px-2 -mx-2 transition-colors duration-200">
                  <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="ml-0 sm:ml-4 shrink-0">
                    {item.type === 'toggle' && (
                      <button
                        onClick={item.onChange}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 focus:ring-offset-white ${
                          item.value ? 'bg-blue-900' : 'bg-slate-200 hover:bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            item.value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    )}
                    
                    {item.type === 'action' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleActionClick(item)}
                        className="border-slate-300 text-slate-700 hover:border-blue-900 hover:text-blue-900 hover:bg-blue-50 transition-all duration-200 rounded-lg"
                      >
                        {item.action}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  </div>

  {/* About Section */}
  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
    <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
      <span className="w-1.5 h-6 bg-blue-900 rounded-full mr-3"></span>
      About School Management System
    </h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex items-center p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
            <Globe className="w-5 h-5 text-blue-900" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Version
            </p>
            <p className="text-xs text-slate-500 mt-0.5 font-mono bg-slate-100 px-2 py-0.5 rounded inline-block">
              1.0.0
            </p>
          </div>
        </div>
        
        <div className="flex items-center p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
            <Mail className="w-5 h-5 text-blue-900" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Support
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              support@sms.com
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
            <Phone className="w-5 h-5 text-blue-900" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Phone
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              +1 (555) 123-4567
            </p>
          </div>
        </div>
        
        <div className="flex items-center p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
            <MapPin className="w-5 h-5 text-blue-900" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Location
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              San Francisco, CA
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="mt-6 pt-6 border-t border-slate-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">
            &#169; 2026 AcademiaX School Management System. All rights reserved.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" icon={HelpCircle} className="text-slate-600 hover:text-blue-900 hover:bg-blue-50 transition-all rounded-lg">
            Help Center
          </Button>
          <Button variant="ghost" size="sm" icon={Mail} className="text-slate-600 hover:text-blue-900 hover:bg-blue-50 transition-all rounded-lg">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}

export default Settings

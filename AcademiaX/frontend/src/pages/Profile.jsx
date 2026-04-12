import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Camera,
  Key,
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import Button from '../components/Button'
import Input from '../components/Input'
import Modal from '../components/Modal'
import toast from 'react-hot-toast'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm({
    resolver: zodResolver(profileSchema),
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  })

  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
      })
    }
  }, [user, resetProfile])

  const handleProfileUpdate = async (data) => {
    try {
      setIsUpdating(true)
      const result = await updateProfile(data)
      
      if (result.success) {
        toast.success('Profile updated successfully')
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordChange = async (data) => {
    try {
      setIsChangingPassword(true)
      const result = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      
      if (result.success) {
        toast.success('Password changed successfully')
        setShowPasswordModal(false)
        resetPassword()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Failed to change password')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  return (

    <div className="space-y-6 bg-slate-50/40 min-h-screen p-4 sm:p-6 lg:p-8">
  {/* Page Header */}
  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Profile</h1>
    <p className="text-sm text-slate-500 mt-1 font-medium">Manage your account settings</p>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
    {/* Sidebar */}
    <div className="lg:col-span-1">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6 transition-shadow hover:shadow-md">
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-linear-to-br from-blue-900 to-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 relative shadow-lg ring-4 ring-white group">
            <span className="text-3xl font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase()}
            </span>
            <button className="absolute bottom-0 right-0 p-2 bg-white text-blue-900 rounded-full hover:bg-blue-50 hover:scale-105 hover:shadow-lg transition-all duration-200 shadow-md border border-slate-200">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            {user?.name}
          </h3>
          <p className="text-sm text-slate-500 capitalize font-medium mt-1">
            {user?.role}
          </p>
        </div>

        <nav className="space-y-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  activeTab === tab.id
                    ? 'bg-blue-900 text-white shadow-md hover:bg-blue-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-blue-900 hover:pl-4'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 transition-colors duration-200 ${
                  activeTab === tab.id ? 'text-blue-200' : 'text-slate-400 group-hover:text-blue-900'
                }`} />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>
    </div>

    {/* Main Content */}
    <div className="lg:col-span-3 space-y-6">
      {activeTab === 'profile' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
            <span className="w-1.5 h-6 bg-blue-900 rounded-full mr-3"></span>
            Profile Information
          </h3>

          <form onSubmit={handleProfileSubmit(handleProfileUpdate)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                icon={User}
                {...registerProfile('name')}
                error={profileErrors.name?.message}
              />

              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                {...registerProfile('email')}
                error={profileErrors.email?.message}
              />

              <Input
                label="Phone Number"
                type="tel"
                icon={Phone}
                {...registerProfile('phone')}
                error={profileErrors.phone?.message}
              />

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Account Type</label>
                <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 capitalize font-medium text-sm flex items-center">
                  <User className="w-4 h-4 mr-2 text-slate-400" />
                  {user?.role}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500">
                  Last updated: <span className="font-medium text-slate-700">{user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Never'}</span>
                </p>
              </div>
              <Button
                type="submit"
                loading={isUpdating}
                disabled={isUpdating}
                className="bg-blue-900 text-white hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 rounded-xl px-6"
              >
                Update Profile
              </Button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-blue-900 rounded-full mr-3"></span>
              Security Settings
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all duration-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                    <Key className="w-5 h-5 text-blue-900" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Password
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Last changed: {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordModal(true)}
                  className="mt-3 sm:mt-0 border-slate-300 text-slate-700 hover:border-blue-900 hover:text-blue-900 hover:bg-white transition-all rounded-lg"
                >
                  Change Password
                </Button>
              </div>

              <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mr-3">
                  <Calendar className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Last Login
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mr-3">
                    <Mail className="w-5 h-5 text-emerald-800" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Email Verification
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <span className="mt-2 sm:mt-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Verified
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <span className="w-1.5 h-6 bg-blue-900 rounded-full mr-3"></span>
              Account Status
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Account Status
                  </p>
                  <p className="text-xs text-slate-500">
                    Your account is currently active
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Active</span>
              </div>

              <div className="flex items-center justify-between p-3 border-t border-slate-100 pt-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Account Created
                  </p>
                  <p className="text-xs text-slate-500">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Change Password Modal */}
  <Modal
    isOpen={showPasswordModal}
    onClose={() => setShowPasswordModal(false)}
    title="Change Password"
    size="md"
  >
    <form onSubmit={handlePasswordSubmit(handlePasswordChange)} className="space-y-5">
      <div className="space-y-4">
        <Input
          label="Current Password"
          type={showCurrentPassword ? 'text' : 'password'}
          icon={Key}
          {...registerPassword('currentPassword')}
          error={passwordErrors.currentPassword?.message}
        />

        <Input
          label="New Password"
          type={showNewPassword ? 'text' : 'password'}
          icon={Key}
          {...registerPassword('newPassword')}
          error={passwordErrors.newPassword?.message}
        />

        <Input
          label="Confirm New Password"
          type={showConfirmPassword ? 'text' : 'password'}
          icon={Key}
          {...registerPassword('confirmPassword')}
          error={passwordErrors.confirmPassword?.message}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <Button
          variant="outline"
          onClick={() => setShowPasswordModal(false)}
          disabled={isChangingPassword}
          className="border-slate-300 text-slate-700 hover:bg-slate-50 transition-all rounded-xl"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isChangingPassword}
          disabled={isChangingPassword}
          className="bg-blue-900 text-white hover:bg-blue-800 hover:shadow-md transition-all rounded-xl px-6"
        >
          Change Password
        </Button>
      </div>
    </form>
  </Modal>
</div>
  )
}

export default Profile

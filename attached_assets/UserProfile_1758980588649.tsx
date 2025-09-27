import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { User, Save, Loader2, AlertTriangle, Check, Shield, Key, LogOut } from 'lucide-react';
import authService from '../../services/authService';

export function UserProfile() {
  const { user, isAuthenticated, signOut, loadUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // MFA state
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  
  // Load user data
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    
    if (user) {
      setEmail(user.email || '');
      setUsername(user.user_metadata?.username || '');
      setName(user.user_metadata?.name || '');
      setMfaEnabled(!!user.user_metadata?.mfa_enabled);
    }
  }, [user, isAuthenticated]);
  
  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (!user) {
        throw new Error('User not found');
      }
      
      const { error } = await authService.updateProfile(user.id, {
        username,
        name
      });
      
      if (error) {
        throw error;
      }
      
      setSuccess('Profile updated successfully');
      loadUser(); // Reload user data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      // In a real implementation, we would verify the current password first
      
      const { error } = await authService.updatePassword(newPassword);
      
      if (error) {
        throw error;
      }
      
      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle MFA toggle
  const handleMfaToggle = () => {
    if (mfaEnabled) {
      // Disable MFA
      setMfaEnabled(false);
      setSuccess('Multi-factor authentication disabled');
    } else {
      // Show MFA setup UI
      setShowMfaSetup(true);
    }
  };
  
  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
  };
  
  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Not Signed In</h3>
        <p className="text-gray-400 mb-6">Please sign in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs overrides={[{ name: 'Profile' }]} />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <User className="h-8 w-8 text-indigo-400" />
          <h1 className="text-3xl font-bold text-white">Your Profile</h1>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
      
      {error && (
        <div className="bg-red-900/30 p-4 rounded-lg border border-red-700/30 flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-900/30 p-4 rounded-lg border border-green-700/30 flex items-start space-x-3">
          <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-200">{success}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
          
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                disabled
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 opacity-70"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </form>
        </div>
        
        {/* Security Settings */}
        <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6">Security Settings</h2>
          
          <div className="space-y-6">
            {/* Password Change */}
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <h3 className="text-lg font-medium text-white">Change Password</h3>
              
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-400 mb-2">
                  Current Password
                </label>
                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-400 mb-2">
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-400 mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`w-full bg-slate-700/50 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    confirmPassword && newPassword !== confirmPassword 
                      ? 'border-red-500' 
                      : confirmPassword 
                        ? 'border-green-500' 
                        : 'border-slate-600/50'
                  }`}
                  placeholder="••••••••"
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !currentPassword || !newPassword || newPassword !== confirmPassword}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Key className="h-5 w-5" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>
            
            {/* MFA Settings */}
            <div className="pt-6 border-t border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-white">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                </div>
                <div className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    id="mfa-toggle"
                    className="sr-only"
                    checked={mfaEnabled}
                    onChange={handleMfaToggle}
                  />
                  <label
                    htmlFor="mfa-toggle"
                    className={`absolute inset-0 rounded-full cursor-pointer transition-colors duration-300 ${
                      mfaEnabled ? 'bg-indigo-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute inset-y-0 left-0 w-6 h-6 bg-white rounded-full transform transition-transform duration-300 ${
                        mfaEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </label>
                </div>
              </div>
              
              {showMfaSetup && (
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                  <div className="flex items-center space-x-3 mb-4">
                    <Shield className="h-5 w-5 text-indigo-400" />
                    <h4 className="font-medium text-white">Set Up Two-Factor Authentication</h4>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-4">
                    Two-factor authentication adds an extra layer of security to your account. 
                    In addition to your password, you'll need a code from your authenticator app to sign in.
                  </p>
                  
                  <div className="flex justify-center mb-4">
                    <div className="bg-white p-4 rounded-lg">
                      {/* QR code placeholder */}
                      <div className="w-48 h-48 bg-slate-200 flex items-center justify-center">
                        <p className="text-slate-800 text-sm text-center">QR Code Placeholder</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="verification-code" className="block text-sm font-medium text-gray-400 mb-2">
                      Verification Code
                    </label>
                    <input
                      id="verification-code"
                      type="text"
                      className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter 6-digit code"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors"
                    >
                      Verify & Enable
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMfaSetup(false)}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              {mfaEnabled && (
                <div className="bg-green-900/30 p-4 rounded-lg border border-green-700/30 flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-200 font-medium">Two-factor authentication is enabled</p>
                    <p className="text-xs text-green-300 mt-1">Your account is protected with an additional layer of security</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
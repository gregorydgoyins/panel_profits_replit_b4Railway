import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, AlertTriangle, Check, ArrowLeft } from 'lucide-react';
import authService from '../../services/authService';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await authService.resetPassword(email);
      
      if (error) {
        throw error;
      }
      
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-8 shadow-xl max-w-md w-full border border-slate-700/50">
        <div className="text-center mb-8">
          <KeyRound className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-gray-400 mt-2">We'll send you a link to reset your password</p>
        </div>

        {error && (
          <div className="bg-red-900/30 p-4 rounded-lg border border-red-700/30 mb-6 flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {success ? (
          <div className="space-y-6">
            <div className="bg-green-900/30 p-4 rounded-lg border border-green-700/30 flex items-start space-x-3">
              <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-green-200 font-medium">Reset link sent!</p>
                <p className="text-xs text-green-300 mt-1">
                  We've sent a password reset link to {email}. Please check your inbox and follow the instructions.
                </p>
              </div>
            </div>
            
            <Link
              to="/login"
              className="flex items-center justify-center space-x-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="your.email@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
            
            <div className="text-center">
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 text-sm">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
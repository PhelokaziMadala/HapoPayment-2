import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader, Shield } from 'lucide-react';

const ParentLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowMFA(true);
    }, 1500);
  };

  const handleMFAVerification = async () => {
    if (!mfaCode.trim()) {
      setErrors({ mfaCode: 'Verification code is required' });
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      navigate('/parent-dashboard');
    }, 1500);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="nav-header">
        <div className="nav-container">
          <div className="nav-brand">
            <img 
              src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=40&h=40&fit=crop&crop=center" 
              alt="Hapo Logo" 
              className="logo"
            />
            <div className="brand-content">
              <span className="brand-name">Hapo Technology</span>
              <span className="brand-tagline">Your Money, Your Growth, The Hapo Way!</span>
            </div>
          </div>
          <div className="nav-actions">
            <button className="child-login-btn" onClick={handleBackToHome}>
              Back to Home
            </button>
            <button className="parent-signin-btn" onClick={handleSignUp}>
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Login Section */}
      <section className="auth-section">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your Hapo parent account</p>
            </div>

            {!showMFA ? (
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-input">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                    />
                    <span className="checkbox-custom"></span>
                    Remember me
                  </label>
                </div>

                <button type="submit" className="auth-button" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin" size={16} />
                      Signing In...
                    </>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>
            ) : (
              <div className="auth-form">
                <div className="mfa-header">
                  <Shield size={32} />
                  <h3>Two-Factor Authentication</h3>
                  <p>Enter the verification code sent to your device</p>
                </div>

                <div className="form-group">
                  <label htmlFor="mfaCode">Verification Code</label>
                  <input
                    type="text"
                    id="mfaCode"
                    name="mfaCode"
                    maxLength={6}
                    placeholder="000000"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    required
                  />
                  {errors.mfaCode && <span className="error-message">{errors.mfaCode}</span>}
                </div>

                <div className="mfa-options">
                  <button type="button" className="link-button">Resend Code</button>
                  <button type="button" className="link-button">Use different method</button>
                </div>

                <button type="button" className="auth-button" onClick={handleMFAVerification} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin" size={16} />
                      Verifying...
                    </>
                  ) : (
                    'Verify'
                  )}
                </button>

                <button type="button" className="auth-button-secondary" onClick={() => setShowMFA(false)}>
                  Back to Login
                </button>
              </div>
            )}

            <div className="auth-divider">
              <span>or sign in with</span>
            </div>

            <div className="oauth-buttons">
              <button className="oauth-button google">
                <i className="fab fa-google"></i>
                Google
              </button>
            </div>

            <div className="auth-footer">
              <p><a href="#" className="link">Forgot your password?</a></p>
              <p>Don't have an account? <a href="#" onClick={handleSignUp} className="link">Sign up here</a></p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ParentLogin;
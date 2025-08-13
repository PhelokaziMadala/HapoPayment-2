import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader } from 'lucide-react';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.terms) {
      newErrors.terms = 'You must agree to the terms and conditions';
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
      setShowEmailVerification(true);
    }, 2000);
  };

  const handleEmailVerification = async () => {
    if (!verificationCode.trim()) {
      setErrors({ emailVerificationCode: 'Verification code is required' });
      return;
    }

    setIsLoading(true);
    
    // Simulate verification
    setTimeout(() => {
      setIsLoading(false);
      navigate('/parent-dashboard');
    }, 1500);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleSignIn = () => {
    navigate('/parent-login');
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
            <button className="parent-signin-btn" onClick={handleSignIn}>
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Signup Section */}
      <section className="auth-section">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h2>Parent Sign Up</h2>
              <p>Create your Hapo account to manage your family's finances</p>
            </div>

            {!showEmailVerification ? (
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>

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
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="password-input">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      id="terms"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleInputChange}
                      required
                    />
                    <span className="checkbox-custom"></span>
                    I agree to the <a href="#" className="link">Terms of Service</a> and <a href="#" className="link">Privacy Policy</a>
                  </label>
                  {errors.terms && <span className="error-message">{errors.terms}</span>}
                </div>

                <button type="submit" className="auth-button" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin" size={16} />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>
            ) : (
              <div className="auth-form">
                <div className="mfa-header">
                  <i className="fas fa-envelope"></i>
                  <h3>Verify Your Email Address</h3>
                  <p>Enter the verification code sent to your email</p>
                </div>

                <div className="form-group">
                  <label htmlFor="emailVerificationCode">Verification Code</label>
                  <input
                    type="text"
                    id="emailVerificationCode"
                    name="emailVerificationCode"
                    maxLength={6}
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                  />
                  {errors.emailVerificationCode && <span className="error-message">{errors.emailVerificationCode}</span>}
                </div>

                <div className="mfa-options">
                  <button type="button" className="link-button">Resend Code</button>
                  <button type="button" className="link-button" onClick={() => setShowEmailVerification(false)}>Back to Sign Up</button>
                </div>

                <button type="button" className="auth-button" onClick={handleEmailVerification} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin" size={16} />
                      Verifying...
                    </>
                  ) : (
                    'Verify Email'
                  )}
                </button>
              </div>
            )}

            <div className="auth-divider">
              <span>or sign up with</span>
            </div>

            <div className="oauth-buttons">
              <button className="oauth-button google">
                <i className="fab fa-google"></i>
                Google
              </button>
            </div>

            <div className="auth-footer">
              <p>Already have an account? <a href="#" onClick={handleSignIn} className="link">Sign in here</a></p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignUp;
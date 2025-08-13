import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, QrCode, Shield, Star } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleStudentLogin = () => {
    navigate('/student-login');
  };

  const handleParentSignUp = () => {
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
            <button className="child-login-btn" onClick={handleStudentLogin}>
              Student Login
            </button>
            <button className="parent-signin-btn" onClick={handleParentSignUp}>
              Parent Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">
            Student Spending <span className="highlight">Made Smart</span>
          </h1>
          <p className="hero-description">
            Empower your children with safe spending while maintaining complete
            parental control. QR payments, real-time monitoring, and smart limits all in
            one app.
          </p>
          <button className="cta-button" onClick={handleGetStarted}>
            Get Started Today
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="features-title">Everything You Need to Support Smarter Student Spending</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon parent-controls">
                <Users size={24} />
              </div>
              <h3>Parent Controls</h3>
              <p className="feature-description">
                Set spending limits, monitor transactions, and send emergency funds instantly.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon qr-payments">
                <QrCode size={24} />
              </div>
              <h3>QR Payments</h3>
              <p className="feature-description">
                Children can pay safely using QR codes at stores, with real-time parent notifications.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon smart-limits">
                <Shield size={24} />
              </div>
              <h3>Smart Limits</h3>
              <p className="feature-description">
                Automatic spending limits with category restrictions and weekly allowances.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon reward-system">
                <Star size={24} />
              </div>
              <h3>Reward System</h3>
              <p className="feature-description">
                Encourage good financial decisions. Students earn points for sticking to budgets, saving, and spending responsibly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Build the Next Generation of Money-Smart Students?</h2>
          <p className="cta-description">
            Join learners and guardians across the continent using Hapo to build healthy financial habits.
          </p>
          <button className="cta-button-large" onClick={handleGetStarted}>
            Start Your Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <img 
              src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=40&h=40&fit=crop&crop=center" 
              alt="Hapo Logo" 
              className="logo"
            />
          </div>
          <p className="footer-tagline">Empowering Student Spending. Shaping Financial Futures.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
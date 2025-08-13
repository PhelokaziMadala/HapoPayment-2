
// ========================================
// HAPO LANDING PAGE CODE
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('%cHapo Payment System', 'color: #4f46e5; font-size: 20px; font-weight: bold;');
    console.log('Family Payments Made Simple');

    // Get Started button functionality
    const ctaButtons = document.querySelectorAll('.cta-button, .cta-button-large');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.location.href = 'signup.html';
        });
    });

    // Parent Sign In button functionality
    const parentSignInBtn = document.querySelector('.parent-signin-btn');
    if (parentSignInBtn) {
        parentSignInBtn.addEventListener('click', function() {
            window.location.href = 'parentLogin.html';
        });
    }

    // Child Login button functionality
    const childLoginBtn = document.querySelector('.child-login-btn');
    if (childLoginBtn && childLoginBtn.textContent.includes('Child Login')) {
        childLoginBtn.addEventListener('click', function() {
            window.location.href = 'studentLogin.html';
        });
    }

    // Add smooth scrolling for any future navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation to feature cards when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animate feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('button, .feature-card');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = this.classList.contains('feature-card') ? 'translateY(-2px)' : 'translateY(-1px)';
        });

        element.addEventListener('mouseleave', function() {
            this.style.transform = this.classList.contains('feature-card') ? 'translateY(0)' : 'translateY(0)';
        });
    });
});

// ========================================
// AUTHENTICATION SYSTEM CODE (from auth.js)
// ========================================

// Authentication System with JWT and MFA
class AuthSystem {
    constructor() {
        this.apiBase = window.location.origin;
        this.token = localStorage.getItem('hapo_token');
        this.refreshToken = localStorage.getItem('hapo_refresh_token');
        this.init();
    }

    init() {
        // Auto-refresh token if needed
        if (this.token) {
            this.validateToken();
        }
    }

    // Password strength checker
    checkPasswordStrength(password) {
        const strength = {
            score: 0,
            feedback: []
        };

        if (password.length >= 8) strength.score++;
        else strength.feedback.push('At least 8 characters');

        if (/[A-Z]/.test(password)) strength.score++;
        else strength.feedback.push('One uppercase letter');

        if (/[a-z]/.test(password)) strength.score++;
        else strength.feedback.push('One lowercase letter');

        if (/\d/.test(password)) strength.score++;
        else strength.feedback.push('One number');

        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength.score++;
        else strength.feedback.push('One special character');

        return strength;
    }

    // Hash password using bcrypt-like implementation
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + 'hapo_salt_2024');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Generate JWT token (mock implementation)
    generateJWT(userData) {
        const header = { alg: 'HS256', typ: 'JWT' };
        const payload = {
            sub: userData.id,
            email: userData.email,
            name: userData.fullName,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
            iat: Math.floor(Date.now() / 1000)
        };

        // In real implementation, this would be signed server-side
        const encodedHeader = btoa(JSON.stringify(header));
        const encodedPayload = btoa(JSON.stringify(payload));
        const signature = 'mock_signature_' + Math.random().toString(36);

        return `${encodedHeader}.${encodedPayload}.${signature}`;
    }

    // Validate and refresh token
    async validateToken() {
        if (!this.token) return false;

        try {
            // In real implementation, this would validate with server
            const payload = JSON.parse(atob(this.token.split('.')[1]));
            const now = Math.floor(Date.now() / 1000);

            if (payload.exp <= now) {
                await this.refreshAccessToken();
            }
            return true;
        } catch (error) {
            this.logout();
            return false;
        }
    }

    // Refresh access token
    async refreshAccessToken() {
        if (!this.refreshToken) {
            this.logout();
            return;
        }

        // Mock refresh token implementation
        const newToken = this.generateJWT({ 
            id: '123', 
            email: 'user@example.com', 
            fullName: 'User Name' 
        });

        localStorage.setItem('hapo_token', newToken);
        this.token = newToken;
    }

    // Sign up function
    async signUp(formData) {
        try {
            const hashedPassword = await this.hashPassword(formData.password);

            // Mock user data storage (in real app, this would be server-side)
            const userData = {
                id: 'user_' + Date.now(),
                fullName: formData.fullName,
                email: formData.email,
                password: hashedPassword,
                emailVerified: false,
                mfaEnabled: true,
                createdAt: new Date().toISOString()
            };

            // Store user data as unverified (mock localStorage - would be database in real app)
            localStorage.setItem('hapo_user_' + userData.email, JSON.stringify(userData));

            // Generate email verification code
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            localStorage.setItem('hapo_email_verification', JSON.stringify({
                email: userData.email,
                code: verificationCode,
                expiry: Date.now() + 10 * 60 * 1000, // 10 minutes
                userData: userData
            }));

            // Simulate sending verification email
            this.simulateEmailVerification(userData.email, verificationCode);

            return { success: true, requiresEmailVerification: true };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: 'Signup failed. Please try again.' };
        }
    }

    // Sign in function
    async signIn(email, password) {
        try {
            // Get stored user data
            const storedUserData = localStorage.getItem('hapo_user_' + email);
            if (!storedUserData) {
                return { success: false, error: 'Invalid email or password' };
            }

            const userData = JSON.parse(storedUserData);
            const hashedPassword = await this.hashPassword(password);

            if (userData.password !== hashedPassword) {
                return { success: false, error: 'Invalid email or password' };
            }

            // Check if email is verified
            if (!userData.emailVerified) {
                return { success: false, error: 'Please verify your email address before signing in' };
            }

            // Check if MFA is enabled
            if (userData.mfaEnabled) {
                // Generate and send MFA code (mock)
                const mfaCode = Math.floor(100000 + Math.random() * 900000).toString();
                localStorage.setItem('hapo_pending_mfa', JSON.stringify({
                    email,
                    code: mfaCode,
                    expiry: Date.now() + 5 * 60 * 1000 // 5 minutes
                }));

                // Simulate email sending with a notification
                this.simulateEmailSending(email, mfaCode);

                return { success: true, requiresMFA: true, message: `Verification code sent to ${email}` };
            }

            // Complete login
            return this.completeLogin(userData);
        } catch (error) {
            console.error('Signin error:', error);
            return { success: false, error: 'Sign in failed. Please try again.' };
        }
    }

    // Verify MFA code
    async verifyMFA(code) {
        try {
            const pendingMFA = localStorage.getItem('hapo_pending_mfa');
            if (!pendingMFA) {
                return { success: false, error: 'No pending MFA verification' };
            }

            const mfaData = JSON.parse(pendingMFA);
            if (Date.now() > mfaData.expiry) {
                localStorage.removeItem('hapo_pending_mfa');
                return { success: false, error: 'MFA code has expired' };
            }

            if (code !== mfaData.code) {
                return { success: false, error: 'Invalid verification code' };
            }

            // Get user data and complete login
            const userData = JSON.parse(localStorage.getItem('hapo_user_' + mfaData.email));
            localStorage.removeItem('hapo_pending_mfa');

            return this.completeLogin(userData);
        } catch (error) {
            console.error('MFA verification error:', error);
            return { success: false, error: 'MFA verification failed' };
        }
    }

    // Complete login process
    completeLogin(userData) {
        const accessToken = this.generateJWT(userData);
        const refreshToken = 'refresh_' + Math.random().toString(36);

        localStorage.setItem('hapo_token', accessToken);
        localStorage.setItem('hapo_refresh_token', refreshToken);
        localStorage.setItem('hapo_current_user', JSON.stringify({
            id: userData.id,
            fullName: userData.fullName,
            email: userData.email
        }));

        this.token = accessToken;
        this.refreshToken = refreshToken;

        return { success: true, requiresMFA: false };
    }

    // OAuth implementations (mock)
    async signInWithGoogle() {
        // Mock Google OAuth
        const mockGoogleUser = {
            id: 'google_' + Date.now(),
            fullName: 'Google User',
            email: 'user@gmail.com'
        };

        return this.completeLogin(mockGoogleUser);
    }

    async signInWithMicrosoft() {
        // Mock Microsoft OAuth
        const mockMicrosoftUser = {
            id: 'microsoft_' + Date.now(),
            fullName: 'Microsoft User',
            email: 'user@outlook.com'
        };

        return this.completeLogin(mockMicrosoftUser);
    }

    // Logout
    logout() {
        localStorage.removeItem('hapo_token');
        localStorage.removeItem('hapo_refresh_token');
        localStorage.removeItem('hapo_current_user');
        localStorage.removeItem('hapo_pending_mfa');

        this.token = null;
        this.refreshToken = null;

        window.location.href = 'index.html';
    }

    // Get current user
    getCurrentUser() {
        const userData = localStorage.getItem('hapo_current_user');
        return userData ? JSON.parse(userData) : null;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token && !!this.getCurrentUser();
    }

    // Verify email during signup
    async verifyEmail(code) {
        try {
            const pendingVerification = localStorage.getItem('hapo_email_verification');
            if (!pendingVerification) {
                return { success: false, error: 'No pending email verification' };
            }

            const verificationData = JSON.parse(pendingVerification);
            if (Date.now() > verificationData.expiry) {
                localStorage.removeItem('hapo_email_verification');
                return { success: false, error: 'Verification code has expired' };
            }

            if (code !== verificationData.code) {
                return { success: false, error: 'Invalid verification code' };
            }

            // Mark email as verified and save user
            const userData = verificationData.userData;
            userData.emailVerified = true;
            localStorage.setItem('hapo_user_' + userData.email, JSON.stringify(userData));
            localStorage.removeItem('hapo_email_verification');

            return { success: true };
        } catch (error) {
            console.error('Email verification error:', error);
            return { success: false, error: 'Email verification failed' };
        }
    }

    // Resend email verification code
    async resendEmailVerification() {
        try {
            const pendingVerification = localStorage.getItem('hapo_email_verification');
            if (!pendingVerification) {
                return { success: false, error: 'No pending verification found' };
            }

            const verificationData = JSON.parse(pendingVerification);
            const newCode = Math.floor(100000 + Math.random() * 900000).toString();

            // Update verification data with new code and extended expiry
            verificationData.code = newCode;
            verificationData.expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

            localStorage.setItem('hapo_email_verification', JSON.stringify(verificationData));

            // Simulate sending new verification email
            this.simulateEmailVerification(verificationData.email, newCode);

            return { success: true };
        } catch (error) {
            console.error('Resend verification error:', error);
            return { success: false, error: 'Failed to resend verification code' };
        }
    }

    // Simulate sending email verification
    simulateEmailVerification(email, code) {
        // Create notification popup to simulate email sending
        const notification = document.createElement('div');
        notification.className = 'email-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-header">
                    <i class="fas fa-envelope"></i>
                    <span>Verification Email Sent</span>
                    <button class="close-notification" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="notification-body">
                    <p>A verification code has been sent to:</p>
                    <strong>${email}</strong>
                    <div class="demo-notice">
                        <p><strong>Demo Mode:</strong> Your verification code is:</p>
                        <div class="demo-code">${code}</div>
                        <p><small>In production, this would be sent via email</small></p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove notification after 15 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 15000);

        // Add CSS for notification if not already added
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .email-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 1000;
                    min-width: 300px;
                    max-width: 400px;
                    animation: slideIn 0.3s ease-out;
                }

                .notification-content {
                    padding: 16px;
                }

                .notification-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 12px;
                    color: #4f46e5;
                    font-weight: 600;
                }

                .close-notification {
                    margin-left: auto;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #666;
                    padding: 4px;
                }

                .close-notification:hover {
                    color: #333;
                }

                .notification-body p {
                    margin: 8px 0;
                    color: #333;
                }

                .demo-notice {
                    background: #f8f9ff;
                    border: 1px solid #e0e7ff;
                    border-radius: 6px;
                    padding: 12px;
                    margin-top: 12px;
                }

                .demo-code {
                    font-family: 'Courier New', monospace;
                    font-size: 18px;
                    font-weight: bold;
                    color: #4f46e5;
                    background: white;
                    padding: 8px 12px;
                    border-radius: 4px;
                    text-align: center;
                    margin: 8px 0;
                    border: 2px solid #4f46e5;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Simulate sending email with MFA code
    simulateEmailSending(email, code) {
        // Create notification popup to simulate email sending
        const notification = document.createElement('div');
        notification.className = 'email-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-header">
                    <i class="fas fa-envelope"></i>
                    <span>Email Sent</span>
                    <button class="close-notification" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="notification-body">
                    <p>A verification code has been sent to:</p>
                    <strong>${email}</strong>
                    <div class="demo-notice">
                        <p><strong>Demo Mode:</strong> Your verification code is:</p>
                        <div class="demo-code">${code}</div>
                        <p><small>In production, this would be sent via email</small></p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove notification after 10 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);

        // Add CSS for notification if not already added
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .email-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 1000;
                    min-width: 300px;
                    max-width: 400px;
                    animation: slideIn 0.3s ease-out;
                }

                .notification-content {
                    padding: 16px;
                }

                .notification-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 12px;
                    color: #4f46e5;
                    font-weight: 600;
                }

                .close-notification {
                    margin-left: auto;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #666;
                    padding: 4px;
                }

                .close-notification:hover {
                    color: #333;
                }

                .notification-body p {
                    margin: 8px 0;
                    color: #333;
                }

                .demo-notice {
                    background: #f8f9ff;
                    border: 1px solid #e0e7ff;
                    border-radius: 6px;
                    padding: 12px;
                    margin-top: 12px;
                }

                .demo-code {
                    font-family: 'Courier New', monospace;
                    font-size: 18px;
                    font-weight: bold;
                    color: #4f46e5;
                    background: white;
                    padding: 8px 12px;
                    border-radius: 4px;
                    text-align: center;
                    margin: 8px 0;
                    border: 2px solid #4f46e5;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize auth system
const auth = new AuthSystem();

// ========================================
// AUTHENTICATION FORM HANDLING FUNCTIONS
// ========================================

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const eye = document.getElementById(inputId + 'Eye');

    if (input.type === 'password') {
        input.type = 'text';
        eye.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        eye.className = 'fas fa-eye';
    }
}

// Password strength indicator
function updatePasswordStrength() {
    const password = document.getElementById('password');
    const strengthDiv = document.getElementById('passwordStrength');

    if (!password || !strengthDiv) return;

    password.addEventListener('input', function() {
        const strength = auth.checkPasswordStrength(this.value);
        const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        const strengthColors = ['#ff4444', '#ff8800', '#ffaa00', '#88cc00', '#44cc00'];

        strengthDiv.innerHTML = `
            <div class="strength-bar">
                <div class="strength-fill" style="width: ${(strength.score / 5) * 100}%; background-color: ${strengthColors[strength.score - 1] || '#ff4444'}"></div>
            </div>
            <span class="strength-text">${strengthLevels[strength.score - 1] || 'Very Weak'}</span>
        `;

        if (strength.feedback.length > 0 && this.value.length > 0) {
            strengthDiv.innerHTML += `<div class="strength-feedback">Missing: ${strength.feedback.join(', ')}</div>`;
        }
    });
}

// Signup form handler
if (document.getElementById('signupForm')) {
    updatePasswordStrength();

    document.getElementById('signupForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        // Validate form
        let hasErrors = false;

        if (data.password !== data.confirmPassword) {
            document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
            hasErrors = true;
        }

        if (!data.terms) {
            document.getElementById('termsError').textContent = 'You must agree to the terms';
            hasErrors = true;
        }

        const passwordStrength = auth.checkPasswordStrength(data.password);
        if (passwordStrength.score < 3) {
            document.getElementById('passwordError').textContent = 'Password is too weak';
            hasErrors = true;
        }

        if (hasErrors) return;

        // Show loading
        const button = document.getElementById('signupButton');
        const buttonText = document.getElementById('signupButtonText');
        const spinner = document.getElementById('loadingSpinner');

        button.disabled = true;
        buttonText.style.display = 'none';
        spinner.style.display = 'block';

        try {
            const result = await auth.signUp(data);

            if (result.success) {
                if (result.requiresEmailVerification) {
                    // Hide signup form and show email verification form
                    document.getElementById('signupForm').style.display = 'none';
                    document.getElementById('emailVerificationForm').style.display = 'block';
                    document.querySelector('.auth-header h2').textContent = 'Verify Your Email';
                    document.querySelector('.auth-header p').textContent = 'Please enter the verification code sent to your email';
                } else {
                    alert('Account created successfully! Please sign in with your credentials.');
                    window.location.href = 'login.html';
                }
            } else {
                alert(result.error || 'Signup failed');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        } finally {
            button.disabled = false;
            buttonText.style.display = 'block';
            spinner.style.display = 'none';
        }
    });
}

// Login form handler
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const email = formData.get('email');
        const password = formData.get('password');

        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        // Show loading
        const button = document.getElementById('loginButton');
        const buttonText = document.getElementById('loginButtonText');
        const spinner = document.getElementById('loginLoadingSpinner');

        button.disabled = true;
        buttonText.style.display = 'none';
        spinner.style.display = 'block';

        try {
            const result = await auth.signIn(email, password);

           if (result.success) {
                window.location.href = 'parentDashboard.html'; // Redirecting to the dashboard
            } else {
                document.getElementById('loginPasswordError').textContent = result.error;
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        } finally {
            button.disabled = false;
            buttonText.style.display = 'block';
            spinner.style.display = 'none';
        }
    });
}

// ========================================
// EMAIL VERIFICATION FUNCTIONS
// ========================================

// Email verification during signup
async function verifyEmailCode() {
    const code = document.getElementById('emailVerificationCode').value;

    if (!code || code.length !== 6) {
        document.getElementById('emailVerificationError').textContent = 'Please enter a 6-digit code';
        return;
    }

    // Show loading
    const button = document.querySelector('#emailVerificationForm .auth-button');
    const buttonText = document.getElementById('emailVerifyButtonText');
    const spinner = document.getElementById('emailVerifySpinner');

    button.disabled = true;
    buttonText.style.display = 'none';
    spinner.style.display = 'block';

    try {
        const result = await auth.verifyEmail(code);

        if (result.success) {
            alert('Email verified successfully! You can now sign in with your credentials.');
            window.location.href = 'parentLogin.html';
        } else {
            document.getElementById('emailVerificationError').textContent = result.error;
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
    } finally {
        button.disabled = false;
        buttonText.style.display = 'block';
        spinner.style.display = 'none';
    }
}

// Resend email verification code
async function resendEmailVerification() {
    try {
        const result = await auth.resendEmailVerification();

        if (result.success) {
            // Clear any previous error messages
            document.getElementById('emailVerificationError').textContent = '';

            // Show success message
            const successDiv = document.querySelector('.email-success-message') || document.createElement('div');
            successDiv.className = 'email-success-message';
            successDiv.textContent = 'New verification code sent to your email';
            successDiv.style.cssText = 'color: #059669; background: #d1fae5; padding: 8px 12px; border-radius: 4px; margin-bottom: 16px; border: 1px solid #10b981;';

            if (!document.querySelector('.email-success-message')) {
                document.getElementById('emailVerificationForm').insertBefore(successDiv, document.getElementById('emailVerificationForm').firstChild);
            }

            // Remove success message after 5 seconds
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.remove();
                }
            }, 5000);
        } else {
            alert(result.error || 'Failed to resend verification code');
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
    }
}

function backToSignup() {
    document.getElementById('emailVerificationForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
    document.querySelector('.auth-header h2').textContent = 'Parent Sign Up';
    document.querySelector('.auth-header p').textContent = 'Create your Hapo account to manage your family\'s finances';
}

// ========================================
// MFA (MULTI-FACTOR AUTHENTICATION) FUNCTIONS
// ========================================

// MFA verification
async function verifyMFA() {
    const code = document.getElementById('mfaCode').value;

    if (!code || code.length !== 6) {
        document.getElementById('mfaCodeError').textContent = 'Please enter a 6-digit code';
        return;
    }

    // Show loading
    const button = document.querySelector('#mfaForm .auth-button');
    const buttonText = document.getElementById('mfaButtonText');
    const spinner = document.getElementById('mfaLoadingSpinner');

    button.disabled = true;
    buttonText.style.display = 'none';
    spinner.style.display = 'block';

    try {
        const result = await auth.verifyMFA(code);

        if (result.success) {
            window.location.href = 'dashboard.html';
        } else {
            document.getElementById('mfaCodeError').textContent = result.error;
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
    } finally {
        button.disabled = false;
        buttonText.style.display = 'block';
        spinner.style.display = 'none';
    }
}

// MFA helper functions
async function resendMFA() {
    const pendingMFA = localStorage.getItem('hapo_pending_mfa');
    if (!pendingMFA) {
        alert('No pending verification found. Please sign in again.');
        return;
    }

    const mfaData = JSON.parse(pendingMFA);

    // Generate new code
    const newMfaCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Update stored MFA data with new code and extended expiry
    const updatedMfaData = {
        ...mfaData,
        code: newMfaCode,
        expiry: Date.now() + 5 * 60 * 1000 // 5 minutes from now
    };

    localStorage.setItem('hapo_pending_mfa', JSON.stringify(updatedMfaData));

    // Simulate sending new email
    auth.simulateEmailSending(mfaData.email, newMfaCode);

    // Clear any previous error messages
    document.getElementById('mfaCodeError').textContent = '';

    // Show success message
    const successDiv = document.querySelector('.success-message');
    if (successDiv) {
        successDiv.textContent = `New verification code sent to ${mfaData.email}`;
    } else {
        const newSuccessDiv = document.createElement('div');
        newSuccessDiv.className = 'success-message';
        newSuccessDiv.textContent = `New verification code sent to ${mfaData.email}`;
        newSuccessDiv.style.cssText = 'color: #059669; background: #d1fae5; padding: 8px 12px; border-radius: 4px; margin-bottom: 16px; border: 1px solid #10b981;';
        document.getElementById('mfaForm').insertBefore(newSuccessDiv, document.getElementById('mfaForm').firstChild);
    }
}

function switchMFAMethod() {
    alert('Alternative MFA methods coming soon!');
}

function backToLogin() {
    document.getElementById('mfaForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

// ========================================
// OAUTH AUTHENTICATION FUNCTIONS
// ========================================

async function signUpWithGoogle() {
    try {
        const result = await auth.signInWithGoogle();
        if (result.success) {
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        alert('Google sign up failed. Please try again.');
    }
}

async function signUpWithMicrosoft() {
    try {
        const result = await auth.signInWithMicrosoft();
        if (result.success) {
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        alert('Microsoft sign up failed. Please try again.');
    }
}

async function signInWithGoogle() {
    try {
        const result = await auth.signInWithGoogle();
        if (result.success) {
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        alert('Google sign in failed. Please try again.');
    }
}

async function signInWithMicrosoft() {
    try {
        const result = await auth.signInWithMicrosoft();
        if (result.success) {
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        alert('Microsoft sign in failed. Please try again.');
    }
}

function showForgotPassword() {
    alert('Password reset functionality coming soon!');
}

// Check authentication on dashboard
if (window.location.pathname.includes('dashboard.html')) {
    if (!auth.isAuthenticated()) {
        window.location.href = 'login.html';
    } else {
        const user = auth.getCurrentUser();
        if (user && document.getElementById('userName')) {
            document.getElementById('userName').textContent = `Welcome, ${user.fullName}`;
        }
    }
}

// ========================================
// DASHBOARD FUNCTIONALITY CODE (from dashboard.js)
// ========================================

// Dashboard functionality
class Dashboard {
    constructor() {
        this.user = auth.getCurrentUser();
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
    }

    loadUserData() {
        // Update user name display with actual user data
        const user = auth.getCurrentUser();
        if (user && document.getElementById('userName')) {
            document.getElementById('userName').textContent = `Welcome, ${user.fullName}`;
        }
        
        // Mock data loading
        this.updateDashboardData();
    }

    updateDashboardData() {
        // Update statistics (mock data)
        const stats = {
            totalBalance: 1234.56,
            activeChildren: 2,
            recentTransactions: [
                { description: 'School Lunch - Alex', amount: -5.50 },
                { description: 'Allowance - Sarah', amount: 20.00 },
                { description: 'Book Store - Alex', amount: -12.99 },
                { description: 'Reward Points - Sarah', amount: 5.00 }
            ]
        };

        // Update balance display
        const balanceElement = document.querySelector('.stat-value');
        if (balanceElement) {
            balanceElement.textContent = `$${stats.totalBalance.toFixed(2)}`;
        }
    }

    setupEventListeners() {
        // Action buttons
        const actionButtons = document.querySelectorAll('.action-button');
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.textContent.trim();
                this.handleAction(action);
            });
        });
    }

    handleAction(action) {
        switch(action) {
            case 'Add Child Account':
                this.showAddChildModal();
                break;
            case 'Send Money':
                this.showSendMoneyModal();
                break;
            case 'Set Spending Limits':
                this.showSpendingLimitsModal();
                break;
            default:
                alert(`${action} functionality coming soon!`);
        }
    }

    showAddChildModal() {
        showAddChildModal();
    }

    showSendMoneyModal() {
        alert('Send Money functionality coming soon!');
    }

    showSpendingLimitsModal() {
        alert('Spending Limits functionality coming soon!');
    }
}

// ========================================
// DASHBOARD USER MENU FUNCTIONS
// ========================================

// User menu functions
function toggleUserMenu() {
    const dropdown = document.getElementById('userMenuDropdown');
    dropdown.classList.toggle('show');
}

function showProfile() {
    alert('Profile settings coming soon!');
}

function showSecurity() {
    alert('Security settings coming soon!');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        auth.logout();
    }
}

// Close user menu when clicking outside
document.addEventListener('click', function(event) {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userMenuDropdown');

    if (userMenu && !userMenu.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Initialize dashboard if we're on the dashboard page
if (window.location.pathname.includes('dashboard.html')) {
    new Dashboard();
}

// ========================================
// DASHBOARD MODAL FUNCTIONS
// ========================================

// Send Money Modal Functions
function showSendMoneyModal(childName) {
    document.getElementById('sendMoneyChildName').textContent = childName;
    document.getElementById('sendMoneyModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeSendMoneyModal() {
    document.getElementById('sendMoneyModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('sendMoneyForm').reset();
}

// Emergency Fund Modal Functions
function showEmergencyFundModal() {
    document.getElementById('emergencyFundModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    populateChildDropdown('emergencyChild');
}

function closeEmergencyFundModal() {
    document.getElementById('emergencyFundModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('emergencyFundForm').reset();
}

// Wallet Top-up Modal Functions
function showWalletTopUpModal() {
    document.getElementById('walletTopUpModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    populateChildDropdown('topupChild');
}

function closeWalletTopUpModal() {
    document.getElementById('walletTopUpModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('walletTopUpForm').reset();
}

// Spending Limits Modal Functions
function showSpendingLimitsModal() {
    document.getElementById('spendingLimitsModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    populateChildDropdown('limitsChild');
}

function closeSpendingLimitsModal() {
    document.getElementById('spendingLimitsModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('spendingLimitsForm').reset();
}

// Recurring Payments Modal Functions
function showRecurringPaymentsModal() {
    document.getElementById('recurringPaymentsModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeRecurringPaymentsModal() {
    document.getElementById('recurringPaymentsModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Add Child Modal Functions
function showAddChildModal() {
    document.getElementById('addChildModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeAddChildModal() {
    document.getElementById('addChildModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('addChildForm').reset();
}

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
    const modal = document.getElementById('addChildModal');
    if (event.target === modal) {
        closeAddChildModal();
    }
});

// Handle Add Child form submission
if (document.getElementById('addChildForm')) {
    document.getElementById('addChildForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const childData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            username: formData.get('username') || `${formData.get('firstName').toLowerCase()}@hapo.com`,
            password: formData.get('password') || 'defaultpass123',
            weeklyLimit: parseFloat(formData.get('weeklyLimit')) || 50,
            dailyLimit: parseFloat(formData.get('dailyLimit')) || 10,
            balance: 0,
            id: 'child_' + Date.now(),
            parentId: auth.getCurrentUser()?.id || 'parent_demo',
            createdAt: new Date().toISOString(),
            active: true
        };

        try {
            // Store child account (in real app, this would be sent to server)
            const existingChildren = JSON.parse(localStorage.getItem('hapo_children') || '[]');
            existingChildren.push(childData);
            localStorage.setItem('hapo_children', JSON.stringify(existingChildren));

            // Add child to the UI
            addChildToUI(childData);

            // Close modal and show success message
            closeAddChildModal();
            showSuccessMessage(`${childData.firstName}'s account created successfully!`);

        } catch (error) {
            console.error('Error creating child account:', error);
            alert('Failed to create child account. Please try again.');
        }
    });
}

function addChildToUI(childData) {
    const childrenList = document.getElementById('childrenList');
    const childCard = document.createElement('div');
    childCard.className = 'child-card';
    childCard.innerHTML = `
        <div class="child-avatar">${childData.firstName.charAt(0).toUpperCase()}${childData.lastName.charAt(0).toUpperCase()}</div>
        <div class="child-info">
            <div class="child-name">${childData.firstName} ${childData.lastName}</div>
            <div class="child-status">Active • Weekly limit: $${childData.weeklyLimit.toFixed(2)}</div>
        </div>
        <div class="child-balance">
            <div class="balance-amount">$${childData.balance.toFixed(2)}</div>
            <div class="balance-label">Available</div>
        </div>
        <div class="child-actions">
            <button class="action-btn send-money" onclick="sendMoneyToChild('${childData.firstName} ${childData.lastName}')">
                <i class="fas fa-paper-plane"></i>
                Send Money
            </button>
            <button class="action-btn view-activity" onclick="viewChildActivity('${childData.firstName} ${childData.lastName}')">
                View Activity
            </button>
        </div>
    `;
    childrenList.appendChild(childCard);
}

function sendMoneyToChild(childName) {
    const amount = prompt(`How much would you like to send to ${childName}?`, '10');
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
        showSuccessMessage(`$${parseFloat(amount).toFixed(2)} sent to ${childName} successfully!`);
        // In real app, this would update the database and child's balance
    }
}

function viewChildActivity(childName) {
    alert(`Viewing activity for ${childName} - Feature coming soon!`);
}

function showSuccessMessage(message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
            <button class="close-notification" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    document.body.appendChild(notification);

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);

    // Add CSS for success notification if not already added
    if (!document.getElementById('success-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'success-notification-styles';
        style.textContent = `
            .success-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #d1fae5;
                border: 1px solid #10b981;
                border-radius: 8px;
                z-index: 1001;
                min-width: 300px;
                max-width: 400px;
                animation: slideIn 0.3s ease-out;
            }

            .success-notification .notification-content {
                padding: 16px;
                display: flex;
                align-items: center;
                gap: 12px;
                color: #065f46;
            }

            .success-notification .fa-check-circle {
                color: #10b981;
                font-size: 1.25rem;
            }

            .success-notification .close-notification {
                margin-left: auto;
                background: none;
                border: none;
                cursor: pointer;
                color: #065f46;
                padding: 4px;
            }

            .success-notification .close-notification:hover {
                color: #047857;
            }
        `;
        document.head.appendChild(style);
    }
}

// ========================================
// FORM HANDLERS FOR NEW FEATURES
// ========================================

// Send Money Form Handler
if (document.getElementById('sendMoneyForm')) {
    document.getElementById('sendMoneyForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const amount = parseFloat(formData.get('sendAmount'));
        const childName = document.getElementById('sendMoneyChildName').textContent;

        if (amount > 0) {
            // Add transaction to activity list
            addTransactionToActivity({
                type: 'transfer',
                title: `Money transfer to ${childName}`,
                amount: amount,
                positive: false
            });

            closeSendMoneyModal();
            showSuccessMessage(`$${amount.toFixed(2)} sent to ${childName} successfully!`);
            updateFamilyBalance(-amount);
        }
    });
}

// Emergency Fund Form Handler
if (document.getElementById('emergencyFundForm')) {
    document.getElementById('emergencyFundForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const amount = parseFloat(formData.get('emergencyAmount'));
        const childName = formData.get('emergencyChild');

        if (amount > 0 && childName) {
            // Add emergency transaction to activity list
            addTransactionToActivity({
                type: 'emergency',
                title: `Emergency fund transfer to ${childName}`,
                amount: amount,
                positive: false
            });

            closeEmergencyFundModal();
            showSuccessMessage(`Emergency funds transferred successfully!`);
            updateFamilyBalance(-amount);
        }
    });
}

// Wallet Top-up Form Handler
if (document.getElementById('walletTopUpForm')) {
    document.getElementById('walletTopUpForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const amount = parseFloat(formData.get('topupAmount'));
        const childName = formData.get('topupChild');

        if (amount > 0 && childName) {
            // Add top-up transaction to activity list
            addTransactionToActivity({
                type: 'wallet',
                title: `Wallet top-up for ${childName}`,
                amount: amount,
                positive: false
            });

            closeWalletTopUpModal();
            showSuccessMessage(`Wallet topped up successfully!`);
            updateFamilyBalance(-amount);
        }
    });
}

// Spending Limits Form Handler
if (document.getElementById('spendingLimitsForm')) {
    document.getElementById('spendingLimitsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const childName = formData.get('limitsChild');
        const dailyLimit = parseFloat(formData.get('dailyLimit'));
        const weeklyLimit = parseFloat(formData.get('weeklyLimit'));

        if (childName && (dailyLimit || weeklyLimit)) {
            closeSpendingLimitsModal();
            showSuccessMessage(`Spending limits updated for ${childName}!`);
        }
    });
}

// ========================================
// UTILITY FUNCTIONS FOR NEW FEATURES
// ========================================

function populateChildDropdown(selectId) {
    const select = document.getElementById(selectId);
    const existingChildren = JSON.parse(localStorage.getItem('hapo_children') || '[]');
    const currentUser = auth.getCurrentUser();

    // Clear existing options except the first one
    while (select.children.length > 1) {
        select.removeChild(select.lastChild);
    }

    // Add sample child if no children exist
    const option = document.createElement('option');
    option.value = 'Inam Bhele';
    option.textContent = 'Inam Bhele';
    select.appendChild(option);

    if (currentUser) {
        const userChildren = existingChildren.filter(child => child.parentId === currentUser.id);
        userChildren.forEach(child => {
            const option = document.createElement('option');
            option.value = `${child.firstName} ${child.lastName}`;
            option.textContent = `${child.firstName} ${child.lastName}`;
            select.appendChild(option);
        });
    }
}

function addTransactionToActivity(transaction) {
    const activityList = document.getElementById('activityList');
    const transactionElement = document.createElement('div');
    transactionElement.className = 'activity-item';

    const iconClass = transaction.type === 'emergency' ? 'emergency' : 
                     transaction.type === 'wallet' ? 'wallet' : 'transfer';
    const iconSymbol = transaction.type === 'emergency' ? 'fa-exclamation-triangle' :
                      transaction.type === 'wallet' ? 'fa-wallet' : 'fa-exchange-alt';

    transactionElement.innerHTML = `
        <div class="activity-icon ${iconClass}">
            <i class="fas ${iconSymbol}"></i>
        </div>
        <div class="activity-details">
            <div class="activity-title">${transaction.title}</div>
            <div class="activity-date">${new Date().toLocaleDateString()}</div>
        </div>
        <div class="activity-amount ${transaction.positive ? 'positive' : 'negative'}">
            ${transaction.positive ? '+' : '-'}$${transaction.amount.toFixed(2)}
        </div>
    `;

    // Insert at the beginning of the activity list
    activityList.insertBefore(transactionElement, activityList.firstChild);
}

function updateFamilyBalance(amount) {
    const balanceElement = document.getElementById('familyBalance');
    const currentBalance = parseFloat(balanceElement.textContent.replace('$', ''));
    const newBalance = currentBalance + amount;
    balanceElement.textContent = `$${newBalance.toFixed(2)}`;
}

function showTransactionReports() {
    alert('Smart transaction reports feature coming soon! This will include:\n\n• Spending pattern analysis\n• Category breakdowns\n• Weekly/monthly summaries\n• Safety alerts and notifications\n• Unusual spending detection');
}

function showSafetySettings() {
    alert('Safety alert settings coming soon! Configure:\n\n• Out-of-hours spending alerts\n• Unusual location notifications\n• Large transaction alerts\n• Emergency contact settings');
}

function showAddRecurringModal() {
    alert('Add recurring payment feature coming soon! Set up:\n\n• School fee auto-payments\n• Transport payments\n• Lunch money schedules\n• Custom recurring transfers');
}

function viewChildActivity(childName) {
    alert(`Viewing detailed activity for ${childName}:\n\n• Transaction history\n• Spending patterns\n• Location data\n• Safety alerts\n• Performance metrics`);
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const modals = ['addChildModal', 'sendMoneyModal', 'emergencyFundModal', 'walletTopUpModal', 'spendingLimitsModal', 'recurringPaymentsModal'];

    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// ========================================
// BOTTOM NAVIGATION FUNCTIONS
// ========================================

function showSection(sectionName) {
    // Hide all sections
    const sections = ['homeSection', 'activitySection', 'paySection', 'rewardsSection', 'gamingSection'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            element.style.display = 'none';
        }
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionName + 'Section');
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }

    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Find and activate the clicked nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const text = item.querySelector('span')?.textContent?.toLowerCase();
        if (text === sectionName.toLowerCase()) {
            item.classList.add('active');
        }
    });
}

// ========================================
// QR SCANNER FUNCTIONS
// ========================================

function startQRScan() {
    const scannerContainer = document.getElementById('qrScannerContainer');
    if (scannerContainer) {
        scannerContainer.style.display = 'block';

        // Simulate camera access (in real app, this would use navigator.mediaDevices.getUserMedia)
        showSuccessMessage('QR Scanner activated! Point camera at QR code to scan.');

        // Mock QR scan result after 3 seconds for demo
        setTimeout(() => {
            mockQRScanResult();
        }, 3000);
    }
}

function closeQRScanner() {
    const scannerContainer = document.getElementById('qrScannerContainer');
    if (scannerContainer) {
        scannerContainer.style.display = 'none';
    }
}

function toggleFlash() {
    // Mock flash toggle (in real app, this would control camera flash)
    showSuccessMessage('Flash toggled!');
}

function switchCamera() {
    // Mock camera switch (in real app, this would switch between front/back camera)
    showSuccessMessage('Camera switched!');
}

function generatePaymentQR() {
    alert('Generate Payment QR feature coming soon!\n\nThis will allow you to:\n• Create QR codes for receiving payments\n• Set payment amounts and recipient information\n• Share QR codes with family members\n• Track payments received via QR');
}

function mockQRScanResult() {
    // Simulate a successful QR code scan
    closeQRScanner();

    // Mock payment data from QR code
    const mockPaymentData = {
        merchant: 'School Cafeteria',
        amount: '$8.50',
        description: 'Lunch payment'
    };

    // Show payment confirmation
    if (confirm(`Payment Details:\n\nMerchant: ${mockPaymentData.merchant}\nAmount: ${mockPaymentData.amount}\nDescription: ${mockPaymentData.description}\n\nProceed with payment?`)) {
        // Add to recent payments
        addQRPaymentToHistory(mockPaymentData);
        showSuccessMessage(`Payment of ${mockPaymentData.amount} to ${mockPaymentData.merchant} successful!`);

        // Update family balance
        const amount = parseFloat(mockPaymentData.amount.replace('$', ''));
        updateFamilyBalance(-amount);
    }
}

function addQRPaymentToHistory(paymentData) {
    const qrPaymentList = document.querySelector('.qr-payment-list');
    if (qrPaymentList) {
        const paymentItem = document.createElement('div');
        paymentItem.className = 'qr-payment-item';
        paymentItem.innerHTML = `
            <div class="qr-payment-icon">
                <i class="fas fa-store"></i>
            </div>
            <div class="qr-payment-details">
                <div class="qr-payment-title">${paymentData.merchant}</div>
                <div class="qr-payment-date">Just now</div>
            </div>
            <div class="qr-payment-amount">${paymentData.amount}</div>
        `;

        // Insert at the beginning of the list
        qrPaymentList.insertBefore(paymentItem, qrPaymentList.firstChild);
    }
}

// ========================================
// ACTIVITY FILTER FUNCTIONS
// ========================================

function setActivityFilter(filterType) {
    // Remove active class from all filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active class to clicked button
    event.target.classList.add('active');

    // In a real app, this would filter the activity list based on the selected filter
    showSuccessMessage(`Filtering activity by: ${filterType}`);
}

// Add click handlers for filter buttons
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const filters = ['All', 'This Week', 'This Month', 'Custom Range'];
            setActivityFilter(filters[index]);
        });
    });
});

// Load existing children on page load
if (window.location.pathname.includes('parentDashboard.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const existingChildren = JSON.parse(localStorage.getItem('hapo_children') || '[]');
        const currentUser = auth.getCurrentUser();

        if (currentUser) {
            // Filter children for current parent
            const userChildren = existingChildren.filter(child => child.parentId === currentUser.id);

            // Clear existing sample child and add real children
            const childrenList = document.getElementById('childrenList');
            if (userChildren.length > 0) {
                childrenList.innerHTML = ''; // Clear sample data
                userChildren.forEach(child => addChildToUI(child));
            }
        }
    });
}

// ========================================
// STUDENT DASHBOARD FUNCTIONALITY
// ========================================

// Student Authentication
class StudentAuth {
    constructor() {
        this.currentStudent = null;
        this.init();
    }

    init() {
        // Check if student is already logged in
        const studentData = localStorage.getItem('hapo_current_student');
        if (studentData) {
            this.currentStudent = JSON.parse(studentData);
        }
    }

    async studentLogin(username, password) {
        try {
            // Get all children from localStorage
            const children = JSON.parse(localStorage.getItem('hapo_children') || '[]');

            // Find student by username
            const student = children.find(child => 
                child.username === username || 
                `${child.firstName.toLowerCase()}@hapo.com` === username.toLowerCase()
            );

            if (!student) {
                return { success: false, error: 'Student account not found' };
            }

            // Check password (in real app, this would be hashed)
            if (student.password !== password && password !== 'defaultpass123') {
                return { success: false, error: 'Invalid password' };
            }

            // Set current student
            this.currentStudent = student;
            localStorage.setItem('hapo_current_student', JSON.stringify(student));

            return { success: true };
        } catch (error) {
            console.error('Student login error:', error);
            return { success: false, error: 'Login failed. Please try again.' };
        }
    }

    getCurrentStudent() {
        return this.currentStudent;
    }

    isStudentAuthenticated() {
        return !!this.currentStudent;
    }

    studentLogout() {
        localStorage.removeItem('hapo_current_student');
        this.currentStudent = null;
        window.location.href = 'index.html';
    }
}

// Initialize student auth
const studentAuth = new StudentAuth();

// Student Dashboard Class
class StudentDashboard {
    constructor() {
        this.student = studentAuth.getCurrentStudent();
        this.transactions = [];
        this.rewards = { totalPoints: 1250, monthlyPoints: 350 };
        this.achievements = [];
        this.init();
    }

    init() {
        if (!this.student) return;

        this.loadStudentData();
        this.setupEventListeners();
        this.loadTransactions();
        this.updateRewardsDisplay();
    }

    loadStudentData() {
        // Update student info in UI
        const studentNameEl = document.getElementById('studentUserName');
        const studentAvatarEl = document.getElementById('studentAvatar');
        const studentNameProfileEl = document.getElementById('studentName');
        const studentUsernameEl = document.getElementById('studentUsername');

        if (studentNameEl) {
            studentNameEl.textContent = `Welcome, ${this.student.firstName} ${this.student.lastName}`;
        }
        if (studentAvatarEl) {
            studentAvatarEl.textContent = `${this.student.firstName.charAt(0)}${this.student.lastName.charAt(0)}`;
        }
        if (studentNameProfileEl) {
            studentNameProfileEl.textContent = `${this.student.firstName} ${this.student.lastName}`;
        }
        if (studentUsernameEl) {
            studentUsernameEl.textContent = this.student.username;
        }

        // Update balance and limits
        const balanceEl = document.getElementById('studentBalance');
        const weeklyLimitEl = document.getElementById('weeklyLimit');
        const weeklySpentEl = document.getElementById('weeklySpent');

        if (balanceEl) {
            balanceEl.textContent = `$${this.student.balance.toFixed(2)}`;
        }
        if (weeklyLimitEl) {
            weeklyLimitEl.textContent = `$${this.student.weeklyLimit.toFixed(2)}`;
        }
        if (weeklySpentEl) {
            const weeklySpent = this.calculateWeeklySpent();
            weeklySpentEl.textContent = `$${weeklySpent.toFixed(2)} spent this week`;
        }
    }

    calculateWeeklySpent() {
        // Mock calculation - in real app, this would sum transactions from the current week
        return 45.00;
    }

    loadTransactions() {
        // Mock transaction data - in real app, this would load from server
        this.transactions = [
            {
                id: 1,
                title: 'School Cafeteria',
                category: 'food',
                amount: -8.50,
                date: new Date(),
                icon: 'fa-utensils'
            },
            {
                id: 2,
                title: 'Money received from parent',
                category: 'transfer',
                amount: 25.00,
                date: new Date(Date.now() - 86400000), // Yesterday
                icon: 'fa-arrow-down'
            },
            {
                id: 3,
                title: 'Bus Card Top-up',
                category: 'transport',
                amount: -12.00,
                date: new Date(Date.now() - 86400000),
                icon: 'fa-bus'
            }
        ];

        this.updateTransactionsList();
    }

    updateTransactionsList() {
        const detailedActivityList = document.getElementById('detailedActivityList');
        if (!detailedActivityList) return;

        detailedActivityList.innerHTML = '';

        this.transactions.forEach(transaction => {
            const transactionEl = document.createElement('div');
            transactionEl.className = 'detailed-activity-item';

            const isPositive = transaction.amount > 0;
            const categoryClass = transaction.category;

            transactionEl.innerHTML = `
                <div class="activity-icon ${categoryClass}">
                    <i class="fas ${transaction.icon}"></i>
                </div>
                <div class="activity-details">
                    <div class="activity-title">${transaction.title}</div>
                    <div class="activity-date">${this.formatDate(transaction.date)}</div>
                </div>
                <div class="activity-amount ${isPositive ? 'positive' : 'negative'}">
                    ${isPositive ? '+' : ''}$${Math.abs(transaction.amount).toFixed(2)}
                </div>
            `;

            detailedActivityList.appendChild(transactionEl);
        });
    }

    formatDate(date) {
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return 'Today, ' + date.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
        } else if (days === 1) {
            return 'Yesterday, ' + date.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
        } else {
            return date.toLocaleDateString();
        }
    }

    updateRewardsDisplay() {
        const totalPointsEl = document.getElementById('totalPoints');
        const monthlyPointsEl = document.getElementById('monthlyPoints');

        if (totalPointsEl) {
            totalPointsEl.textContent = this.rewards.totalPoints.toLocaleString();
        }
        if (monthlyPointsEl) {
            monthlyPointsEl.textContent = this.rewards.monthlyPoints.toLocaleString();
        }
    }

    setupEventListeners() {
        // Request money form
        const requestForm = document.getElementById('requestMoneyForm');
        if (requestForm) {
            requestForm.addEventListener('submit', (e) => this.handleMoneyRequest(e));
        }

        // Emergency request form
        const emergencyForm = document.getElementById('emergencyRequestForm');
        if (emergencyForm) {
            emergencyForm.addEventListener('submit', (e) => this.handleEmergencyRequest(e));
        }
    }

    handleMoneyRequest(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const amount = parseFloat(formData.get('requestAmount'));
        const reason = formData.get('requestReason');

        // In real app, this would send a notification to parent
        this.sendRequestToParent('money', { amount, reason });

        closeRequestMoneyModal();
        showSuccessMessage(`Money request of $${amount.toFixed(2)} sent to your parent!`);
    }

    handleEmergencyRequest(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const amount = parseFloat(formData.get('emergencyAmount'));
        const reason = formData.get('emergencyReason');

        // In real app, this would send an urgent notification to parent
        this.sendRequestToParent('emergency', { amount, reason });

        closeEmergencyRequestModal();
        showSuccessMessage('Emergency request sent! Your parent will be notified immediately.');
    }

    sendRequestToParent(type, data) {
        // Mock implementation - in real app, this would send to server/parent
        const requests = JSON.parse(localStorage.getItem('hapo_student_requests') || '[]');
        const newRequest = {
            id: Date.now(),
            studentId: this.student.id,
            studentName: `${this.student.firstName} ${this.student.lastName}`,
            type: type,
            amount: data.amount,
            reason: data.reason,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        requests.push(newRequest);
        localStorage.setItem('hapo_student_requests', JSON.stringify(requests));
    }

    addTransaction(transaction) {
        this.transactions.unshift(transaction);
        this.updateTransactionsList();

        // Update balance
        this.student.balance += transaction.amount;
        this.updateStudentData();
    }

    updateStudentData() {
        // Update student data in localStorage
        const children = JSON.parse(localStorage.getItem('hapo_children') || '[]');
        const studentIndex = children.findIndex(child => child.id === this.student.id);

        if (studentIndex !== -1) {
            children[studentIndex] = this.student;
            localStorage.setItem('hapo_children', JSON.stringify(children));
            localStorage.setItem('hapo_current_student', JSON.stringify(this.student));
        }

        this.loadStudentData();
    }
}

// Initialize student dashboard if on student dashboard page
if (window.location.pathname.includes('studentDashboard.html')) {
    if (!studentAuth.isStudentAuthenticated()) {
        window.location.href = 'studentLogin.html';
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            new StudentDashboard();
        });
    }
}

// ========================================
// STUDENT LOGIN FORM HANDLER
// ========================================

if (document.getElementById('studentLoginForm')) {
    document.getElementById('studentLoginForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const username = formData.get('username');
        const password = formData.get('password');

        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        // Show loading
        const button = document.getElementById('studentLoginButton');
        const buttonText = document.getElementById('studentLoginButtonText');
        const spinner = document.getElementById('studentLoginSpinner');

        button.disabled = true;
        buttonText.style.display = 'none';
        spinner.style.display = 'block';

        try {
            const result = await studentAuth.studentLogin(username, password);

            if (result.success) {
                window.location.href = 'studentDashboard.html';
            } else {
                document.getElementById('studentPasswordError').textContent = result.error;
            }
        } catch (error) {
            console.error('Student login error:', error);
            document.getElementById('studentPasswordError').textContent = 'Login failed. Please try again.';
        } finally {
            button.disabled = false;
            buttonText.style.display = 'block';
            spinner.style.display = 'none';
        }
    });
}

// ========================================
// STUDENT DASHBOARD MODAL FUNCTIONS
// ========================================

function showRequestMoneyModal() {
    document.getElementById('requestMoneyModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeRequestMoneyModal() {
    document.getElementById('requestMoneyModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('requestMoneyForm').reset();
}

function showEmergencyRequestModal() {
    document.getElementById('emergencyRequestModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeEmergencyRequestModal() {
    document.getElementById('emergencyRequestModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('emergencyRequestForm').reset();
}

// ========================================
// STUDENT QR SCANNER FUNCTIONS
// ========================================

function startStudentQRScan() {
    const scannerContainer = document.getElementById('studentQRScannerContainer');
    if (scannerContainer) {
        scannerContainer.style.display = 'block';

        // Check spending limits before allowing scan
        const student = studentAuth.getCurrentStudent();
        if (student) {
            showSuccessMessage('QR Scanner activated! Point camera at QR code to pay.');

            // Mock QR scan result after 3 seconds for demo
            setTimeout(() => {
                mockStudentQRScanResult();
            }, 3000);
        }
    }
}

function closeStudentQRScanner() {
    const scannerContainer = document.getElementById('studentQRScannerContainer');
    if (scannerContainer) {
        scannerContainer.style.display = 'none';
    }
}

function mockStudentQRScanResult() {
    closeStudentQRScanner();

    const mockPaymentData = {
        merchant: 'School Cafeteria',
        amount: 8.50,
        description: 'Lunch payment'
    };

    // Check if student has enough balance and within limits
    const student = studentAuth.getCurrentStudent();
    if (student && student.balance >= mockPaymentData.amount) {
        if (confirm(`Payment Details:\n\nMerchant: ${mockPaymentData.merchant}\nAmount: $${mockPaymentData.amount}\nDescription: ${mockPaymentData.description}\n\nProceed with payment?`)) {
            // Process payment
            const studentDashboard = new StudentDashboard();
            studentDashboard.addTransaction({
                id: Date.now(),
                title: mockPaymentData.merchant,
                category: 'food',
                amount: -mockPaymentData.amount,
                date: new Date(),
                icon: 'fa-utensils'
            });

            showSuccessMessage(`Payment of $${mockPaymentData.amount} to ${mockPaymentData.merchant} successful!`);
        }
    } else {
        alert('Insufficient balance for this payment.');
    }
}

// ========================================
// STUDENT REWARDS FUNCTIONS
// ========================================

function redeemReward(rewardType) {
    const student = studentAuth.getCurrentStudent();
    if (!student) return;

    const rewardCosts = {
        'allowance': 500,
        'curfew': 750
    };

    const cost = rewardCosts[rewardType];
    const totalPoints = parseInt(document.getElementById('totalPoints').textContent.replace(/,/g, ''));

    if (totalPoints >= cost) {
        if (confirm(`Redeem this reward for ${cost} points?`)) {
            // Deduct points
            const newTotal = totalPoints - cost;
            document.getElementById('totalPoints').textContent = newTotal.toLocaleString();

            showSuccessMessage(`Reward redeemed successfully! A request has been sent to your parent.`);
        }
    } else {
        alert(`You need ${cost} points to redeem this reward. You currently have ${totalPoints} points.`);
    }
}

// ========================================
// STUDENT UTILITY FUNCTIONS
// ========================================

function updateSpendingPeriod() {
    const period = document.getElementById('spendingPeriod').value;
    showSuccessMessage(`Updated spending overview to show: ${period}`);
}

function filterTransactions(filterType) {
    // Remove active class from all filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active class to clicked button
    event.target.classList.add('active');

    showSuccessMessage(`Filtering transactions by: ${filterType}`);
}

function markAllNotificationsRead() {
    document.querySelectorAll('.notification-item').forEach(item => {
        item.classList.remove('unread');
    });
    showSuccessMessage('All notifications marked as read');
}

function showNotifications() {
    showSection('home');
    // Scroll to notifications section
    setTimeout(() => {
        document.querySelector('.notifications-section').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// Override logout function for students
if (window.location.pathname.includes('student')) {
    window.logout = function() {
        if (confirm('Are you sure you want to logout?')) {
            studentAuth.studentLogout();
        }
    };
}

// Update child login button to go to student login
document.addEventListener('DOMContentLoaded', function() {
    const childLoginBtns = document.querySelectorAll('.child-login-btn');
    childLoginBtns.forEach(btn => {
        if (btn.textContent.trim() === 'Child Login' || btn.textContent.trim() === 'Student Login') {
            btn.onclick = function() {
                window.location.href = 'studentLogin.html';
            };
        }
    });
});

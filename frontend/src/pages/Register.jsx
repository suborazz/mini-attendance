import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import Swal from 'sweetalert2';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
    });

    useEffect(() => {
        setError('');
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await API.post('/auth/register', { name, email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            await Toast.fire({
                icon: 'success',
                title: 'Account created successfully'
            });

            navigate('/dashboard');
        } catch (err) {
            const errorData = err.response?.data;
            if (errorData?.errors) {
                setError(errorData.errors.map(e => e.msg).join(', '));
            } else {
                setError(errorData?.message || 'Registration failed. Please check your details and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <style>{`
                .auth-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1.5rem;
                }

                .auth-card {
                    width: 100%;
                    max-width: 440px;
                    padding: 2.5rem;
                    border-radius: var(--radius-xl);
                    box-shadow: var(--shadow-lg);
                    text-align: center;
                    animation: fadeIn 0.6s ease-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .brand-logo {
                    width: 64px;
                    height: 64px;
                    background: linear-gradient(135deg, var(--secondary), var(--accent));
                    border-radius: 16px;
                    margin: 0 auto 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.5rem;
                    font-weight: 800;
                    box-shadow: 0 8px 16px -4px rgba(236, 72, 153, 0.4);
                }

                .auth-header h2 {
                    font-size: 1.75rem;
                    font-weight: 800;
                    margin-bottom: 0.5rem;
                    color: var(--text-main);
                }

                .auth-header p {
                    color: var(--text-muted);
                    margin-bottom: 2rem;
                }

                .error-box {
                    background: rgba(239, 68, 68, 0.1);
                    color: var(--danger);
                    padding: 0.75rem;
                    border-radius: var(--radius-md);
                    font-size: 0.875rem;
                    margin-bottom: 1.5rem;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                }

                .form-group {
                    text-align: left;
                    margin-bottom: 1.25rem;
                }

                .form-group label {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    color: var(--text-main);
                }

                .auth-input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border-radius: var(--radius-md);
                    border: 1px solid #e2e8f0;
                    outline: none;
                    transition: all 0.2s;
                    font-size: 1rem;
                }

                .auth-input:focus {
                    border-color: var(--secondary);
                    box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.1);
                }

                .auth-btn {
                    width: 100%;
                    margin-top: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    font-size: 1rem;
                    padding: 0.875rem;
                    background: linear-gradient(135deg, var(--secondary), var(--accent));
                }

                .auth-btn:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                    box-shadow: var(--shadow-lg);
                }

                .auth-btn:active {
                    transform: translateY(0);
                }

                .auth-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }

                .auth-footer {
                    margin-top: 2rem;
                    font-size: 0.875rem;
                    color: var(--text-muted);
                }

                .auth-link {
                    color: var(--secondary);
                    font-weight: 600;
                    text-decoration: none;
                }

                .auth-link:hover {
                    text-decoration: underline;
                }

                .spinner {
                    width: 18px;
                    height: 18px;
                    border: 2px solid white;
                    border-top-color: transparent;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>

            <div className="auth-card glass">
                <div className="brand-logo">A</div>
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p>Join us to start tracking your attendance</p>
                </div>

                {error && <div className="error-box">{error}</div>}

                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            className="auth-input"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            className="auth-input"
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            className="auth-input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="auth-btn btn-primary" type="submit" disabled={loading}>
                        {loading ? <div className="spinner"></div> : 'Register Now'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;

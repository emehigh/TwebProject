import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterForm: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        fetch('http://localhost:8090/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            }),
        })
            .then((res) => {
                if (res.ok) {
                    toast.success('Registration successful! Redirecting to login...', {
                        position: 'top-center',
                        autoClose: 3000,
                    });
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 3000); // Redirect after 3 seconds
                } else {
                    toast.error('Registration failed. Please try again.', {
                        position: 'top-center',
                        autoClose: 3000,
                    });
                }
            })
            .catch((error) => {
                console.error('Error during registration:', error);
                toast.error('An error occurred. Please try again.', {
                    position: 'top-center',
                    autoClose: 3000,
                });
            });
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    maxWidth: '400px',
                    margin: '0 auto',
                    padding: '20px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#f9f9f9',
                }}
            >
                <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>Register</h2>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="username" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                        Username:
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '16px',
                            backgroundColor: '#fff',
                        }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="email" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '16px',
                            backgroundColor: '#fff',
                        }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="password" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '16px',
                            backgroundColor: '#fff',
                        }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="confirmPassword" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                        Confirm Password:
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        style={{
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '16px',
                            backgroundColor: '#fff',
                        }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: 'pointer',
                    }}
                >
                    Register
                </button>
            </form>
            <ToastContainer />
        </>
    );
};

export default RegisterForm;
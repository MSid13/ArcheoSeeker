
import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { canAttemptLogin, recordFailedLogin } from '../services/loginAttemptService';

interface AdminLoginProps {
    onLogin: (email: string, password: string) => Promise<boolean>;
    onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        if (!canAttemptLogin()) {
            setIsLocked(true);
            setError('Too many failed login attempts. Please try again later.');
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!canAttemptLogin()) {
            setIsLocked(true);
            setError('Too many failed login attempts. Please try again later.');
            return;
        }

        setError('');
        setIsLoading(true);
        const success = await onLogin(email, password);
        setIsLoading(false);
        if (!success) {
            // The login attempt is already recorded inside App.tsx's handleLogin
            if (!canAttemptLogin()) {
                 setIsLocked(true);
                 setError('Too many failed login attempts. Please try again later.');
            } else {
                setError('Incorrect email or password. Please try again.');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
             <button
                onClick={onBack}
                className="flex items-center text-amber-800 hover:text-amber-900 font-semibold mb-6 transition-colors"
            >
                <ChevronLeftIcon className="h-5 w-5 mr-2"/>
                Back to Site
            </button>
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-stone-800 mb-6">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-stone-600 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-800"
                            required
                            autoComplete="email"
                            disabled={isLocked}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-stone-600 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-800"
                            required
                            autoComplete="current-password"
                            disabled={isLocked}
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading || isLocked}
                        className="w-full bg-amber-800 text-white font-bold py-2 px-4 rounded-md hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-700 transition duration-200 disabled:bg-stone-400"
                    >
                        {isLoading ? 'Verifying...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;

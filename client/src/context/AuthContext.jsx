import React, { createContext, useContext, useState } from 'react';
import { apiPost } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		const saved = localStorage.getItem('clientUser');
		return saved ? JSON.parse(saved) : null;
	});

	const saveSession = (result) => {
		localStorage.setItem('clientToken', result.token);
		localStorage.setItem('clientUser', JSON.stringify(result.user));
		setUser(result.user);
	};

	const login = async (email, password) => {
		const result = await apiPost('/auth/login', { email, password });
		saveSession(result);
		return result.user;
	};

	const register = async (payload) => {
		const result = await apiPost('/auth/register', payload);
		saveSession(result);
		return result.user;
	};

	const logout = () => {
		localStorage.removeItem('clientToken');
		localStorage.removeItem('clientUser');
		setUser(null);
	};

	return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

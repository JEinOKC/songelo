import { useState } from 'react';

const getCookie = (key: string): string | null => {
	// Match cookie by key
	const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
	return match ? decodeURIComponent(match[2]) : null;
};

const setCookie = (key: string, value: string, days: number = 7) => {
	const expires = new Date();
	expires.setDate(expires.getDate() + days);
	document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
};

const deleteCookie = (key: string) => {
	document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const useStateWithCookies = <T>(key: string, initialValue: T, days: number = 7) => {
	const [value, setValue] = useState<T>(() => {
		const cookieValue = getCookie(key);
		if (cookieValue !== null) {
			try {
				return JSON.parse(cookieValue) as T;
			} catch (error) {
				return initialValue;
			}
		}
		return initialValue;
	});

	const setValueAndCookie = (newValue: T | null) => {
		setValue(newValue as T);
		if (newValue === null) {
			deleteCookie(key);
		} else {
			setCookie(key, JSON.stringify(newValue), days);
		}
	};

	return [value, setValueAndCookie] as const;
};

export default useStateWithCookies;

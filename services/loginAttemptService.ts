const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 24 * 60 * 60 * 1000; // 24 hours in ms
const STORAGE_KEY = 'adminLoginAttempts';

interface LoginAttemptInfo {
    attempts: number;
    firstAttemptTimestamp: number;
}

const getLoginInfo = (): LoginAttemptInfo | null => {
    const storedInfo = localStorage.getItem(STORAGE_KEY);
    if (!storedInfo) return null;
    try {
        return JSON.parse(storedInfo);
    } catch (e) {
        return null;
    }
};

const setLoginInfo = (info: LoginAttemptInfo) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
};

export const canAttemptLogin = (): boolean => {
    const info = getLoginInfo();
    if (!info) return true;

    const now = Date.now();
    if (now - info.firstAttemptTimestamp > LOCKOUT_DURATION) {
        // Lockout expired
        resetLoginAttempts();
        return true;
    }

    return info.attempts < MAX_ATTEMPTS;
};

export const recordFailedLogin = () => {
    const info = getLoginInfo();
    const now = Date.now();

    if (info && now - info.firstAttemptTimestamp < LOCKOUT_DURATION) {
        // Within current lockout period
        setLoginInfo({
            ...info,
            attempts: info.attempts + 1,
        });
    } else {
        // Start a new attempt window
        setLoginInfo({
            attempts: 1,
            firstAttemptTimestamp: now,
        });
    }
};

export const resetLoginAttempts = () => {
    localStorage.removeItem(STORAGE_KEY);
};

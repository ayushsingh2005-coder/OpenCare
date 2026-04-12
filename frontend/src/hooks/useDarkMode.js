import { useState, useEffect } from 'react';
import { toggleDarkMode, isDarkMode } from '../utils/darkMode';

export const useDarkMode = () => {
    const [dark, setDark] = useState(isDarkMode());

    const toggle = () => {
        const newState = toggleDarkMode();
        setDark(newState);
    };

    return { dark, toggle };
};
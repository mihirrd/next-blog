'use client';
import { useEffect, useState, useCallback } from 'react';

// Define theme constants
const LIGHT_THEME = 'retro';
const DARK_THEME = 'dark';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('');
  
  // Memoize the theme toggle function to prevent unnecessary re-renders
  const toggleTheme = useCallback(() => {
    if (theme === '') return;
    
    // Toggle between light and dark themes
    const newTheme = theme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
    
    // Apply theme change immediately to DOM for faster visual feedback
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Update state and localStorage after visual change
    setTheme(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  }, [theme]);
  
  // Initialize theme only once on component mount
  useEffect(() => {
    // This code only runs on the client
    let savedTheme = LIGHT_THEME; // Default to light theme
    try {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        // Make sure the stored theme is one of our valid themes
        savedTheme = [LIGHT_THEME, DARK_THEME].includes(storedTheme) 
          ? storedTheme 
          : LIGHT_THEME;
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
    
    // Set theme in DOM first for immediate visual effect
    document.documentElement.setAttribute('data-theme', savedTheme);
    // Then update state
    setTheme(savedTheme);
  }, []);

  // Don't render anything until we know we're on the client
  if (theme === '') return null;

  return (
    <button 
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle flex items-center justify-center"
      aria-label="Toggle theme"
    >
      {theme === LIGHT_THEME ? (
        // Moon icon for dark mode
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        // Sun icon for light mode
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle; 
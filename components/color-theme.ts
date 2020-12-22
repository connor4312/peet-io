import { createContext } from 'react';

export interface IDarkContext {
  isDark: boolean;
  toggleDarkMode(): void;
}

export const DarkContext = createContext<IDarkContext>({ isDark: true, toggleDarkMode: () => {} });

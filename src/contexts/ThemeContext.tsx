// src/contexts/ThemeContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// 1. Cria o contexto com um valor padrão
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 2. Cria o Provedor (o componente que vai gerenciar o estado)
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Inicia o tema com base no localStorage ou preferência do sistema
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) return savedTheme;
    // Se não houver tema salvo, usa a preferência do sistema operacional
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // 3. Efeito que roda sempre que o tema muda
  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark'); // Limpa classes antigas
    root.classList.add(theme); // Adiciona a classe do tema atual ('dark' ou 'light')
    
    // Salva a preferência no localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
import { AppProps } from 'next/dist/next-server/lib/router/router';
import { useMemo, useState } from 'react';
import { DarkContext } from '../components/color-theme';
import { classes } from '../lib/ui';
import '../styles/global.scss';

export default function App({ Component, pageProps }: AppProps) {
  const [isDark, setIsDark] = useState(false);

  const darkContext = useMemo(
    () => ({
      isDark,
      toggleDarkMode: () => setIsDark(!isDark),
    }),
    [isDark],
  );

  return (
    <DarkContext.Provider value={darkContext}>
      <div className={classes('global-container', isDark ? 'theme-dark' : 'theme-light')}>
        <Component {...pageProps} />
      </div>
    </DarkContext.Provider>
  );
}

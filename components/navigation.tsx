import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { classes } from '../lib/ui';
import { DarkContext } from './color-theme';
import { Container } from './container';
import styles from './navigation.module.scss';

export const Navigation: React.FC = () => (
  <Container>
    <nav className={styles.nav}>
      <ul>
        <li style={{ flexGrow: 1 }}>
          <Logo />
        </li>
        <li>
          <NavItem href="/oss">OSS</NavItem>
        </li>
        <li>
          <NavItem href="/blog">Blog</NavItem>
        </li>
        <li>
          <DarkToggle />
        </li>
      </ul>
    </nav>
  </Container>
);

const Logo: React.FC = () => {
  const router = useRouter();
  return (
    <Link href="/">
      <a className={classes(styles.name, router.pathname === '/' && styles.active)}>
        <span aria-hidden>CP</span>
        <span aria-label="Home">Connor Peet</span>
      </a>
    </Link>
  );
};

const DarkToggle: React.FC = () => {
  const { toggleDarkMode } = useContext(DarkContext);
  return (
    <button onClick={toggleDarkMode} className={styles.darkToggle}>
      *
    </button>
  );
};

const NavItem: React.FC<{ href: string }> = ({ href, children }) => {
  const router = useRouter();
  return (
    <Link href={href}>
      <a className={classes(styles.name, router.pathname === href && styles.active)}>{children}</a>
    </Link>
  );
};

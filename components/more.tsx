import Link from 'next/link';
import React from 'react';
import styles from './more.module.scss';

export const More: React.FC<{ text?: string; href: string }> = ({ text = 'More', href }) => (
  <div className={styles.more}>
    <Link href={href}>
      <a>{text} ]</a>
    </Link>
  </div>
);

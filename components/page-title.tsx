import Head from 'next/head';
import React from 'react';

const name = 'Connor Peet';

export const PageTitle: React.FC<{ v: string }> = ({ v }) => (
  <Head>
    <title>{v ? `${v} - ${name}` : name}</title>
  </Head>
);

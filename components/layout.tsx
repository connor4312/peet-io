import Head from 'next/head';
import { Navigation } from './navigation';

const name = 'Connor Peet';
const Layout: React.FC<{ title?: string }> = ({ children, title }) => (
  <>
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <meta name="description" content="Learn how to build a personal website using Next.js" />
      <meta name="twitter:card" content="summary_large_image" />
      <title>{title ? `${title} - ${name}` : name}</title>
    </Head>
    <Navigation />
    <main style={{ marginBottom: '5rem'}}>{children}</main>
  </>
);

export default Layout;

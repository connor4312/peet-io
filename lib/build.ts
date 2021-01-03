import { promises as fs } from 'fs';
import { join } from 'path';
import RSS from 'rss';
import { posts } from '../lib/static-content';

const siteUrl = 'https://80d214450b3e.ngrok.io';

export const build = () => Promise.all([buildRssFeed()]);

/**
 * Generates an RSS feed for the blog.
 */
async function buildRssFeed() {
  const rss = new RSS({
    title: 'Connor Peet - Blog',
    feed_url: `${siteUrl}/blog/rss`,
    site_url: siteUrl,
  });

  for (const post of await posts.provideSummaries()) {
    rss.item({
      title: post.title,
      description: post.firstParagraph,
      url: `${siteUrl}/blog/${post.id}`,
      date: new Date(post.date),
    });
  }

  // cannot use __dirname, https://github.com/vercel/next.js/issues/8251
  await fs.writeFile(join(process.cwd(), 'public', 'blog.rss'), rss.xml());
}

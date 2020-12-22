import Link from 'next/link';
import React from 'react';
import { IPost } from '../lib/static-content';
import { More } from './more';

export const PostList: React.FC<{ more?: boolean; posts: ReadonlyArray<IPost> }> = ({
  posts,
  more = true,
}) => (
  <>
    {posts.map((p, i) => (
      <React.Fragment key={i}>
        <h2 style={{ margin: '3rem 0 0.5rem' }}>
          <Link href={`/blog/${p.id}`}>
            <a style={{ textDecoration: 'none' }}>{p.title}</a>
          </Link>
        </h2>
        <div className="long-form" dangerouslySetInnerHTML={{ __html: p.firstParagraph }} />
        {more ? (
          <More href={`/blog/${p.id}`} text="Read More" />
        ) : (
          <Link href={`/blog/${p.id}`}>
            <a>[...]</a>
          </Link>
        )}
      </React.Fragment>
    ))}
  </>
);

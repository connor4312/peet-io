import { GetStaticProps } from 'next';
import React from 'react';
import { Container } from '../../components/container';
import Layout from '../../components/layout';
import { PostList } from '../../components/post-list';
import { IPost, posts } from '../../lib/static-content';

interface IProps {
  posts: IPost[];
}

const Posts: React.FC<IProps> = ({ posts }) => (
  <Layout>
    <Container>
      <h1 style={{ marginBottom: '4rem' }}>Posts</h1>
      <PostList posts={posts} />
    </Container>
  </Layout>
);

export default Posts;

export const getStaticProps: GetStaticProps<IProps> = async () => ({
  props: {
    posts: await posts.provideSummaries(),
  },
});

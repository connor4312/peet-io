import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { Date } from '../../components/date';
import Layout from '../../components/layout';
import { IPostWithContent, posts } from '../../lib/static-content';
import utilStyles from '../../styles/utils.module.css';

interface IProps {
  postData: IPostWithContent;
}

export default function Post({ postData }: IProps) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: await posts.provideRouteIds(),
  fallback: false,
});

export const getStaticProps: GetStaticProps<IProps, { id: string }> = async ({ params }) => ({
  props: {
    postData: await posts.provideFullData(params!.id),
  },
});

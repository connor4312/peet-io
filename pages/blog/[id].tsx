import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { Container } from '../../components/container';
import { DisplayDate } from '../../components/date';
import Layout from '../../components/layout';
import { IPostWithContent, posts } from '../../lib/static-content';

interface IProps {
  postData: IPostWithContent;
}

export default function Post({ postData }: IProps) {
  return (
    <Layout title={postData.title}>
      <Container>
        <article className="long-form">
          <Head>
            {postData.scripts?.map((attrs, i) => (
              <script
                type="text/html"
                key={i}
                {...(typeof attrs === 'string' ? { src: attrs } : attrs)}
              />
            ))}
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="@ConnorPeet" />
            <meta name="twitter:title" content={postData.title} />
            <meta name="twitter:description" content={postData.firstParagraph} />
            {postData.imageUrl && <meta name="twitter:image" content={postData.imageUrl} />}
          </Head>
          <h1>
            {postData.title}
            <small style={{ display: 'block' }}>
              <DisplayDate dateString={postData.date} />
            </small>
          </h1>

          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </article>
      </Container>
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

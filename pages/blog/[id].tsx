import { GetStaticPaths, GetStaticProps } from 'next';
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

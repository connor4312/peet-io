import { GetStaticPaths, GetStaticProps } from 'next';
import { Container } from '../../components/container';
import Layout from '../../components/layout';
import { IWorkWithContent, work } from '../../lib/static-content';

interface IProps {
  work: IWorkWithContent;
}

export default function Work({ work }: IProps) {
  return (
    <Layout title={work.name}>
      <Container>
        <article className="long-form">
          <h1>{work.name}</h1>
          <div dangerouslySetInnerHTML={{ __html: work.content }} />
        </article>
      </Container>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: await work.provideRouteIds(),
  fallback: false,
});

export const getStaticProps: GetStaticProps<IProps, { id: string }> = async ({ params }) => ({
  props: {
    work: await work.provideFullData(params!.id),
  },
});

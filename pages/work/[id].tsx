import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { Container } from '../../components/container';
import Layout from '../../components/layout';
import { IWorkWithContent, work } from '../../lib/static-content';
import styles from './[id].module.scss';

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

          <div className={styles.more}>
            {work.prev && (
              <Link href={`/work/${work.prev.id}`}>
                <a>[ {work.prev.name}</a>
              </Link>
            )}

            {work.next && (
              <Link href={`/work/${work.next.id}`}>
                <a>{work.next.name} ]</a>
              </Link>
            )}
          </div>
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

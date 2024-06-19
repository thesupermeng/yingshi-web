import TopicDetails from '@/app/topic/detail/id/[topicId]/topicDetails';

export default async function Page({ params }) {
  return (
    <TopicDetails topicId={params.topicId} />
  );
}
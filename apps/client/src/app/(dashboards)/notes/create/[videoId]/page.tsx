import { CreateNotePage } from "@/features/note/pages";

interface IPageProps {
  params: Promise<{ videoId: string }>;
}

async function Page({ params }: IPageProps) {
  const { videoId } = await params;

  return <CreateNotePage videoId={videoId} />;
}

export default Page;

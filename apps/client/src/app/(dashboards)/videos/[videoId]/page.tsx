import { VideoPage } from "@/features/video/pages";

interface IPageProps {
  params: Promise<{ videoId: string }>;
}

async function Page({ params }: IPageProps) {
  const { videoId } = await params;

  return <VideoPage videoId={videoId} />;
}

export default Page;

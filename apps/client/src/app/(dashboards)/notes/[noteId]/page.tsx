import { NotePage } from "@/features/note/pages";

interface IPageProps {
  params: Promise<{ noteId: string }>;
}

async function Page({ params }: IPageProps) {
  const { noteId } = await params;

  return <NotePage noteId={noteId} />;
}

export default Page;

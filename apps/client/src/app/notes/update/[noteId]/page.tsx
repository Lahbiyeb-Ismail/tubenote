import { UpdateNotePage } from "@/features/note/pages";

interface IPageProps {
  params: Promise<{ noteId: string }>;
}

async function Page({ params }: IPageProps) {
  const { noteId } = await params;

  return <UpdateNotePage noteId={noteId} />;
}

export default Page;

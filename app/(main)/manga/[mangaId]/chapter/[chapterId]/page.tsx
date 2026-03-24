import ChapterClient from "./ChapterClient";

interface ChapterPageProps {
  params: {
    mangaId: string;
    chapterId: string;
  };
}

const ChapterPage = async ({ params }: ChapterPageProps) => {
  const { mangaId, chapterId } = await params;

  return <ChapterClient mangaId={mangaId} chapterId={chapterId} />;
};

export default ChapterPage;

import MangaClient from "./MangaClient";

interface MangaDetailPageProps {
  params: {
    mangaId: string;
  };
}

const MangaDetailPage = async ({ params }: MangaDetailPageProps) => {
  const { mangaId } = await params;

  // 1. Fetch DB
  // const manga = await getMangaById(mangaId);

  // 2. Auth / permission
  // if (!manga) notFound();
  // if (!hasPermission) redirect("/403");

  return (
    <MangaClient
      mangaId={mangaId}
      // manga={manga}
    />
  );
}

export default MangaDetailPage;

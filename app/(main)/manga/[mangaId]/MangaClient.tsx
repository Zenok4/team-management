"use client";

import HeaderMangaPage from "./_components/header-manga-page";
import ListChapters from "./_components/list-chapters";
import OverrallManga from "./_components/overrall-process-manga";
import { getMangaById } from "@/services/manga-service";
import { useEffect, useState } from "react";
import { getChaptersByMangaId } from "@/services/chapter-service";
import { getChapterWorksByMangaId } from "@/services/chapter-work-service";
import { getRoles } from "@/services/role-service";
import { getMembers } from "@/services/member-service";

interface MangaClientProps {
  mangaId: string;
}

const MangaClient = ({ mangaId }: MangaClientProps) => {
  const [manga, setManga] = useState<any>();
  const [roles, setRoles] = useState<any>([]);
  const [members, setMembers] = useState<any>([]);
  const [chapters, setChapters] = useState<any>([]);
  const [chapterWork, setChapterWork] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const [mangaData, chaptersData, chapterWorkData, rolesData, membersData] =
        await Promise.all([
          getMangaById(mangaId),
          getChaptersByMangaId(mangaId),
          getChapterWorksByMangaId(mangaId),
          getRoles(),
          getMembers(),
        ]);

      setManga(mangaData);
      setChapters(chaptersData);
      setChapterWork(chapterWorkData);
      setRoles(rolesData);
      setMembers(membersData);

      setLoading(false);
    };

    fetchData();
  }, [mangaId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const fetchChapters = async () => {
    const [chaptersData, chapterWorkData] = await Promise.all([
      getChaptersByMangaId(mangaId),
      getChapterWorksByMangaId(mangaId),
    ]);
    setChapters(chaptersData);
    setChapterWork(chapterWorkData);
  };

  const fetchChapterWork = async () => {
    const chapterWorkData = await getChapterWorksByMangaId(mangaId);
    setChapterWork(chapterWorkData);
  };

  return (
    <div className="flex flex-col gap-6">
      {manga && (
        <HeaderMangaPage
          coverUrl={manga.cover}
          completedChapters={manga.completedChapters}
          description={manga.description}
          title={manga.title}
          totalChapters={manga.totalChapters}
          chapter={chapters}
          mangaId={mangaId}
          onChapterCreated={fetchChapters}
        />
      )}

      {chapters && <OverrallManga chapters={chapters} />}

      {!loading && (
        <ListChapters
          roles={roles}
          members={members}
          chapterWork={chapterWork}
          mangaId={mangaId}
          mangaTitle={manga?.title}
          onTaskCreated={fetchChapterWork}
        />
      )}
    </div>
  );
};

export default MangaClient;

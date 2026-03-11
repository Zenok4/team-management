"use client";

import {
  MOCK_CHAPTER,
  MOCK_CHAPTER_WORK,
  MOCK_MANGA,
  MOCK_MEMBERS,
  MOCK_ROLES,
} from "@/mock/mock-data";
import HeaderMangaPage from "./_components/header-manga-page";
import ListChapters from "./_components/list-chapters";
import OverrallManga from "./_components/overrall-process-manga";
import { Chapter, ChapterWork } from "@/types/manga";
import { getMangaById } from "@/services/manga-service";
import { useEffect, useState } from "react";
import { getChaptersByMangaId } from "@/services/chapter-service";

interface MangaClientProps {
  mangaId: string;
}

const MangaClient = ({ mangaId }: MangaClientProps) => {
  const [manga, setManga] = useState<any>();
  const roles = MOCK_ROLES;
  const members = MOCK_MEMBERS;
  const [chapters, setChapters] = useState<any>([]);
  const chapterWork = MOCK_CHAPTER_WORK as ChapterWork[];

  const fetchMangaDetails = async (id: string) => {
    const data = await getMangaById(id);
    setManga(data);
  };

  const fetchChapters = async (id: string) => {
    const data = await getChaptersByMangaId(id);
    setChapters(data);
  };

  useEffect(() => {
    fetchMangaDetails(mangaId);
    fetchChapters(mangaId);
  }, [mangaId]);

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
        />
      )}

      {chapters && <OverrallManga chapters={chapters} />}

      <ListChapters
        roles={roles}
        members={members}
        chapterWork={chapterWork}
        mangaId={mangaId}
        mangaTitle={manga?.title}
      />
    </div>
  );
};

export default MangaClient;

"use client";

import { MOCK_CHAPTER, MOCK_CHAPTER_WORK, MOCK_MANGA, MOCK_MEMBERS, MOCK_ROLES } from "@/mock/mock-data";
import HeaderMangaPage from "./_components/header-manga-page";
import ListChapters from "./_components/list-chapters";
import OverrallManga from "./_components/overrall-process-manga";
import { Chapter, ChapterWork } from "@/types/manga";

interface MangaClientProps {
  mangaId: string;
}

const MangaClient = ({ mangaId }: MangaClientProps) => {
  const manga = { ...MOCK_MANGA, id: mangaId };
  const roles = MOCK_ROLES;
  const members = MOCK_MEMBERS;
  const chapters = MOCK_CHAPTER as Chapter[];
  const chapterWork = MOCK_CHAPTER_WORK as ChapterWork[];

  return (
    <div className="flex flex-col gap-6">
      <HeaderMangaPage
        coverUrl={manga.cover}
        completedChapters={manga.completedChapter}
        description={manga.description}
        title={manga.title}
        totalChapters={manga.totalChapters}
        chapter={chapters}
        mangaId={mangaId}
        mangaTitle={manga.title}
      />

      <OverrallManga chapters={chapters} />

      <ListChapters
        roles={roles}
        members={members}
        chapterWork={chapterWork}
        mangaId={mangaId}
        mangaTitle={manga.title}
      />
    </div>
  );
};

export default MangaClient;

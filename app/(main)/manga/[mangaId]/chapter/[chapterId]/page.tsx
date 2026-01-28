import {
  MOCK_CHAPTER,
  MOCK_CHAPTER_WORK,
  MOCK_MANGA,
  MOCK_MEMBERS,
  MOCK_ROLES,
  MOCK_TASKS,
} from "@/mock/mock-data";
import ChapterClient from "./ChapterClient";
import { Chapter, ChapterWork, Manga, Task } from "@/types/manga";

interface ChapterPageProps {
  params: {
    mangaId: string;
    chapterId: string;
  };
}

const ChapterPage = async ({ params }: ChapterPageProps) => {
  const { mangaId, chapterId } = await params;

  const manga = MOCK_MANGA as Manga;
  const chapter = MOCK_CHAPTER.find((c) => c.id === chapterId) as Chapter;
  const chapterWork = MOCK_CHAPTER_WORK as ChapterWork[];
  const roles = MOCK_ROLES;
  const members = MOCK_MEMBERS;
  const tasks = MOCK_TASKS as Task[];
  return (
    <ChapterClient
      chapter={chapter}
      manga={manga}
      chapterWorks={chapterWork}
      members={members}
      roles={roles}
      tasks={tasks}
    />
  );
};

export default ChapterPage;

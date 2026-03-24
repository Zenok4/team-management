"use client";

import { useEffect, useState } from "react";
import { getMangaById } from "@/services/manga-service";
import { getChaptersByMangaId } from "@/services/chapter-service";
import { getChapterWorksByMangaId } from "@/services/chapter-work-service";
import { getRoles } from "@/services/role-service";
import { getMembers } from "@/services/member-service";
import { getTasksByChapterId } from "@/services/task-service";
import ChapterContent from "../_components/chapter-content";

interface ChapterPageProps {
  mangaId: string;
  chapterId: string;
}

const ChapterClient = ({ mangaId, chapterId }: ChapterPageProps) => {
  const [manga, setManga] = useState<any>();
  const [chapter, setChapter] = useState<any>();
  const [chapterWorks, setChapterWorks] = useState<any>();
  const [roles, setRoles] = useState<any>();
  const [members, setMembers] = useState<any>();
  const [tasks, setTasks] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const [
        mangaData,
        chaptersData,
        chapterWorkData,
        rolesData,
        membersData,
        tasksData,
      ] = await Promise.all([
        getMangaById(mangaId),
        getChaptersByMangaId(mangaId),
        getChapterWorksByMangaId(mangaId),
        getRoles(),
        getMembers(),
        getTasksByChapterId(chapterId),
      ]);

      const currentChapter = chaptersData.find((c: any) => c.$id === chapterId);

      setManga(mangaData);
      setChapter(currentChapter);
      setChapterWorks(chapterWorkData);
      setRoles(rolesData);
      setMembers(membersData);
      setTasks(tasksData);

      setLoading(false);
    };

    fetchData();
  }, [mangaId, chapterId]);

  if (loading || !chapter || !manga) {
    return <div>Loading...</div>;
  }

  return (
    <ChapterContent
      chapter={chapter}
      manga={manga}
      chapterWorks={chapterWorks}
      members={members}
      roles={roles}
      tasks={tasks}
    />
  );
};

export default ChapterClient;

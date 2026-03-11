"use client";

import MangaCard from "@/components/manga-card";
import HeaderManga from "./_components/header-manga";
import { getMangas } from "@/services/manga-service";
import { useEffect, useState } from "react";

const MangaPage = () => {
  const [mangas, setMangas] = useState<any[]>([]);
  useEffect(() => {
    fetchMangas();
  }, []);

  const fetchMangas = async () => {
    const data = await getMangas();
    console.log("Fetched mangas:", data);
    setMangas(data);
  };

  return (
    <div>
      <HeaderManga />
      <div className="py-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mangas.map((manga) => (
          <MangaCard
            key={manga.$id}
            manga={{
              $id: manga.$id,
              title: manga.title || "",
              cover: manga.cover || "",
              totalChapters: manga.totalChapters || 0,
            }}
            completedChapters={manga.completedChapter || 0}
          />
        ))}
      </div>
    </div>
  );
};

export default MangaPage;

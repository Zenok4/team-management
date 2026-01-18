import MangaCard from "@/components/manga-card";
import HeaderManga from "./_components/header-manga";

const MangaPage = () => {
  return (
    <div>
        <HeaderManga/>
        <div className="py-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <MangaCard 
            manga={{
              id: "1",
              title: "Example Manga",
              cover: "",
              totalChapters: 99,
            }} 
            completedChapters={31}
          />
          <MangaCard 
            manga={{
              id: "1",
              title: "Example Manga",
              cover: "/example-cover.jpg",
              totalChapters: 100,
            }} 
            completedChapters={45}
          />
          <MangaCard 
            manga={{
              id: "1",
              title: "Example Manga",
              cover: "/example-cover.jpg",
              totalChapters: 100,
            }} 
            completedChapters={45}
          />
          <MangaCard 
            manga={{
              id: "1",
              title: "Example Manga",
              cover: "/example-cover.jpg",
              totalChapters: 100,
            }} 
            completedChapters={45}
          />
        </div>
    </div>
  );
};

export default MangaPage;

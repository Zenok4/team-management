"use client";

import HeaderPage from "@/components/header-page";
import CreateMangaForm from "./create-manga-form";

interface HeaderMangaProps {
  onMangaCreated?: () => void;
}
const HeaderManga = ({ onMangaCreated }: HeaderMangaProps) => {
  return (
    <HeaderPage title="Manga" subtitle="Explore our manga collection">
      <CreateMangaForm onSuccess={onMangaCreated} />
    </HeaderPage>
  );
};

export default HeaderManga;

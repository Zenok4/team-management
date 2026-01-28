"use client";

import HeaderPage from "@/components/header-page";
import CreateMangaForm from "./create-manga-form";

const HeaderManga = () => {
  return (
    <HeaderPage title="Manga" subtitle="Explore our manga collection">
      <CreateMangaForm />
    </HeaderPage>
  );
};

export default HeaderManga;

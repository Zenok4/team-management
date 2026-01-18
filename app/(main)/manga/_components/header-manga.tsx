"use client";

import HeaderPage from "@/components/header-page";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const HeaderManga = () => {
  return (
    <HeaderPage title="Manga" subtitle="Explore our manga collection">
      <Button className="flex items-center gap-2">
        <Plus className="w-5 h-5" /> <p>Thêm truyện</p>
      </Button>
    </HeaderPage>
  );
};

export default HeaderManga;

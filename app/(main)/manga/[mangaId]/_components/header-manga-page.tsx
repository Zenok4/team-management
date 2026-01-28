import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import CreateChapterDialog from "./create-chapter-dialog";
import { Chapter } from "@/types/manga";

interface HeaderMangaPageProps {
  coverUrl?: string;
  title?: string;
  description?: string;
  totalChapters?: number;
  completedChapters?: number;
  mangaId?: string;
  mangaTitle?: string;
  chapter?: Chapter[];
}

const HeaderMangaPage = ({
  coverUrl,
  title,
  description,
  totalChapters,
  completedChapters,
  mangaId,
  mangaTitle,
  chapter,
}: HeaderMangaPageProps) => {
  return (
    <div className="flex justify-between gap-10">
      <div className="flex gap-4 min-w-0">
        <div className="relative h-60 w-42 rounded-md shrink-0">
          <Image src={coverUrl || "/heroine.jpeg"} alt={title || ""} fill className="rounded-md object-cover"/>
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <p className="text-3xl font-bold text-wrap">{title}</p>
          <p>{description}</p>
          <div className="flex gap-2">
            <Badge>{totalChapters} chương</Badge>
            <Badge variant={"secondary"}>
              {completedChapters} chương hoàn thành
            </Badge>
          </div>
        </div>
      </div>
      <CreateChapterDialog mangaId={mangaId} mangaTitle={mangaTitle} chapter={chapter}/>
    </div>
  );
};

export default HeaderMangaPage;

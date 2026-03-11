"use client";

import { Manga } from "@/types/manga";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Progress } from "./ui/progress";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface MangaCardProps {
  manga: Manga;
  completedChapters: number;
}

const MangaCard = ({ manga, completedChapters }: MangaCardProps) => {
  const router = useRouter();
  const progress =
    (manga &&
      manga.totalChapters &&
      (manga.totalChapters > 0
        ? (completedChapters / manga.totalChapters) * 100
        : 0)) ||
    0;
  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 hover:scale-[1.02]"
      onClick={() => router.push(`/manga/${manga.$id}`)}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-7/10 w-full overflow-hidden">
          <div className="relative h-full w-full object-cover transition-transform group-hover:scale-105">
            <Image
              src={manga.cover || "/globe.svg"}
              alt={manga.title || "Manga Cover"}
              fill
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 group-hover:from-black/80 to-transparent p-4 transition-colors duration-400">
            <h3 className="font-semibold text-white line-clamp-2">
              {manga.title}
            </h3>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {completedChapters}/{manga.totalChapters} chap
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="mt-2 text-xs text-muted-foreground">
          {Math.round(progress)}% hoàn thành
        </p>
      </CardContent>
    </Card>
  );
};

export default MangaCard;

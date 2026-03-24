import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chapter } from "@/types/manga";

interface OverrallMangaProps {
  chapters: Chapter[];
}

const OverrallManga = ({ chapters }: OverrallMangaProps) => {
  const completed = chapters.filter((c) => c.status === "completed").length;
  const inProgress = chapters.filter((c) => c.status === "in-progress").length;
  const pending = chapters.filter((c) => c.status === "pending").length;
  const total = chapters.length;

  const completedPercent = total > 0 ? (completed / total) * 100 : 0;
  const inProgressPercent = total > 0 ? (inProgress / total) * 100 : 0;
  const pendingPercent = total > 0 ? (pending / total) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tiến độ tổng quan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex h-4 overflow-hidden rounded-full bg-muted">
          <div className="bg-green-500 transition-all duration-500" style={{ width: `${completedPercent}%` }} />
          <div className="bg-amber-500 transition-all duration-500" style={{ width: `${inProgressPercent}%` }} />
          <div className="bg-gray-300 transition-all duration-500" style={{ width: `${pendingPercent}%` }} />
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">{completed}</p>
            <p className="text-xs text-muted-foreground">Hoàn thành</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-600">{inProgress}</p>
            <p className="text-xs text-muted-foreground">Đang làm</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-500">{pending}</p>
            <p className="text-xs text-muted-foreground">Chưa làm</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverrallManga;

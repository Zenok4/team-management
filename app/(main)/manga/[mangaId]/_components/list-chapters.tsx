import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChapterWork, Member, Role } from "@/types/manga";
import { CheckCircle } from "lucide-react";
import AssignTaskDialog from "./assign-task-dialog";
import { STATUS_CONFIG } from "@/types/status-config";
import { useRouter } from "next/navigation";

interface ListChaptersProps {
  roles?: Role[];
  chapterWork?: ChapterWork[];
  members?: Member[];
  mangaId?: string;
  mangaTitle?: string;
}

const ListChapters = ({
  roles,
  chapterWork,
  members,
  mangaId,
  mangaTitle,
}: ListChaptersProps) => {
  const router = useRouter();

  /**
   * 🔑 GROUP ChapterWork theo chapter.id
   * 1 chapter => nhiều work (nhiều role / nhiều member)
   */
  const chapterMap = new Map<string, ChapterWork[]>();

  chapterWork?.forEach((work) => {
    const chapterId = work.chapters?.id;
    if (!chapterId) return;

    if (!chapterMap.has(chapterId)) {
      chapterMap.set(chapterId, []);
    }

    chapterMap.get(chapterId)!.push(work);
  });

  const groupedChapters = Array.from(chapterMap.entries());

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xl font-bold">Danh sách chương</p>

      <div className="border rounded-md">
        <Table className="table-fixed w-full">
          {/* ================= HEADER ================= */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/12">Chương</TableHead>
              <TableHead className="w-1/5">Tiêu đề</TableHead>
              <TableHead>Trạng thái</TableHead>

              {roles?.map((role) => (
                <TableHead key={role.id} className="w-1/12 text-center">
                  <Badge
                    style={
                      { "--role-color": role.color } as React.CSSProperties
                    }
                    className="bg-(--role-color)"
                  >
                    {role.label}
                  </Badge>
                </TableHead>
              ))}

              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>

          {/* ================= BODY ================= */}
          <TableBody>
            {groupedChapters.map(([chapterId, works]) => {
              const chapter = works[0]; // đại diện chapter

              return (
                <TableRow
                  key={chapterId}
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/manga/${mangaId}/chapter/${chapter.chapters?.id}`,
                    )
                  }
                >
                  {/* ===== NUMBER ===== */}
                  <TableCell>{chapter.chapters?.number}</TableCell>

                  {/* ===== TITLE ===== */}
                  <TableCell className="truncate">
                    {chapter.chapters?.title}
                  </TableCell>

                  {/* ===== STATUS ===== */}
                  <TableCell>
                    {(() => {
                      const status = chapter.status ?? "Chưa làm";
                      const config = STATUS_CONFIG[status];
                      if (!config) return null;

                      const Icon = config.icon;

                      return (
                        <Badge
                          variant="outline"
                          className={`inline-flex items-center gap-1 ${config.className}`}
                        >
                          <Icon className="h-3 w-3" />
                          {config.label}
                        </Badge>
                      );
                    })()}
                  </TableCell>

                  {/* ===== ROLES ===== */}
                  {roles?.map((role) => {
                    const work = works.find((w) =>
                      w.members?.roles?.some((r) => r.id === role.id),
                    );

                    return (
                      <TableCell key={role.id}>
                        {work && (
                          <div className="flex justify-center">
                            <div className="relative">
                              <Avatar className="h-8 w-8 border-2 border-background">
                                <AvatarImage
                                  src={
                                    work.members?.avatar || "/heroine.jpeg"
                                  }
                                />
                                <AvatarFallback>
                                  {work.members?.name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>

                              <div
                                className={`absolute -bottom-0.5 -right-0.5 rounded-full p-0.5 ${
                                  work.status === "Hoàn thành"
                                    ? "bg-green-500"
                                    : work.status === "Đang làm"
                                      ? "bg-amber-500"
                                      : "bg-gray-400"
                                }`}
                              >
                                <CheckCircle className="h-2.5 w-2.5 text-white" />
                              </div>
                            </div>
                          </div>
                        )}
                      </TableCell>
                    );
                  })}

                  {/* ===== ACTION ===== */}
                  <TableCell
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <AssignTaskDialog
                      chapter={chapter}
                      mangaId={mangaId}
                      roles={roles}
                      members={members}
                      mangaTitle={mangaTitle}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ListChapters;

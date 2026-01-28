"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Calendar,
  User,
} from "lucide-react";

import type {
  Chapter,
  ChapterWork,
  Manga,
  Member,
  Role,
  Task,
} from "@/types/manga";
import { STATUS_CONFIG, TASK_STATUS_CONFIG } from "@/types/status-config";
import { useRouter } from "next/navigation";

interface Props {
  manga: Manga;
  chapter: Chapter;
  chapterWorks: ChapterWork[];
  members: Member[];
  roles: Role[];
  tasks: Task[];
}

export default function ChapterClient({
  manga,
  chapter,
  chapterWorks,
  members,
  roles,
  tasks,
}: Props) {
  const chapterTasks = tasks.filter((t) => t.chapter.id === chapter.id);
  const router = useRouter();

  const worksOfChapter = chapterWorks.filter(
    (w) => w.chapters?.id === chapter.id,
  );

  const completedWorks = worksOfChapter.filter(
    (w) => w.status === "Hoàn thành",
  ).length;

  const totalWorks = roles.length;
  const progressPercent =
    totalWorks > 0 ? Math.round((completedWorks / totalWorks) * 100) : 0;

  const statusConfig = chapter.status
    ? STATUS_CONFIG[chapter.status]
    : STATUS_CONFIG["Chưa làm"];

  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-background">
      <div className="my-8">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại {manga.title}
        </Button>
      </div>

      <main className="">
        {/* Header */}
        <div className="mb-8 flex justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">Chapter {chapter.number}</h1>
              <Badge variant="outline" className={statusConfig.className}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {statusConfig.label}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {chapter.title && (
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>{chapter.title}</span>
                </div>
              )}

              {chapter.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Tạo: {chapter.createdAt}</span>
                </div>
              )}

              {chapter.completedAt && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Hoàn thành: {chapter.completedAt}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tiến độ tổng quan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm mb-2">
              <span>Hoàn thành</span>
              <span>
                {completedWorks}/{totalWorks} ({progressPercent}%)
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Work by Role */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết công việc theo vai trò</CardTitle>
                <CardDescription>Trạng thái từng công đoạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {roles.map((role) => {
                  const work = worksOfChapter.find((w) =>
                    w.members?.roles?.some((r) => r.id === role.id),
                  );

                  const member = work?.members;

                  return (
                    <div
                      key={role.id}
                      className="flex justify-between p-4 border rounded-lg"
                    >
                      <div className="flex gap-4">
                        <Badge style={{ backgroundColor: role.color }}>
                          {role.label}
                        </Badge>

                        {member ? (
                          <div className="flex gap-3">
                            <Avatar>
                              <AvatarImage src={member.avatar || ""} />
                              <AvatarFallback>
                                {member.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-3 text-muted-foreground">
                            <User />
                            <span>Chưa phân công</span>
                          </div>
                        )}
                      </div>

                      <Badge variant="outline">
                        {work?.status ?? "Chưa có"}
                      </Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Tasks */}
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Công việc được giao</CardTitle>
                <CardDescription>
                  {chapterTasks.length} công việc
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {chapterTasks.map((task) => {
                  const member = members.find((m) => m.id === String(task.assignedTo));
                  const cfg = TASK_STATUS_CONFIG[task.status];
                  const Icon = cfg.icon;

                  return (
                    <div key={task.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between mb-2">
                        <Badge>{task.role}</Badge>
                        <Badge className={cfg.className}>
                          <Icon className="mr-1 h-3 w-3" />
                          {cfg.label}
                        </Badge>
                      </div>

                      <div className="flex gap-2 items-center mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>
                            {member?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{member?.name}</span>
                      </div>

                      {task.note && (
                        <p className="text-xs text-muted-foreground">
                          {task.note}
                        </p>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin bộ truyện</CardTitle>
                <CardDescription>Chi tiết tổng quan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tên truyện</span>
                  <Link
                    href={`/manga/${manga.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {manga.title}
                  </Link>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tổng chapter</span>
                  <span className="font-medium">{manga.totalChapters}</span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Chapter hiện tại
                  </span>
                  <span className="font-medium">{chapter.number}</span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Số người tham gia
                  </span>
                  <span className="font-medium">{}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

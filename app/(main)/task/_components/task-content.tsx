"use client";

import { useState, useMemo, use } from "react";
import { Search, Filter } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TaskCard } from "@/components/task-card";

import { Task, Member, Manga, Role } from "@/types/manga";
import { useAuth } from "@/context/AuthContext";

interface TasksContentProps {
  initialTasks: Task[];
  members: Member[];
  mangas: Manga[];
  roles: Role[];
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

export function TasksContent({
  initialTasks,
  members,
  mangas,
  roles,
}: TasksContentProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filterMember, setFilterMember] = useState("all");
  const [filterManga, setFilterManga] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useAuth();

  useMemo(() => {
    if (!initialTasks || !mangas || !members || !roles) return;
  }, []);

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((t) => (t.$id === taskId ? { ...t, status: newStatus } : t)),
    );
  };

  /** Map nhanh role label -> role object */
  const roleMap = useMemo(() => {
    return Object.fromEntries(roles.map((r) => [r.label, r])) as Record<
      string,
      Role
    >;
  }, [roles]);

  const filteredTasks = tasks.filter((task) => {
    if (filterMember !== "all" && task.assignedTo.$id !== filterMember)
      return false;

    if (filterManga !== "all" && task.manga.$id !== filterManga) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        task.manga.title?.toLowerCase().includes(q) ||
        task.chapters.title?.toLowerCase().includes(q) ||
        task.role.label?.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const pendingTasks = filteredTasks.filter((t) => t.status === "pending");
  const inProgressTasks = filteredTasks.filter(
    (t) => t.status === "in-progress",
  );
  const submittedTasks = filteredTasks.filter((t) => t.status === "submitted");
  const completedTasks = filteredTasks.filter((t) =>
    ["approved", "rejected"].includes(t.status),
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-50 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Member filter */}
        <Select value={filterMember} onValueChange={setFilterMember}>
          <SelectTrigger className="w-45">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Thành viên" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả thành viên</SelectItem>
            {members.map((m) => (
              <SelectItem key={m.$id} value={m.$id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Manga filter */}
        <Select value={filterManga} onValueChange={setFilterManga}>
          <SelectTrigger className="w-45">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Bộ truyện" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả bộ truyện</SelectItem>
            {mangas.map((m) => (
              <SelectItem key={m.$id} value={m.$id}>
                {m.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Chờ nhận <Badge variant="secondary">{pendingTasks.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            Đang làm <Badge variant="secondary">{inProgressTasks.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="submitted">
            Chờ duyệt <Badge variant="secondary">{submittedTasks.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Đã xử lý <Badge variant="secondary">{completedTasks.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {(
          [
            ["pending", pendingTasks, "Không có công việc nào đang chờ nhận"],
            [
              "in-progress",
              inProgressTasks,
              "Không có công việc nào đang thực hiện",
            ],
            ["submitted", submittedTasks, "Không có công việc nào chờ duyệt"],
            ["completed", completedTasks, "Chưa có công việc nào được xử lý"],
          ] as const
        ).map(([key, list, empty]) => (
          <TabsContent key={key} value={key}>
            {list.length ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {list.map((task) => (
                  <TaskCard
                    key={task.$id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    roles={roles}
                    user={user}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message={empty} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

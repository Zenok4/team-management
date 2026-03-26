"use client";

import { useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, X } from "lucide-react";

import { Member, Role, Task } from "@/types/manga";
import { submitTask } from "@/services/task-service";
import { Input } from "@/components/ui/input";

/* ================= PROPS ================= */
interface SubmitTaskDialogProps {
  task: Task;
  user: Member;
  role: Role;
  onStatusChange?: (taskId: string, status: Task["status"]) => void;
}

/* ================= COMPONENT ================= */
export function SubmitTaskDialog({
  task,
  user,
  role,
  onStatusChange,
}: SubmitTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  /* ===== handlers ===== */
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileAdd = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    await submitTask(task.$id, files, note);
    setNote("");
    setFiles([]);
    onStatusChange?.(task.$id, "submitted");
    setOpen(false);
  };

  /* ================= RENDER ================= */
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="gap-1.5"
          disabled={task.assignedTo.userId !== user.$id}
        >
          <Upload className="h-4 w-4" />
          Nộp bài
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nộp Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* ===== Task info ===== */}
          <div className="rounded-lg bg-muted/50 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{task.manga.title}</p>

              {role && (
                <Badge
                  style={
                    {
                      "--role-color": role.color,
                    } as React.CSSProperties
                  }
                  className="bg-(--role-color) text-white text-xs"
                >
                  {role.label}
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              Chapter {task.chapters.number}: {task.chapters.title}
            </p>

            {task.deadline && (
              <p className="text-xs text-muted-foreground">
                Hạn nộp: {new Date(task.deadline).toLocaleDateString("vi-VN")}
              </p>
            )}
          </div>

          {/* ===== Note from assigner ===== */}
          {task.note && (
            <div className="space-y-1">
              <Label className="text-muted-foreground">
                Yêu cầu từ người giao:
              </Label>
              <p className="text-sm bg-muted/30 rounded p-2 italic">
                {task.note}
              </p>
            </div>
          )}

          {/* ===== Upload files ===== */}
          <div className="space-y-2">
            <Label>File đính kèm</Label>

            <div className="space-y-2 max-w-24 overflow-y-scroll">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border bg-background p-2"
                >
                  <div className="flex items-center gap-2 max-w-xs">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm truncate">{file.name}</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shirnk-0"
                    onClick={() => handleFileRemove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <>
                <Input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />

                <Button
                  variant="outline"
                  className="w-full gap-2 bg-transparent"
                  onClick={handleFileAdd}
                >
                  <Upload className="h-4 w-4" />
                  Thêm file
                </Button>
              </>
            </div>
          </div>

          {/* ===== Submit note ===== */}
          <div className="space-y-2">
            <Label>Ghi chú khi nộp</Label>
            <Textarea
              placeholder="Ghi chú về bài nộp, những chỗ cần lưu ý..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>Nộp bài</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

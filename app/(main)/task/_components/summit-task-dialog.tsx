"use client"

import { useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, X } from "lucide-react"

import { Task } from "@/types/manga"
import { MOCK_ROLES } from "@/mock/mock-data"

/* ================= PROPS ================= */
interface SubmitTaskDialogProps {
  task: Task
  onSubmit?: (data: { note: string; files: File[] }) => void
}

/* ================= COMPONENT ================= */
export function SubmitTaskDialog({
  task,
  onSubmit,
}: SubmitTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState("")
  const [files, setFiles] = useState<File[]>([])

  /* ===== resolve role from mock ===== */
  const role = useMemo(
    () => MOCK_ROLES.find((r) => r.label === task.role),
    [task.role]
  )

  /* ===== handlers ===== */
  const handleFileAdd = () => {
    // mock file (sau này thay bằng input[type=file])
    const file = new File(
      ["mock content"],
      `file_${Date.now()}.txt`,
      { type: "text/plain" }
    )
    setFiles((prev) => [...prev, file])
  }

  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    onSubmit?.({ note, files })
    setNote("")
    setFiles([])
    setOpen(false)
  }

  /* ================= RENDER ================= */
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Upload className="h-4 w-4" />
          Nộp bài
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nộp công việc</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* ===== Task info ===== */}
          <div className="rounded-lg bg-muted/50 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {task.manga.title}
              </p>

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
              Chapter {task.chapter.number}: {task.chapter.title}
            </p>

            {task.deadline && (
              <p className="text-xs text-muted-foreground">
                Hạn nộp:{" "}
                {new Date(task.deadline).toLocaleDateString("vi-VN")}
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

            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border bg-background p-2"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{file.name}</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleFileRemove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full gap-2 bg-transparent"
                onClick={handleFileAdd}
              >
                <Upload className="h-4 w-4" />
                Thêm file
              </Button>
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
  )
}

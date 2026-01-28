"use client"

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  CheckCircle,
  XCircle,
  Play,
} from "lucide-react"

import { Task } from "@/types/manga"
import { TASK_STATUS_LABELS } from "@/types/manga"
import { MOCK_ROLES } from "@/mock/mock-data"
import { SubmitTaskDialog } from "@/app/(main)/task/_components/summit-task-dialog"

/* ================= PROPS ================= */
interface TaskCardProps {
  task: Task
  showAssignee?: boolean
  onStatusChange?: (taskId: string, status: Task["status"]) => void
}

/* ================= STATUS STYLES ================= */
const STATUS_STYLES: Record<Task["status"], string> = {
  pending: "bg-gray-100 text-gray-700 border-gray-200",
  "in-progress": "bg-amber-100 text-amber-700 border-amber-200",
  submitted: "bg-blue-100 text-blue-700 border-blue-200",
  approved: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
}

/* ================= COMPONENT ================= */
export function TaskCard({
  task,
  showAssignee = true,
  onStatusChange,
}: TaskCardProps) {
  const isOverdue =
    task.deadline &&
    new Date(task.deadline) < new Date() &&
    !["approved", "submitted"].includes(task.status)

  /* ===== resolve role ===== */
  const role = useMemo(
    () => MOCK_ROLES.find((r) => r.label === task.role),
    [task.role]
  )

  return (
    <Card
      className={`transition-all hover:shadow-md ${
        isOverdue ? "border-red-300" : ""
      }`}
    >
      <CardContent className="p-4 space-y-3">
        {/* ===== Header ===== */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
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

            <Badge
              variant="outline"
              className={STATUS_STYLES[task.status]}
            >
              {TASK_STATUS_LABELS[task.status]}
            </Badge>

            {isOverdue && (
              <Badge variant="destructive" className="text-xs">
                Quá hạn
              </Badge>
            )}
          </div>

          <h4 className="font-medium truncate">{task.manga.title}</h4>
          <p className="text-sm text-muted-foreground">
            Chapter {task.chapter.number}: {task.chapter.title}
          </p>
        </div>

        {/* ===== Assignee ===== */}
        {showAssignee && task.assignedTo && (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={task.assignedTo.avatar || "/placeholder.svg"}
              />
              <AvatarFallback className="text-xs">
                {task.assignedTo.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{task.assignedTo.name}</span>
          </div>
        )}

        {/* ===== Meta info ===== */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {task.deadline && (
            <div
              className={`flex items-center gap-1 ${
                isOverdue ? "text-red-600" : ""
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>
                Hạn:{" "}
                {new Date(task.deadline).toLocaleDateString("vi-VN")}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>
              Giao:{" "}
              {task.createdAt
                ? new Date(task.createdAt).toLocaleDateString("vi-VN")
                : "N/A"}
            </span>
          </div>

          {task.assignedBy && (
            <div className="flex items-center gap-1">
              <span>Bởi: {task.assignedBy.name}</span>
            </div>
          )}
        </div>

        {/* ===== Note ===== */}
        {task.note && (
          <div className="flex items-start gap-2 text-sm bg-muted/50 rounded-lg p-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-muted-foreground">{task.note}</p>
          </div>
        )}

        {/* ===== Submitted info ===== */}
        {task.status === "submitted" && task.submittedNote && (
          <div className="border-t pt-3 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Ghi chú khi nộp:
            </p>
            <p className="text-sm">{task.submittedNote}</p>

            {task.submittedFiles && task.submittedFiles.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.submittedFiles.map((file, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-xs gap-1"
                  >
                    <FileText className="h-3 w-3" />
                    {file.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== Rejected reason ===== */}
        {task.status === "rejected" && task.reviewNote && (
          <div className="pt-3 bg-red-50 px-4 pb-4 rounded-lg">
            <p className="text-xs font-medium text-red-700">
              Lý do yêu cầu sửa:
            </p>
            <p className="text-sm text-red-600">{task.reviewNote}</p>
          </div>
        )}

        {/* ===== Actions ===== */}
        <div className="flex gap-2 pt-2 border-t">
          {task.status === "pending" && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1 bg-transparent"
              onClick={() =>
                onStatusChange?.(task.id, "in-progress")
              }
            >
              <Play className="h-3.5 w-3.5" />
              Bắt đầu làm
            </Button>
          )}

          {(task.status === "in-progress" ||
            task.status === "rejected") && (
            <SubmitTaskDialog task={task} />
          )}

          {task.status === "submitted" && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="gap-1 text-green-600 hover:text-green-700 bg-transparent"
                onClick={() =>
                  onStatusChange?.(task.id, "approved")
                }
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Duyệt
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="gap-1 text-red-600 hover:text-red-700 bg-transparent"
                onClick={() =>
                  onStatusChange?.(task.id, "rejected")
                }
              >
                <XCircle className="h-3.5 w-3.5" />
                Yêu cầu sửa
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

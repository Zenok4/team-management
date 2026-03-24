import { AlertCircle, CheckCircle2, Circle, Clock, FileText } from "lucide-react";

export const STATUS_CONFIG = {
  "completed": {
    label: "Hoàn thành",
    icon: CheckCircle2,
    className: "bg-green-100 text-green-700 border-green-200",
  },
  "in-progress": {
    label: "Đang làm",
    icon: Clock,
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  "pending": {
    label: "Chưa làm",
    icon: Circle,
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

export const TASK_STATUS_CONFIG = {
  pending: { label: "Chờ nhận", icon: Circle, className: "bg-gray-100 text-gray-600" },
  "in-progress": { label: "Đang làm", icon: Clock, className: "bg-amber-100 text-amber-700" },
  submitted: { label: "Đã nộp", icon: FileText, className: "bg-blue-100 text-blue-700" },
  approved: { label: "Đã duyệt", icon: CheckCircle2, className: "bg-green-100 text-green-700" },
  rejected: { label: "Yêu cầu sửa", icon: AlertCircle, className: "bg-red-100 text-red-700" },
};

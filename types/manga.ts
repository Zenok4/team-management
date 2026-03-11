export interface Role {
  id: string;
  label: string;
  description?: string;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
  detetedAt?: string;
}

export interface Manga {
  $id: string;
  title?: string;
  cover?: string;
  description?: string;
  totalChapters?: number;
  completedChapter?: number;
  createdAt?: string;
  updatedAt?: string;
  detetedAt?: string;
}

export interface Chapter {
  id: string;
  mangaId?: Manga["$id"];
  number?: number;
  title?: string;
  status?: "pending" | "in-process" | "completed";
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  detetedAt?: string;
}

export interface Member {
  id: string;
  name?: string;
  avatar?: string;
  roles?: Role[];
  joinedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  detetedAt?: string;
}

export interface ChapterWork {
  id: string;
  members?: Member;
  chapters?: Chapter;
  roles?: Role;
  status?: "Chưa làm" | "Đang làm" | "Hoàn thành";
  assignedAt?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  detetedAt?: string;
}

export interface Task {
  id: string;
  manga: Manga;
  chapter: Chapter;
  role: Role["label"];
  assignedTo: Member;
  assignedBy: Member;
  status: "pending" | "in-progress" | "submitted" | "approved" | "rejected";
  deadline?: string;
  note?: string;
  submittedAt?: string;
  submittedNote?: string;
  submittedFiles?: File[];
  reviewedAt?: string;
  reviewNote?: string;
  createdAt?: string;
  updatedAt?: string;
  detetedAt?: string;
}

export const TASK_STATUS_LABELS: Record<Task["status"], string> = {
  pending: "Chờ nhận",  
  "in-progress": "Đang làm",
  submitted: "Đã nộp",
  approved: "Đã duyệt",
  rejected: "Yêu cầu sửa",
};

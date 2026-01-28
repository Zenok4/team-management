import {
  Role,
  Manga,
  Chapter,
  Member,
  ChapterWork,
  Task,
} from "@/types/manga";

/* ================= ROLE ================= */

export const MOCK_ROLES: Role[] = [
  { id: "1", label: "Trans", color: "#a83232" },
  { id: "2", label: "Redrawer", color: "#ff00e0" },
  { id: "3", label: "Typesetter", color: "#ffa500" },
  { id: "4", label: "Beta", color: "#00ff55" },
  { id: "5", label: "QC", color: "#8000ff" },
];

/* ================= MANGA ================= */

export const MOCK_MANGA: Manga = {
  id: "manga-1",
  title: "Test Manga",
  description: "This is a test manga description.",
  cover: "",
  totalChapters: 10,
  completedChapter: 4,
};

/* ================= CHAPTER ================= */

export const MOCK_CHAPTER: Chapter[] = [
  {
    id: "1",
    mangaId: "manga-1",
    number: 1,
    title: "Chương 1: Bắt đầu",
    status: "Hoàn thành",
    createdAt: "2024-09-01",
  },
  {
    id: "2",
    mangaId: "manga-1",
    number: 2,
    title: "Chương 2: Tiếp tục",
    status: "Đang làm",
    createdAt: "2024-09-10",
  },
  {
    id: "3",
    mangaId: "manga-1",
    number: 3,
    status: "Chưa làm",
  },
  {
    id: "4",
    mangaId: "manga-1",
    number: 4,
    status: "Hoàn thành",
  },
  {
    id: "5",
    mangaId: "manga-1",
    number: 5.5,
    status: "Hoàn thành",
  },
  {
    id: "6",
    mangaId: "manga-1",
    number: 6,
    status: "Đang làm",
  },
];

/* ================= MEMBER ================= */

export const MOCK_MEMBERS: Member[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    roles: [MOCK_ROLES[0]],
  },
  {
    id: "2",
    name: "Trần Thị B",
    roles: [MOCK_ROLES[2]],
  },
  {
    id: "3",
    name: "Lê Văn C",
    roles: [MOCK_ROLES[1], MOCK_ROLES[3]],
  },
  {
    id: "4",
    name: "Phạm Thị D",
    roles: [MOCK_ROLES[3]],
  },
];

export const ADMIN_MEMBER: Member = {
  id: "admin-1",
  name: "Admin",
};

/* ================= CHAPTER WORK ================= */

export const MOCK_CHAPTER_WORK: ChapterWork[] = [
  {
    id: "cw-1",
    chapters: MOCK_CHAPTER[0],
    members: MOCK_MEMBERS[0],
    roles: MOCK_ROLES[0],
    status: "Hoàn thành",
  },
  {
    id: "cw-2",
    chapters: MOCK_CHAPTER[1],
    members: MOCK_MEMBERS[1],
    roles: MOCK_ROLES[2],
    status: "Đang làm",
  },
  {
    id: "cw-3",
    chapters: MOCK_CHAPTER[0],
    members: MOCK_MEMBERS[2],
    roles: MOCK_ROLES[3],
    status: "Hoàn thành",
  },
];

/* ================= TASK ================= */

export const MOCK_TASKS: Task[] = [
  {
    id: "task-1",
    manga: MOCK_MANGA,
    chapter: MOCK_CHAPTER[0],
    role: "Trans",
    assignedTo: MOCK_MEMBERS[0],
    assignedBy: ADMIN_MEMBER,
    status: "approved",
    deadline: "2024-10-01",
    note: "Dịch sát nghĩa, giữ nguyên tên riêng",
    submittedAt: "2024-09-28",
    submittedNote: "Đã hoàn thành bản dịch",
    reviewedAt: "2024-09-29",
    reviewNote: "OK, không cần sửa",
    createdAt: "2024-09-20",
  },
  {
    id: "task-2",
    manga: MOCK_MANGA,
    chapter: MOCK_CHAPTER[0],
    role: "Redrawer",
    assignedTo: MOCK_MEMBERS[2],
    assignedBy: ADMIN_MEMBER,
    status: "in-progress",
    deadline: "2024-10-03",
    note: "Chú ý background trang 5–7",
    createdAt: "2024-09-21",
  },
  {
    id: "task-3",
    manga: MOCK_MANGA,
    chapter: MOCK_CHAPTER[1],
    role: "Typesetter",
    assignedTo: MOCK_MEMBERS[1],
    assignedBy: ADMIN_MEMBER,
    status: "submitted",
    submittedAt: "2024-10-01",
    submittedNote: "Đã typeset đầy đủ, font như yêu cầu",
    createdAt: "2024-09-23",
  },
  {
    id: "task-4",
    manga: MOCK_MANGA,
    chapter: MOCK_CHAPTER[1],
    role: "QC",
    assignedTo: MOCK_MEMBERS[0],
    assignedBy: ADMIN_MEMBER,
    status: "rejected",
    reviewNote: "Còn lỗi chính tả trang 12",
    createdAt: "2024-09-24",
  },
];

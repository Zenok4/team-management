import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Chapter } from "@/types/manga";
import { useEffect, useState } from "react";
import { createChapter } from "@/services/chapter-service";

interface CreateChapterDialogProps {
  mangaId?: string;
  mangaTitle?: string;
  chapter?: Chapter[];
}

const CreateChapterDialog = ({
  mangaId,
  mangaTitle,
  chapter,
}: CreateChapterDialogProps) => {
  const [open, setOpen] = useState(false);
  const [chapterNumber, setChapterNumber] = useState(0);
  const [chapterTitle, setChapterTitle] = useState("");

  useEffect(() => {
    // Tự động gợi ý số chương mới dựa trên số chương hiện có
    setChapterNumber(findNextChapterNumber());
    console.log("chapter", chapter);
    console.log("next chapter number", findNextChapterNumber());
  }, [chapter]);

  const resetForm = () => {
    setChapterNumber(findNextChapterNumber());
    setChapterTitle("");
  };

  const handleSubmit = async () => {
    // Xử lý logic tạo chapter mới ở đây
    if (!mangaId) return;
    await createChapter({
      mangaId: mangaId,
      number: chapterNumber,
      title: chapterTitle,
    });
    setOpen(false);
  };

  const findNextChapterNumber = () => {
    if (chapter && chapter.length > 0) {
      const maxNumber = Math.max(...chapter.map((ch) => ch.number || 0));
      console.log("maxNumber", maxNumber);
      return maxNumber + 1;
    }
    return 0;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Thêm chapter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm chương mới</DialogTitle>
          <DialogDescription>
            Thêm chương mới cho bộ truyện "{mangaTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Chapter Number */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="chapterNumber" className="text-right">
              Chương
            </Label>
            <Input
              id="chapterNumber"
              type="number"
              min={0}
              value={chapterNumber}
              onChange={(e) => setChapterNumber(parseInt(e.target.value) || 1)}
              className="col-span-3"
            />
          </div>

          {/* Chapter Title */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="chapterTitle" className="text-right">
              Tiêu đề
            </Label>
            <Input
              id="chapterTitle"
              placeholder="Nhập tiêu đề chapter (không bắt buộc)"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>Thêm chapter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChapterDialog;

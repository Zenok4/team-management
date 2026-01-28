"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CircleX, ImagePlus, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const CreateMangaForm = () => {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cover: "",
  });

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      cover: "",
    });
    setCoverPreview(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Thay bằng dialog thông báo
    console.log("Tạo truyện thành công!");
    resetForm();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" className="flex items-center gap-2">
          <Plus className="w-5 h-5" /> <p>Thêm truyện</p>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Thêm truyện mới</DialogTitle>
          </DialogHeader>
          <div className="flex gap-4 items-stretch">
            <div className="grid gap-2">
              <Label htmlFor="cover">Ảnh bìa</Label>
              {coverPreview ? (
                <div className="relative h-48 w-36 object-cover">
                  <Image
                    src={coverPreview}
                    alt="Cover preview"
                    className="rounded-lg"
                    fill
                  />
                  <Button
                    type="button"
                    onClick={() => setCoverPreview(null)}
                    size={"icon-sm"}
                    className="absolute -right-2 -top-2 rounded-full bg-destructive hover:bg-destructive/80"
                  >
                    <CircleX />
                  </Button>
                </div>
              ) : (
                <Label
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="flex h-48 w-36 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors"
                >
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  <span className="mt-1 text-xs text-muted-foreground">
                    Tải ảnh
                  </span>
                  <Input
                    id="cover"
                    name="cover"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverChange}
                  />
                </Label>
              )}
            </div>

            {/* Title and Description */}
            <div className="flex flex-col gap-2 flex-1 h-full">
              <div className="grid gap-2">
                <Label htmlFor="title">Tên truyện *</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Tên truyện..."
                  className="flex-1"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <Label htmlFor="description">Tóm tắt</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Tóm tắt bộ truyện..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="h-full"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={resetForm}>Hủy</Button>
            </DialogClose>
            <Button
              variant="secondary"
              type="submit"
              disabled={!formData.title}
            >
              Tạo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMangaForm;

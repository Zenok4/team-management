import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChapterWork, Member, Role } from "@/types/manga";
import { CalendarIcon, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface AssignTaskDialogProps {
  mangaId?: string;
  mangaTitle?: string;
  chapter?: ChapterWork;
  roles?: Role[];
  members?: Member[];
}

const AssignTaskDialog = ({
  chapter,
  mangaId,
  mangaTitle,
  roles,
  members,
}: AssignTaskDialogProps) => {
  const [open, setOpen] = useState(false);
  const [openCal, setOpenCal] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [deadline, setDeadline] = useState<Date>();
  const [note, setNote] = useState("");

  // Lọc các role chưa được giao trong chapter này
  const assignedRoles = chapter?.members?.roles;
  const assignedRoleIds = new Set(assignedRoles?.map((role) => role.id));
  //role khả dụng
  const availableRoles = roles?.filter((role) => {
    // role đã được gán trong chapter → loại
    if (assignedRoleIds.has(role.id)) return false;

    // nếu đã chọn member → member phải có role này
    if (selectedMember) {
      const member = members?.find((m) => m.id === selectedMember);
      return member?.roles?.some((r) => r.id === role.id);
    }

    return true;
  });

  //lọc ra các member có thể chọn (có role phù hợp)
  const availableMembers = members?.filter((member) => {
    if (!member.roles || member.roles.length === 0) return false;

    const memberAvailableRoles = member.roles.filter(
      (r) => !assignedRoleIds.has(r.id),
    );

    if (memberAvailableRoles.length === 0) return false;

    // nếu đã chọn role → member phải có role đó
    if (selectedRole) {
      return memberAvailableRoles.some((r) => r.id === selectedRole);
    }

    return true;
  });

  useEffect(() => {
    if (!selectedMember || !selectedRole) return;

    const member = members?.find((m) => m.id === selectedMember);
    const isValid = member?.roles?.some(
      (r) => r.id === selectedRole && !assignedRoleIds.has(r.id),
    );

    if (!isValid) {
      setSelectedRole("");
    }
  }, [selectedMember]);

  const handleSubmit = () => {
    if (!selectedMember || !selectedRole) return;

    // Reset form
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setSelectedMember("");
    setSelectedRole("");
    setDeadline(undefined);
    setNote("");
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5 bg-transparent">
          <UserPlus className="h-4 w-4" />
          Giao việc
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Giao công việc</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Info */}
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-sm font-medium">{mangaTitle}</p>
            <p className="text-sm text-muted-foreground">
              Chương {chapter?.chapters?.number}: {chapter?.chapters?.title}
            </p>
          </div>

          {/* Chọn vai trò */}
          <div className="space-y-2">
            <Label>Vai trò</Label>
            <Select
              value={selectedRole}
              onValueChange={(v) => setSelectedRole(v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò..." />
              </SelectTrigger>
              <SelectContent>
                {availableRoles && availableRoles.length > 0 ? (
                  availableRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      <div className="flex items-center gap-2">
                        <Badge
                          style={
                            {
                              "--role-color": role.color,
                            } as React.CSSProperties
                          }
                          className={`bg-(--role-color) text-white text-xs`}
                        >
                          {role.label}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    Tất cả vai trò đã được giao
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Chọn thành viên */}
          <div className="space-y-2">
            <Label>Thành viên</Label>
            <Select value={selectedMember} onValueChange={setSelectedMember}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn người thực hiện..." />
              </SelectTrigger>
              <SelectContent>
                {availableMembers &&
                  availableMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={member.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback className="text-xs">
                            {member && (member?.name ?? "").charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{member.name}</span>
                        <div className="flex gap-1">
                          {member.roles?.length &&
                            member?.roles.map((r) => (
                              <Badge
                                key={r.id}
                                variant="outline"
                                className="text-xs py-0"
                              >
                                {r.label}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label>Hạn nộp</Label>
            <Popover open={openCal} onOpenChange={setOpenCal}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "dd/MM/yyyy") : "Chọn ngày"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={(deadline) => {
                    setDeadline(deadline);
                    setOpenCal(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Ghi chú */}
          <div className="space-y-2">
            <Label>Ghi chú</Label>
            <Textarea
              placeholder="Hướng dẫn, yêu cầu đặc biệt..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              resetForm();
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedMember || !selectedRole}
          >
            Giao việc
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTaskDialog;

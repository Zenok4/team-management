import { BookType } from "lucide-react";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();
  return (
    <div
      className="flex flex-row items-center cursor-pointer"
      onClick={() => router.push("/")}
    >
      <BookType className="w-8 h-8" />
      <p className="font-bold text-2xl group-data-[collapsible=icon]:hidden">
        Web Name
      </p>
    </div>
  );
};

export default Logo;

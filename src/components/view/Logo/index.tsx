import { cn } from "@/lib/utils";
import Link from "next/link";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link
      className={cn("text-xl font-display font-bold text-fern", className)}
      href="/"
    >
      Mama Fern
    </Link>
  );
};

export default Logo;

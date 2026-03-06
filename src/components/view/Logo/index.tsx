import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" className="block">
      <Image
        src="/mamafern_logo.png"
        alt="Mama Fern"
        width={800}
        height={330}
        sizes="(max-width: 768px) 200px, 300px"
        className={cn("w-auto max-w-full", className)}
        priority
      />
    </Link>
  );
};

export default Logo;

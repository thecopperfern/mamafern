import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" className="block">
      <Image
        src="/mamafern_logo_transparent.png"
        alt="Mama Fern"
        width={19333}
        height={7150}
        sizes="200px"
        className={cn("w-auto max-w-full", className)}
        priority
      />
    </Link>
  );
};

export default Logo;

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link className={cn("block", className)} href="/">
      <Image
        src="/mamafern_logo.png"
        alt="Mama Fern"
        width={5504}
        height={3072}
        style={{ height: "52px", width: "auto" }}
        priority
      />
    </Link>
  );
};

export default Logo;

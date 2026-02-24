import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link className={cn("block", className)} href="/">
      <Image
        src="/mamafern_logo_transparent.png"
        alt="Mama Fern"
        width={19333}
        height={7150}
        style={{ height: "104px", width: "auto" }}
        priority
      />
    </Link>
  );
};

export default Logo;

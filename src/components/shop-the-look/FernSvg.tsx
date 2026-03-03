type FernSvgProps = {
  className?: string;
};

export default function FernSvg({ className }: FernSvgProps) {
  return (
    <svg
      viewBox="0 0 120 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M60 155 C60 155 60 80 60 10 C50 30 25 45 15 50 C25 45 50 50 60 55 C50 60 20 65 10 75 C25 65 50 65 60 70 C48 78 22 85 12 98 C28 88 52 82 60 85 C50 92 28 100 18 115 C32 105 54 98 60 100 C55 108 40 125 35 140 C45 128 56 115 60 110"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M60 155 C60 155 60 80 60 10 C70 30 95 45 105 50 C95 45 70 50 60 55 C70 60 100 65 110 75 C95 65 70 65 60 70 C72 78 98 85 108 98 C92 88 68 82 60 85 C70 92 92 100 102 115 C88 105 66 98 60 100 C65 108 80 125 85 140 C75 128 64 115 60 110"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

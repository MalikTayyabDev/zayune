import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  size?: number;
  animated?: boolean;
};

export function CopperStar({ className, size = 14, animated = false }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn("text-copper", animated && "star-pulse", className)}
    >
      <path
        d="M8 0 L9.2 5.2 L14.5 5.2 L10.2 8.4 L11.5 13.5 L8 10.4 L4.5 13.5 L5.8 8.4 L1.5 5.2 L6.8 5.2 Z"
        fill="currentColor"
      />
    </svg>
  );
}

import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({
  src,
  alt,
  fallback,
  size = "md",
  className,
}: AvatarProps) {
  const sizes = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
    xl: "w-12 h-12 text-lg",
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || "Avatar"}
        className={cn("rounded-full object-cover", sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "bg-accent-blue rounded-full flex items-center justify-center text-white font-medium",
        sizes[size],
        className
      )}
    >
      {fallback?.[0]?.toUpperCase() || "U"}
    </div>
  );
}



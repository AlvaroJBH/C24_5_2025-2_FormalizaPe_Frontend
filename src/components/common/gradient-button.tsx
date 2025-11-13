import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
}

export function GradientButton({ children, className, ...props }: GradientButtonProps) {
  return (
    <Button
      {...props}
      className={cn(
        "bg-linear-to-r from-blue-700 to-blue-500 text-white font-semibold shadow-md hover:opacity-90 transition",
        className
      )}
    >
      {children}
    </Button>
  );
}

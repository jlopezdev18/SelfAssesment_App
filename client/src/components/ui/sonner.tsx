import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          "--normal-bg": "hsl(var(--popover))",
          "--normal-text": "hsl(var(--popover-foreground))",
          "--normal-border": "hsl(var(--border))",
          "--width": "420px",
          "--height": "80px",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          padding: "16px 20px",
          fontSize: "15px",
          lineHeight: "1.4",
          minHeight: "80px",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

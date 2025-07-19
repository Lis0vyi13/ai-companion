import { cn } from "@/lib/utils";

type MessageProps = {
  role: "user" | "system" | "assistant";
  content: string;
};

export default function Message({ role, content }: MessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "text-sm px-4 py-2 rounded-xl max-w-[65%] w-fit break-words",
        isUser
          ? "bg-secondary text-primary self-end ml-auto"
          : "bg-primary text-secondary self-start mr-auto",
      )}
    >
      {content}
    </div>
  );
}

import Avatar from "@/components/Avatar";
import Chat from "@/components/Chat";

export default function Home() {
  return (
    <main className="relative min-h-screen h-dvh overflow-hidden">
      <div className="absolute inset-0 backdrop-filter-[blur(120px)_saturate(60%)] flex flex-col items-center">
        <Avatar />
        <div className="absolute top-[350px] inset-0 backdrop-filter-[blur(120px)_saturate(60%)] flex flex-col items-center justify-center">
          <Chat />
        </div>
      </div>
    </main>
  );
}

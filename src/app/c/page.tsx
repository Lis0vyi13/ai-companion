import Chat from "@/components/Chat";

export default function Home() {
  return (
    <main className="relative min-h-screen h-dvh overflow-hidden">
      <div className="absolute inset-0 backdrop-filter-[blur(120px)_saturate(60%)] flex flex-col items-center">
        <h1 className=" text-black text-center my-6 capitalize font-medium w-full relative top-0">
          AI generation
        </h1>
        <div className="absolute top-16 inset-0 backdrop-filter-[blur(120px)_saturate(60%)] flex flex-col items-center justify-center">
          <Chat />
        </div>
      </div>
    </main>
  );
}

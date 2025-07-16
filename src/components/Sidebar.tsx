import { Plus } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-[5.5rem] h-full relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-menu/80" />

      <div className="relative h-full flex flex-col items-center justify-between text-black p-4 font-medium">
        <div className="relative logo cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-black" />
          <span className="absolute left-1/2  text-2xl -translate-x-1/2 top-1/2 -translate-y-1/2 text-white">
            <Plus />
          </span>
        </div>
        <div className="relative logo cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-black" />
          <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-white">
            AIC
          </span>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;

// app/ui/Logo.tsx  (renamed or kept as MarketLogo — your choice)
import { ShoppingBag } from "lucide-react";

export default function MarketLogo() {
  return (
    <div className="flex flex-row items-center text-white">
      <ShoppingBag className="h-10 w-10 md:h-12 md:w-12 rotate-[-20deg] mr-3 flex-shrink-0" />
      
      <div className="flex flex-col leading-none">
        <p className="font-bold tracking-tighter text-lg md:text-2xl lg:text-3xl">
          Handcrafted 
        </p>
        <p className="text-[10px] md:text-[11px] tracking-widest opacity-90 -mt-1">
          Market PLACE
        </p>
      </div>
    </div>
  );
}
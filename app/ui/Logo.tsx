
import { Package, ShoppingBag } from "lucide-react";

export default function MarketLogo() {
  return (
    <div className="flex flex-row items-center leading-none text-white">
      <ShoppingBag className="h-12 w-12 rotate-[-20deg] mr-2" />
      <div>
        <p className="text-[28px] font-bold tracking-tighter">Market</p>
        <p className="text-[10px] tracking-widest -mt-1 opacity-90">PLACE</p>
      </div>
    </div>
  );
}
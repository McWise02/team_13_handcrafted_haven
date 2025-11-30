import { GlobeAltIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <GlobeAltIcon className="h-12 w-12 rotate-[15deg]" />
      <SparklesIcon className="h-8 w-8 -translate-y-2" />
      <p className="text-[44px]">Hchd</p>
    </div>
  );
}

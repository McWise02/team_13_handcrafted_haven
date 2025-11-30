
import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';
 
export default function LoginPage() {
  return (
        <div className="flex h-[700px] w-full">
            <div className="w-full hidden md:inline-block">
                <img className="h-full" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png" alt="leftSideImage" />
            </div>
        
            <div className="w-full flex flex-col items-center justify-center">
        <Suspense>
          <LoginForm />
        </Suspense>
            </div>
        </div>
  );
}


/*import LoginForm from '@/app/ui/login-form';
import Image from 'next/image';
import { Suspense } from 'react';
 
export default function LoginPage() {
  return (
        <div className="flex h-[700px] w-full">
            <div className="w-full hidden md:inline-block relative">
                <Image className="h-full object-cover" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png" alt="leftSideImage" fill unoptimized />
            </div>
        
            <div className="w-full flex flex-col items-center justify-center">
        <Suspense>
          <LoginForm />
        </Suspense>
            </div>
        </div>
  );
}
*/
/*

import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';
 
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
  */
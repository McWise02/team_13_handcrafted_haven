import LoginForm from '@/app/ui/login-form';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline'; // optional icon
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full">
      {/* Left side image - hidden on mobile */}
      <div className="w-full hidden md:inline-block relative">
        <img
          className="h-full w-full object-cover"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
          alt="Login visual"
        />
        
        {/* Optional: Back to home link on the image side */}
        <div className="absolute top-8 left-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors font-medium"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full flex flex-col items-center justify-center relative bg-gray-50">
        {/* Back to home link for mobile & fallback (top-left on form side) */}
        <div className="absolute top-8 left-8 md:hidden">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        <div className="w-full max-w-md px-8">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        {/* Alternative placement: small text link below the form */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 underline-offset-4 hover:underline"
          >
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
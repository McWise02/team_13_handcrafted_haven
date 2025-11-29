// app/register/RegisterForm.tsx
'use client';

import { useActionState } from 'react';
import {  registerUser } from '@/lib/actions/auth';
import type { RegisterState } from '@/lib/definitions/form-states';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function RegisterForm() {
  
    const initialRegisterState : RegisterState = {
    message: null,
    errors: {},
  };
  
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/login';
  const [state, formAction] = useActionState<RegisterState, FormData>(
    registerUser,
    initialRegisterState,
  );

  useEffect(() => {
    if (state.message && Object.keys(state.errors || {}).length === 0) {
      if (typeof window !== 'undefined') {
        const url = new URL(callbackUrl, window.location.origin);
        url.searchParams.set('message', state.message);
        window.location.href = url.toString();
      }
    }
  }, [state.message, state.errors, callbackUrl]);
  return (
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-slate-900">
          Fill in your details to get started.
        </p>
        {state.message && (
          <p className="mt-3 text-sm text-red-400" aria-live="polite">
            {state.message}
          </p>
        )}
        {state.errors?._form?.map((error) => (
          <p key={error} className="mt-1 text-sm text-red-400">
            {error}
          </p>
        ))}
      </div>

      <form
        action={formAction}
        className="space-y-4 rounded-2xl bg-slate-900/70 p-6 shadow-xl shadow-black/40 backdrop-blur"
      >
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-slate-200"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            placeholder="you@example.com"
            aria-describedby="email-error"
          />
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email?.map((error) => (
              <p key={error} className="mt-1 text-xs text-red-400">
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-slate-200"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            placeholder="••••••••"
            aria-describedby="password-error"
          />
          <div id="password-error" aria-live="polite" aria-atomic="true">
            {state.errors?.password?.map((error) => (
              <p key={error} className="mt-1 text-xs text-red-400">
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-sm font-medium text-slate-200"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            placeholder="Repeat your password"
            aria-describedby="confirmPassword-error"
          />
          <div id="confirmPassword-error" aria-live="polite" aria-atomic="true">
            {state.errors?.confirmPassword?.map((error) => (
              <p key={error} className="mt-1 text-xs text-red-400">
                {error}
              </p>
            ))}
          </div>
        </div>
        {/* First Name */}
        <div>
          <label
            htmlFor="firstName"
            className="mb-1 block text-sm font-medium text-slate-200"
          >
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            placeholder="John"
            aria-describedby="name-error"
          />
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.firstName?.map((error) => (
              <p key={error} className="mt-1 text-xs text-red-400">
                {error}
              </p>
            ))}
          </div>
        </div>
        {/* Last Name */}
        <div>
          <label
            htmlFor="lastName"
            className="mb-1 block text-sm font-medium text-slate-200"
          >
            Email
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            placeholder="Doe"
            aria-describedby="name-error"
          />
          
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.lastName?.map((error) => (
              <p key={error} className="mt-1 text-xs text-red-400">
                {error}
              </p>
            ))}
          </div>
        </div>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        {/* Submit */}
        <button
          type="submit"
          className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black shadow-md shadow-indigo-500/30 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-indigo-500/60"
        >
          Create account
        </button>
      </form>
    </div>
  );
}

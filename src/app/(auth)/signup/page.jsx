'use client'

import { useActionState, useEffect } from 'react'
import { signup } from '@/lib/actions/auth'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

const initialState = {
  error: null,
}

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(async (prevState, formData) => {
    return await signup(formData)
  }, initialState)

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 -left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 -right-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-black text-slate-900 tracking-tight">
            Join the Community
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Start your journey with AI-powered blogging
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white" action={formAction}>
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 sm:text-sm transition-all"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="email-address" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 sm:text-sm transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="password" title="Password" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 sm:text-sm transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-purple-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-6">
          <Link href="/login" className="text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

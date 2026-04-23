'use client'

import { useState } from 'react'
import { createPost } from '@/lib/actions/posts'
import { useRouter } from 'next/navigation'

export default function CreatePostForm() {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  async function handleSubmit(formData) {
    setIsPending(true)
    setError(null)
    
    // The image is already part of the formData because of the input[type="file"]
    const result = await createPost(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsPending(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto py-12">
      {/* Premium Background Glowing Orbs */}
      <div className="absolute top-0 -left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
      <div className="absolute top-40 -right-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-20 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="relative z-10">
        <form action={handleSubmit} className="bg-white/60 backdrop-blur-2xl p-10 md:p-16 rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.08)] border border-white/80 space-y-12">
          
          <div className="text-center space-y-3 mb-4">
            <h2 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 tracking-tight">
              Create New Insight
            </h2>
            <p className="text-slate-500 font-medium text-lg">
              Draft your story. Our AI will automatically generate a summary.
            </p>
          </div>

          {error && (
            <div className="text-red-600 bg-red-50/80 backdrop-blur-md p-5 rounded-2xl border border-red-100 font-bold text-sm flex items-center gap-3 shadow-sm">
              <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}
          
          <div className="space-y-8">
            <div className="space-y-3 relative group">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-2 transition-colors group-focus-within:text-indigo-500">Post Title</label>
              <input 
                type="text" 
                name="title" 
                required 
                placeholder="A compelling title..."
                className="w-full rounded-2xl border border-slate-200/60 bg-white/50 shadow-inner focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 p-5 text-xl font-extrabold text-slate-800 placeholder:text-slate-300 transition-all outline-none"
              />
            </div>

            <div className="space-y-3 relative group">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-2 transition-colors group-focus-within:text-indigo-500">Content Body</label>
              <textarea 
                name="body" 
                rows="14" 
                required
                placeholder="Tell your story with detail..."
                className="w-full rounded-2xl border border-slate-200/60 bg-white/50 shadow-inner focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 p-5 text-lg leading-relaxed text-slate-700 placeholder:text-slate-300 transition-all outline-none resize-none"
              ></textarea>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Cover Visual</label>
              <div className="flex justify-center px-10 py-12 border-2 border-slate-200/60 border-dashed rounded-[2rem] hover:border-indigo-400 hover:bg-indigo-50/30 transition-all bg-white/30 group/upload cursor-pointer relative shadow-inner">
                <div className="space-y-3 text-center">
                  <div className="mx-auto h-16 w-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-indigo-500 transition-all duration-300 group-hover/upload:scale-110 group-hover/upload:rotate-3 group-hover/upload:text-indigo-600">
                    <svg className="h-8 w-8" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="flex flex-col items-center justify-center text-sm text-slate-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-bold text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                      <span>Click to upload image</span>
                      <input id="file-upload" name="image" type="file" className="sr-only" accept="image/*" />
                    </label>
                    <p className="mt-1 text-xs text-slate-400 font-medium">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-8 mt-8 border-t border-slate-100/50">
            <button 
              type="button"
              onClick={() => router.back()}
              className="py-4 px-8 rounded-2xl text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 transition-all text-center"
            >
              Discard Draft
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="relative overflow-hidden py-4 px-10 rounded-2xl shadow-[0_4px_20px_rgb(79,70,229,0.3)] text-sm font-black text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50 hover:-translate-y-1 active:translate-y-0 group/btn"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full skew-x-12 group-hover/btn:translate-x-full transition-transform duration-700 ease-out"></div>
              <span className="relative flex items-center justify-center gap-2">
                {isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Publishing...
                  </>
                ) : 'Publish to World'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

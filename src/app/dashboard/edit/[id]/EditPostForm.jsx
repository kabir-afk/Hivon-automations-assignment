'use client'

import { useState } from 'react'
import { updatePost } from '@/lib/actions/posts'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function EditPostForm({ post }) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  async function handleSubmit(formData) {
    setIsPending(true)
    setError(null)
    formData.append('id', post.id)
    
    const promise = updatePost(formData)
    
    toast.promise(promise, {
      loading: 'Updating your insight...',
      success: (data) => {
        if (data.error) throw new Error(data.error)
        router.push('/dashboard')
        return 'Post updated successfully!'
      },
      error: (err) => {
        setError(err.message)
        setIsPending(false)
        return `Failed: ${err.message}`
      }
    })

    const result = await promise
    if (!result.error) {
      // Success handled in toast.promise
    } else {
      setIsPending(false)
    }
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto py-12">
      {/* Premium Background Glowing Orbs */}
      <div className="absolute top-0 -left-20 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
      <div className="absolute top-40 -right-20 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-20 left-40 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="relative z-10">
        <form action={handleSubmit} className="bg-white/60 backdrop-blur-2xl p-10 md:p-16 rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.08)] border border-white/80 space-y-12">
          
          <div className="text-center space-y-3 mb-4">
            <h2 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 tracking-tight">
              Refine Your Insight
            </h2>
            <p className="text-slate-500 font-medium text-lg">
              Update your story. Let your ideas evolve.
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
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-2 transition-colors group-focus-within:text-teal-600">Post Title</label>
              <input 
                type="text" 
                name="title" 
                defaultValue={post.title}
                required 
                placeholder="A compelling title..."
                className="w-full rounded-2xl border border-slate-200/60 bg-white/50 shadow-inner focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 p-5 text-xl font-extrabold text-slate-800 placeholder:text-slate-300 transition-all outline-none"
              />
            </div>

            <div className="space-y-3 relative group">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-2 transition-colors group-focus-within:text-teal-600">Content Body</label>
              <textarea 
                name="body" 
                rows="14" 
                defaultValue={post.body}
                required
                placeholder="Tell your story with detail..."
                className="w-full rounded-2xl border border-slate-200/60 bg-white/50 shadow-inner focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 p-5 text-lg leading-relaxed text-slate-700 placeholder:text-slate-300 transition-all outline-none resize-none"
              ></textarea>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-8 mt-8 border-t border-slate-100/50">
            <button 
              type="button"
              onClick={() => router.back()}
              className="py-4 px-8 rounded-2xl text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 transition-all text-center"
            >
              Cancel Edit
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="relative overflow-hidden py-4 px-10 rounded-2xl shadow-[0_4px_20px_rgb(20,184,166,0.3)] text-sm font-black text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 transition-all disabled:opacity-50 hover:-translate-y-1 active:translate-y-0 group/btn"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full skew-x-12 group-hover/btn:translate-x-full transition-transform duration-700 ease-out"></div>
              <span className="relative flex items-center justify-center gap-2">
                {isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

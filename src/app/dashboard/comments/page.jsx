import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { deleteComment } from '@/lib/actions/comments'

export default async function DashboardComments() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userData.role !== 'admin') {
    redirect('/dashboard')
  }

  const { data: comments } = await supabase
    .from('comments')
    .select('*, users(name), posts(title)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manage Comments</h1>
        <p className="text-slate-500 font-medium italic">Moderate all community discussions from one place.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Comment</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Author</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">On Post</th>
                <th className="px-8 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {comments?.map(comment => (
                <tr key={comment.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 max-w-md">
                    <div className="text-sm font-medium text-slate-700 leading-relaxed line-clamp-2 italic">"{comment.comment_text}"</div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-900">{comment.users?.name}</div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-500 truncate max-w-xs">{comment.posts?.title}</div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-right">
                    <form action={async () => {
                      'use server'
                      await deleteComment(comment.id, comment.post_id)
                    }}>
                      <button type="submit" className="inline-flex items-center px-4 py-2 text-sm font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all cursor-pointer">
                        Remove
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {comments?.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-8 py-12 text-center text-slate-400 font-medium italic">No comments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

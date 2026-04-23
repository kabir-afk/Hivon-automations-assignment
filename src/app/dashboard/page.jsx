import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPosts() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  let query = supabase.from('posts').select('id, title, created_at').order('created_at', { ascending: false })

  if (!userData) return null

  if (userData.role === 'author') {
    query = query.eq('author_id', user.id)
  }

  const { data: posts } = await query

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Posts</h1>
          <p className="text-slate-500 font-medium">Manage and edit your blog content.</p>
        </div>
        <Link href="/dashboard/create" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2">
          <span className="text-xl">+</span> Create New Post
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Title</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Published Date</th>
                <th className="px-8 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {posts?.map(post => (
                <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="text-base font-bold text-slate-900">{post.title}</div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-500">
                      {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-right">
                    <Link href={`/dashboard/edit/${post.id}`} className="inline-flex items-center px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all">
                      Edit Post
                    </Link>
                  </td>
                </tr>
              ))}
              {posts?.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-8 py-12 text-center">
                    <p className="text-slate-400 font-medium italic">No posts found yet. Time to write something!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

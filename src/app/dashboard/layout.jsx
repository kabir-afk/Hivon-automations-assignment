import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!userData || (userData.role !== 'author' && userData.role !== 'admin')) {
    redirect('/posts')
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen shadow-sm">
        <div className="p-8">
          <Link href="/dashboard" className="text-2xl font-bold text-indigo-600 tracking-tight block mb-1">Dashboard</Link>
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
            {userData.role}
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <Link href="/dashboard" className="group flex items-center px-4 py-3 text-sm font-bold text-slate-700 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-all">
            Manage Posts
          </Link>
          {userData.role === 'admin' && (
            <Link href="/dashboard/comments" className="group flex items-center px-4 py-3 text-sm font-bold text-slate-700 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-all">
              Manage Comments
            </Link>
          )}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <Link href="/posts" className="flex items-center px-4 py-3 text-sm font-bold text-slate-500 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all">
            &larr; Back to Site
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-10 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}

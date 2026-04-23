import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/lib/actions/auth'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userData = null
  if (user) {
    const { data } = await supabase.from('users').select('role').eq('id', user.id).single()
    userData = data
  }

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold text-indigo-600 tracking-tight">BlogAI</Link>
        
        <div className="flex items-center gap-8">
          <Link href="/posts" className="text-gray-600 hover:text-indigo-600 font-semibold text-sm">All Posts</Link>
          
          {user ? (
            <>
              {(userData?.role === 'author' || userData?.role === 'admin') && (
                <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 font-semibold text-sm">Dashboard</Link>
              )}
              <form action={logout}>
                <button type="submit" className="text-gray-500 hover:text-red-600 font-semibold text-sm cursor-pointer">Logout</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-indigo-600 font-semibold text-sm">Login</Link>
              <Link href="/signup" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all font-bold text-sm shadow-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

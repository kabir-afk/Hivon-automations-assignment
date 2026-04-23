import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Comments from '@/components/posts/Comments'
import PostSummary from '@/components/posts/PostSummary'
import Link from 'next/link'

export default async function PostPage({ params }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: post, error } = await supabase
    .from('posts')
    .select('*, users(name)')
    .eq('id', id)
    .single()

  if (error || !post) {
    notFound()
  }

  // Fetch comments
  const { data: comments } = await supabase
    .from('comments')
    .select('*, users(name)')
    .eq('post_id', id)
    .order('created_at', { ascending: true })

  // Get current user for auth checks in comments
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto py-20 px-6 lg:px-8">
        <div className="mb-12">
          <Link href="/posts" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-all group">
            <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Insights
          </Link>
        </div>

        <header className="mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">{post.title}</h1>
          <div className="flex items-center gap-4 border-b border-slate-100 pb-8">
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              {post.users?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="text-base font-bold text-slate-900">{post.users?.name || 'Anonymous'}</div>
              <div className="text-sm font-medium text-slate-400">
                Published on {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
        </header>

        {post.image_url && (
          <div className="mb-16 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-100">
            <img src={post.image_url} alt={post.title} className="w-full h-auto object-cover max-h-[600px]" />
          </div>
        )}
        
        {post.summary && <PostSummary summary={post.summary} />}

        <div className="prose prose-slate prose-xl max-w-none mb-20 leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">
          {post.body}
        </div>

        <section className="bg-slate-50 rounded-3xl p-10 md:p-16 border border-slate-100">
          <Comments postId={post.id} initialComments={comments || []} currentUser={user} />
        </section>
      </div>
    </div>
  )
}

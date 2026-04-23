import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Search from '@/components/posts/Search'

export default async function PostsPage({ searchParams }) {
  const supabase = await createClient()
  const params = await searchParams
  const page = parseInt(params.page || '1', 10)
  const search = params.q || ''
  const limit = 6
  const offset = (page - 1) * limit

  let query = supabase
    .from('posts')
    .select('id, title, summary, image_url, created_at, users(name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  const { data: posts, count, error } = await query
  const totalPages = Math.ceil((count || 0) / limit)

  return (
    <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Latest Insights</h1>
          <p className="text-xl text-slate-500 leading-relaxed font-medium">Explore the latest stories, news, and insights from our community, summarized by AI.</p>
        </div>
        <div className="w-full md:w-96">
          <Search initialQuery={search} />
        </div>
      </div>
      
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 font-medium">Error loading posts: {error.message}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts?.map(post => (
          <Link 
            key={post.id} 
            href={`/posts/${post.id}`} 
            className="group flex flex-col bg-white rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 border border-slate-100 hover:-translate-y-2"
          >
            <div className="relative h-64 w-full overflow-hidden">
              {post.image_url ? (
                <img 
                  src={post.image_url} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-xs">No Cover Image</div>
              )}
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-md text-indigo-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Article</span>
              </div>
            </div>
            
            <div className="p-8 flex flex-col flex-1">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-4 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">{post.title}</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium italic">
                {post.summary || "No summary available for this post yet."}
              </p>
              
              <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                    {post.users?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-bold text-slate-700">{post.users?.name || 'Anonymous'}</span>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </Link>
        ))}
        {posts?.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-400 text-xl font-medium italic">We couldn't find any stories matching your search.</p>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-20">
        {page > 1 && (
          <Link href={`/posts?page=${page - 1}${search ? `&q=${search}` : ''}`} className="px-8 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
            Previous
          </Link>
        )}
        {page < totalPages && (
          <Link href={`/posts?page=${page + 1}${search ? `&q=${search}` : ''}`} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            Next Page &rarr;
          </Link>
        )}
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CreatePostForm from './CreatePostForm'

export default async function CreatePostPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!userData || (userData.role !== 'author' && userData.role !== 'admin')) {
    redirect('/dashboard')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Create New Post</h1>
      <CreatePostForm />
    </div>
  )
}

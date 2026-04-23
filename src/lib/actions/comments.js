'use server'

import { createClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'

export async function addComment(postId, formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const comment_text = formData.get('comment_text')
  if (!comment_text) return { error: 'Comment text is required' }

  const { error } = await supabase.from('comments').insert([{
    post_id: postId,
    user_id: user.id,
    comment_text
  }])

  if (error) return { error: error.message }
  
  revalidatePath(`/posts/${postId}`)
  return { success: true }
}

export async function deleteComment(commentId, postId) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('comments').delete().eq('id', commentId)
  
  if (error) return { error: error.message }
  
  revalidatePath(`/posts/${postId}`)
  return { success: true }
}

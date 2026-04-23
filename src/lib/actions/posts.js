'use server'

import { createClient } from '../supabase/server'
import { generateBlogSummary } from '@/lib/ai/gemini'
import { revalidatePath } from 'next/cache'

export async function createPost(formData) {
  console.log('--- Creating Post Start ---')
  const supabase = await createClient()

  // 1. Authenticate and authorize
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.error('Auth Error: No user found')
    return { error: 'Unauthorized' }
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  console.log('User Role:', userData?.role)

  if (!userData || (userData.role !== 'author' && userData.role !== 'admin')) {
    return { error: 'Only authors and admins can create posts' }
  }

  const title = formData.get('title')
  const body = formData.get('body')
  const image = formData.get('image')

  console.log('Title:', title)
  console.log('Body length:', body?.length)

  if (!title || !body) return { error: 'Title and body are required' }

  let imageUrl = null

  // 2. Upload image if present
  if (image && image.size > 0) {
    console.log('Uploading image...')
    const fileExt = image.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('posts')
      .upload(filePath, image)

    if (uploadError) {
      console.error('Upload Error:', uploadError)
      return { error: `Image upload failed: ${uploadError.message}` }
    }
    
    const { data } = supabase.storage.from('posts').getPublicUrl(filePath)
    imageUrl = data.publicUrl
    console.log('Image URL:', imageUrl)
  }

  // 3. Call AI for summary
  let summary = ''
  try {
    console.log('Generating AI Summary...')
    summary = await generateBlogSummary(body)
  } catch (error) {
    console.error('AI Summary generation failed:', error)
  }

  // 4. Insert post into database
  console.log('Inserting into DB...')
  const { error: insertError } = await supabase
    .from('posts')
    .insert([{
      title,
      body,
      image_url: imageUrl,
      author_id: user.id,
      summary
    }])

  if (insertError) {
    return { error: insertError.message }
  }

  return { success: true }
}

export async function updatePost(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const id = formData.get('id')
  const title = formData.get('title')
  const body = formData.get('body')

  if (!id || !title || !body) return { error: 'Missing fields' }

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const { data: post } = await supabase.from('posts').select('author_id').eq('id', id).single()
  if (!post) return { error: 'Post not found' }

  if (userData.role !== 'admin' && post.author_id !== user.id) {
    return { error: 'Forbidden' }
  }

  const { error } = await supabase
    .from('posts')
    .update({ title, body })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

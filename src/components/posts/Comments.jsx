'use client'

import { useActionState, useTransition } from 'react'
import { addComment, deleteComment } from '@/lib/actions/comments'

export default function Comments({ postId, initialComments, currentUser }) {
  const [addState, addAction, isAdding] = useActionState(async (prevState, formData) => {
    return await addComment(postId, formData)
  }, { error: null })

  const [isPending, startTransition] = useTransition()

  const handleDelete = (commentId) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      startTransition(async () => {
        await deleteComment(commentId, postId)
      })
    }
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6">Comments ({initialComments.length})</h3>
      
      {currentUser ? (
        <form action={addAction} className="mb-8">
          <textarea
            name="comment_text"
            required
            placeholder="Add a comment..."
            className="w-full p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
          ></textarea>
          {addState?.error && <p className="text-red-500 mt-1">{addState.error}</p>}
          <button 
            type="submit" 
            disabled={isAdding}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isAdding ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 rounded-md mb-8">
          <p>Please log in to add a comment.</p>
        </div>
      )}

      <div className="space-y-6">
        {initialComments.map((comment) => (
          <div key={comment.id} className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium">{comment.users?.name || 'Anonymous'}</span>
              <span className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-800 whitespace-pre-wrap">{comment.comment_text}</p>
            
            {currentUser && currentUser.id === comment.user_id && (
              <button 
                onClick={() => handleDelete(comment.id)}
                disabled={isPending}
                className="mt-3 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

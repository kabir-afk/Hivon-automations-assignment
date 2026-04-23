'use client'

import { logout } from '@/lib/actions/auth'
import { toast } from 'react-hot-toast'

export default function LogoutButton() {
  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
  }

  return (
    <button 
      onClick={handleLogout}
      className="text-gray-500 hover:text-red-600 font-semibold text-sm cursor-pointer transition-colors"
    >
      Logout
    </button>
  )
}

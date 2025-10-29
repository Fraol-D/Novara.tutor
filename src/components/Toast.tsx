import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: number
  type: ToastType
  text: string
}

export default function Toast({ message, onClose }: { message: ToastMessage; onClose: () => void }) {
  useEffect(() => {
    const id = setTimeout(onClose, 3000)
    return () => clearTimeout(id)
  }, [onClose])

  const color = message.type === 'success' ? 'bg-green-600' : message.type === 'error' ? 'bg-red-600' : 'bg-gray-800'

  return (
    <div className={`rounded-md ${color} text-white px-4 py-2 shadow`}>{message.text}</div>
  )
}

import { PropsWithChildren } from 'react'

type ModalProps = PropsWithChildren<{
  title: string
  onClose: () => void
}>

export default function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close modal"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-gray-900 border border-primary/20 shadow-[0_16px_40px_rgba(0,0,0,0.2)] p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-text dark:hover:text-text-dark">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

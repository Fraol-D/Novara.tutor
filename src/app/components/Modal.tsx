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
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
        aria-label="Close modal"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold [font-family:var(--font-display)]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full text-[color:var(--on-surface-soft)] hover:bg-[color:var(--surface-low)] hover:text-[color:var(--on-surface)]"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

import { useState } from 'react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00',
]

const AVAIL_KEY = 'tutorflow_tutor_availability'

function loadAvailability(): Record<string, string[]> {
  const raw = localStorage.getItem(AVAIL_KEY)
  if (raw) {
    try {
      return JSON.parse(raw) as Record<string, string[]>
    } catch {
      /* ignore */
    }
  }
  return {}
}

export default function TutorAvailabilityPage() {
  const [availability, setAvailability] = useState<Record<string, string[]>>(loadAvailability)
  const [saved, setSaved] = useState(false)

  const toggle = (day: string, slot: string) => {
    setAvailability((prev) => {
      const current = prev[day] ?? []
      const updated = current.includes(slot)
        ? current.filter((s) => s !== slot)
        : [...current, slot].sort()
      return { ...prev, [day]: updated }
    })
  }

  const isActive = (day: string, slot: string) => (availability[day] ?? []).includes(slot)

  const totalSlots = Object.values(availability).reduce((sum, slots) => sum + slots.length, 0)

  const handleSave = () => {
    localStorage.setItem(AVAIL_KEY, JSON.stringify(availability))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const clearDay = (day: string) => {
    setAvailability((prev) => ({ ...prev, [day]: [] }))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Availability</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Select the time slots you&apos;re available to teach each week.
            {totalSlots > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {totalSlots} slot{totalSlots !== 1 ? 's' : ''} selected
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {saved && (
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">✓ Saved</span>
          )}
          <button type="button" className="btn-primary" onClick={handleSave}>
            Save Availability
          </button>
        </div>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 w-24">Time</th>
                {DAYS.map((day) => (
                  <th key={day} className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                    <div>{day.slice(0, 3)}</div>
                    {(availability[day]?.length ?? 0) > 0 && (
                      <button
                        type="button"
                        onClick={() => clearDay(day)}
                        className="mt-1 text-[10px] text-red-400 hover:text-red-600 transition-colors"
                      >
                        clear
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot) => (
                <tr key={slot} className="border-t border-gray-50 dark:border-gray-800/50">
                  <td className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 font-mono">{slot}</td>
                  {DAYS.map((day) => {
                    const active = isActive(day, slot)
                    return (
                      <td key={day} className="px-2 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => toggle(day, slot)}
                          className={`w-full rounded-md py-1.5 text-xs font-medium transition-all ${
                            active
                              ? 'bg-primary text-white shadow-sm hover:bg-primary/80'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-primary/10 hover:text-primary'
                          }`}
                          aria-label={`${active ? 'Remove' : 'Add'} ${day} ${slot}`}
                          aria-pressed={active}
                        >
                          {active ? '✓' : '+'}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-600">
        Click a cell to toggle availability. Your schedule is saved locally.
      </p>
    </div>
  )
}

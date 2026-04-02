import { FormEvent, useEffect, useState } from 'react'
import { paymentsApi } from '../api/payments'
import { studentsApi } from '../api/students'
import { useAuth } from '../state/AuthContext'
import type { Payment, Student } from '../types'

export default function PaymentsPage() {
  const { token } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    studentId: '',
    month: '',
    amount: '',
    status: 'unpaid' as 'paid' | 'unpaid',
  })

  useEffect(() => {
    if (!token) return

    setLoading(true)
    Promise.all([paymentsApi.list(token), studentsApi.list(token)])
      .then(([paymentItems, studentItems]) => {
        setPayments(paymentItems)
        setStudents(studentItems)
        if (studentItems.length > 0) {
          setForm((prev) => ({ ...prev, studentId: prev.studentId || studentItems[0].id }))
        }
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Could not load payments'))
      .finally(() => setLoading(false))
  }, [token])

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token) return

    try {
      const created = await paymentsApi.create(token, {
        studentId: form.studentId,
        month: form.month,
        amount: Number(form.amount),
        status: form.status,
      })
      setPayments((prev) => [created, ...prev])
      setForm((prev) => ({ ...prev, month: '', amount: '', status: 'unpaid' }))
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not create payment')
    }
  }

  const toggleStatus = async (payment: Payment) => {
    if (!token) return
    const nextStatus = payment.status === 'paid' ? 'unpaid' : 'paid'

    try {
      const updated = await paymentsApi.updateStatus(token, payment.id, nextStatus)
      setPayments((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : 'Could not update status')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Payments</h1>
        <p className="text-sm text-[color:var(--on-surface-soft)]">Monitor fees and outstanding balances.</p>
      </div>

      <section className="surface-card !p-4">
        <h2 className="font-semibold mb-3">Create Payment</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleCreate}>
          <select
            className="form-input"
            value={form.studentId}
            onChange={(event) => setForm((prev) => ({ ...prev, studentId: event.target.value }))}
            required
          >
            <option value="">Select student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.fullName}
              </option>
            ))}
          </select>
          <input
            required
            className="form-input"
            placeholder="Month (e.g. 2026-03)"
            value={form.month}
            onChange={(event) => setForm((prev) => ({ ...prev, month: event.target.value }))}
          />
          <input
            required
            type="number"
            min="0"
            step="0.01"
            className="form-input"
            placeholder="Amount"
            value={form.amount}
            onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
          />
          <select
            className="form-input"
            value={form.status}
            onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as 'paid' | 'unpaid' }))}
          >
            <option value="unpaid">unpaid</option>
            <option value="paid">paid</option>
          </select>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="btn-primary">
              Save Payment
            </button>
          </div>
        </form>
      </section>

      {loading ? <p className="text-[color:var(--on-surface-soft)]">Loading payments...</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      {!loading && payments.length === 0 ? (
        <div className="surface-tier-low rounded-2xl p-8 text-center text-[color:var(--on-surface-soft)]">
          No payments recorded yet.
        </div>
      ) : (
        <div className="table-shell">
          <table className="w-full text-sm">
            <thead className="surface-tier-low text-left">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-t border-[color:var(--outline-ghost)]">
                  <td className="px-4 py-3">{payment.student?.fullName ?? payment.studentId}</td>
                  <td className="px-4 py-3">{payment.month}</td>
                  <td className="px-4 py-3">{payment.amount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${payment.status === 'paid' ? 'surface-tier-high text-[color:var(--primary)]' : 'surface-tier-container text-[color:#a6673f]'}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-[color:var(--primary)] hover:underline" onClick={() => toggleStatus(payment)}>
                      Mark {payment.status === 'paid' ? 'Unpaid' : 'Paid'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

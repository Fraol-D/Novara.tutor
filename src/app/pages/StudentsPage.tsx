import { FormEvent, useEffect, useState } from 'react'
import Modal from '../components/Modal'
import { studentsApi } from '../api/students'
import { useAuth } from '../state/AuthContext'
import type { CreateStudentPayload, Student } from '../types'

const initialForm: CreateStudentPayload = {
  fullName: '',
  grade: '',
  parentName: '',
  parentPhone: '',
  subjects: [],
  monthlyFee: 0,
  status: 'active',
}

export default function StudentsPage() {
  const { token } = useAuth()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [form, setForm] = useState<CreateStudentPayload>(initialForm)

  useEffect(() => {
    if (!token) return
    setLoading(true)

    studentsApi
      .list(token)
      .then((response) => setStudents(response))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Failed loading'))
      .finally(() => setLoading(false))
  }, [token])

  const openCreateModal = () => {
    setEditingStudent(null)
    setForm(initialForm)
    setIsModalOpen(true)
  }

  const openEditModal = (student: Student) => {
    setEditingStudent(student)
    setForm({
      fullName: student.fullName,
      grade: student.grade,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      subjects: student.subjects,
      monthlyFee: Number(student.monthlyFee),
      status: student.status,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token) return

    const payload = {
      ...form,
      monthlyFee: Number(form.monthlyFee),
    }

    try {
      if (editingStudent) {
        const updated = await studentsApi.update(token, editingStudent.id, payload)
        setStudents((prev) => prev.map((student) => (student.id === updated.id ? updated : student)))
      } else {
        const created = await studentsApi.create(token, payload)
        setStudents((prev) => [created, ...prev])
      }

      setIsModalOpen(false)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Save failed')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Students</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage enrolled students and contact details.</p>
        </div>
        <button className="btn-primary" type="button" onClick={openCreateModal}>
          Add Student
        </button>
      </div>

      {loading ? <p className="text-gray-500">Loading students...</p> : null}
      {error ? <p className="text-accent text-sm">{error}</p> : null}

      {!loading && students.length === 0 ? (
        <div className="rounded-xl border border-dashed border-primary/30 p-8 text-center text-gray-500">
          No students yet. Start by adding your first student.
        </div>
      ) : (
        <div className="rounded-xl border border-primary/15 overflow-hidden bg-white dark:bg-gray-900">
          <table className="w-full text-sm">
            <thead className="bg-primary/5 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Parent</th>
                <th className="px-4 py-3">Fee</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-3">{student.fullName}</td>
                  <td className="px-4 py-3">{student.grade}</td>
                  <td className="px-4 py-3">{student.parentName}</td>
                  <td className="px-4 py-3">{student.monthlyFee}</td>
                  <td className="px-4 py-3">{student.status}</td>
                  <td className="px-4 py-3">
                    <button className="text-primary hover:underline" onClick={() => openEditModal(student)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen ? (
        <Modal title={editingStudent ? 'Edit Student' : 'Add Student'} onClose={() => setIsModalOpen(false)}>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <input
              required
              className="w-full rounded-lg border border-primary/25 px-3 py-2"
              placeholder="Full name"
              value={form.fullName}
              onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
            />
            <input
              required
              className="w-full rounded-lg border border-primary/25 px-3 py-2"
              placeholder="Grade"
              value={form.grade}
              onChange={(event) => setForm((prev) => ({ ...prev, grade: event.target.value }))}
            />
            <input
              required
              className="w-full rounded-lg border border-primary/25 px-3 py-2"
              placeholder="Parent name"
              value={form.parentName}
              onChange={(event) => setForm((prev) => ({ ...prev, parentName: event.target.value }))}
            />
            <input
              required
              className="w-full rounded-lg border border-primary/25 px-3 py-2"
              placeholder="Parent phone"
              value={form.parentPhone}
              onChange={(event) => setForm((prev) => ({ ...prev, parentPhone: event.target.value }))}
            />
            <input
              required
              className="w-full rounded-lg border border-primary/25 px-3 py-2"
              placeholder="Subjects (comma separated)"
              value={form.subjects.join(', ')}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  subjects: event.target.value
                    .split(',')
                    .map((subject) => subject.trim())
                    .filter(Boolean),
                }))
              }
            />
            <input
              required
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-lg border border-primary/25 px-3 py-2"
              placeholder="Monthly fee"
              value={form.monthlyFee}
              onChange={(event) => setForm((prev) => ({ ...prev, monthlyFee: Number(event.target.value) }))}
            />
            <select
              className="w-full rounded-lg border border-primary/25 px-3 py-2"
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as 'active' | 'inactive' }))}
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}

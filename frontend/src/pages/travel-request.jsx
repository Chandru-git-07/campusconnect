import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/shell.jsx'
import { travelService } from '../api/services.js'

export default function TravelRequest() {
  const nav = useNavigate()
  const [form, setForm] = useState({
    destination: 'Chennai Airport',
    date: 'Today',
    deadline: '6:15 PM',
    type: 'Flight',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await travelService.create({
        origin: 'Campus Gate 1',
        destination: form.destination,
        earliest_departure: '2026-11-02T14:00:00',
        latest_arrival: '2026-11-02T16:00:00',
        luggage_count: 1,
        natural_prompt: `${form.type} by ${form.deadline}`,
      })
      nav('/matches')
    } catch (err) {
      const detail = err?.response?.data?.detail || err?.response?.data?.message
      setError(typeof detail === 'string' ? detail : 'Could not create your request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppShell title="New request" subtitle="The deadline comes first.">
      <h2 className="mb-4 text-2xl font-extrabold">Where do you need to be?</h2>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div>
          <label className="field-label" htmlFor="dest">Destination</label>
          <input id="dest" className="field" value={form.destination} onChange={set('destination')} />
        </div>
        <div>
          <label className="field-label" htmlFor="date">Arrival date</label>
          <input id="date" className="field" value={form.date} onChange={set('date')} />
        </div>
        <div>
          <label className="field-label" htmlFor="deadline">Arrival deadline</label>
          <input id="deadline" className="field" value={form.deadline} onChange={set('deadline')} />
        </div>
        <div>
          <label className="field-label" htmlFor="type">Travel type</label>
          <input id="type" className="field" value={form.type} onChange={set('type')} />
        </div>
        {error && (
          <p role="alert" className="bg-white p-3 text-sm font-semibold text-coral" style={{ borderRadius: '1rem' }}>
            {error}
          </p>
        )}
        <button type="submit" disabled={submitting} className="btn-pill mt-4 w-full bg-brand-pale py-4 text-brand disabled:opacity-60">
          {submitting ? 'Creating…' : 'Find my matches'}
        </button>
      </form>
    </AppShell>
  )
}

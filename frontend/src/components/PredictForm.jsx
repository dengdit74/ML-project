import { useEffect, useState } from 'react'

const DEFAULT_CHOICES = {
  city: ['Kasarani', 'Kayole', 'Kileleshwa', 'Kitengela', 'Muthaiga', 'Runda'],
  furnishing: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
}

function PredictForm({ onSubmit, loading, choices = DEFAULT_CHOICES }) {
  const [form, setForm] = useState({
    bedrooms: 2,
    size: 1000,
    city: choices.city[0] || 'Kasarani',
    furnishing: choices.furnishing[0] || 'Furnished',
  })

  useEffect(() => {
    setForm((current) => ({
      ...current,
      city: choices.city.includes(current.city) ? current.city : choices.city[0] || '',
      furnishing: choices.furnishing.includes(current.furnishing)
        ? current.furnishing
        : choices.furnishing[0] || '',
    }))
  }, [choices.city, choices.furnishing])

  const update = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const submit = (event) => {
    event.preventDefault()
    onSubmit({
      bedrooms: Number(form.bedrooms),
      size: Number(form.size),
      city: form.city,
      furnishing: form.furnishing,
    })
  }

  return (
    <form className="card form-card" onSubmit={submit}>
      <div className="card-heading">
        <span className="eyebrow">Property details</span>
        <h2>Estimate your rent</h2>
        <p>Enter a few details and the trained models will do the rest.</p>
      </div>

      <label className="field">
        <span>Bedrooms</span>
        <input
          type="number"
          name="bedrooms"
          min="1"
          max="10"
          value={form.bedrooms}
          onChange={update}
          required
        />
      </label>

      <label className="field">
        <span>Size (sq ft)</span>
        <input
          type="number"
          name="size"
          min="100"
          max="20000"
          step="10"
          value={form.size}
          onChange={update}
          required
        />
      </label>

      <label className="field">
        <span>Location</span>
        <select name="city" value={form.city} onChange={update} required>
          {choices.city.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Furnishing</span>
        <select name="furnishing" value={form.furnishing} onChange={update} required>
          {choices.furnishing.map((furnishing) => (
            <option key={furnishing} value={furnishing}>
              {furnishing}
            </option>
          ))}
        </select>
      </label>

      <button className="submit-button" type="submit" disabled={loading}>
        {loading ? 'Predicting...' : 'Predict rent'}
      </button>
    </form>
  )
}

export default PredictForm

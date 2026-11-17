import { useEffect, useState } from 'react'
import { getModels, predictRent } from './api.js'
import ModelComparison from './components/ModelComparison.jsx'
import PredictForm from './components/PredictForm.jsx'
import ResultCard from './components/ResultCard.jsx'

function App() {
  const [models, setModels] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [modelsError, setModelsError] = useState('')

  useEffect(() => {
    getModels()
      .then(setModels)
      .catch((err) => setModelsError(err.message))
  }, [])

  const handlePredict = async (payload) => {
    setLoading(true)
    setError('')
    try {
      setResult(await predictRent(payload))
    } catch (err) {
      setError(err.message)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-content">
          <span className="hero-pill">Machine learning project</span>
          <h1>
            Know the rent <span>before you rent.</span>
          </h1>
          <p>
            Predict monthly house rent in Kenya shillings and classify it as affordable, average or
            expensive using models trained on sample Nairobi listings.
          </p>
        </div>
        <div className="hero-metric">
          <strong>{models?.training_rows?.toLocaleString() || '—'}</strong>
          <span>listings used for training</span>
        </div>
      </header>

      <main>
        {error && <div className="alert">{error}</div>}
        {modelsError && <div className="alert">Model metadata unavailable: {modelsError}</div>}

        <div className="top-grid">
          <PredictForm onSubmit={handlePredict} loading={loading} choices={models?.choices} />
          <ResultCard result={result} />
        </div>

        <ModelComparison models={models} />
      </main>

      <footer>Built with React, Flask and scikit-learn.</footer>
    </div>
  )
}

export default App

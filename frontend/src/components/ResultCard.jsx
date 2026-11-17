function ResultCard({ result }) {
  const formatRent = (value) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: result?.currency || 'KES',
      maximumFractionDigits: 0,
    }).format(value)

  if (!result) {
    return (
      <div className="card result-card empty">
        <span className="eyebrow">Prediction</span>
        <div className="empty-icon">⌂</div>
        <h2>Your estimate will appear here</h2>
        <p>Submit the property details to see the predicted rent and category.</p>
      </div>
    )
  }

  const category = result.category?.toLowerCase() || 'average'

  return (
    <div className="card result-card">
      <span className="eyebrow">Prediction</span>
      <p className="result-label">Estimated monthly rent</p>
      <div className="rent-value">{formatRent(result.predicted_rent)}</div>
      <div className={`category-badge ${category}`}>{result.category}</div>

      <div className="result-details">
        <div>
          <span>Regression model</span>
          <strong>{result.selected_models?.regressor || 'N/A'}</strong>
        </div>
        <div>
          <span>Classification model</span>
          <strong>{result.selected_models?.classifier || 'N/A'}</strong>
        </div>
      </div>

      <p className="threshold-note">
        Categories use dataset thirds: up to {formatRent(result.thresholds.affordable_max)} is
        affordable, up to {formatRent(result.thresholds.average_max)} is average, above that is
        expensive.
      </p>
    </div>
  )
}

export default ResultCard

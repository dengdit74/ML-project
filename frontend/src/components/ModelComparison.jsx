function BarChart({ title, rows, valueKey, color, subtitleKey, selected }) {
  return (
    <div className="chart-block">
      <h3>{title}</h3>
      <div className="bars">
        {rows.map((row) => (
          <div className="bar-row" key={row.model}>
            <div className="bar-label">
              <span>{row.model}</span>
              {selected === row.model && <span className="selected-tag">deployed</span>}
            </div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${Math.max(2, Number(row[valueKey]) * 100)}%`, background: color }}
              />
            </div>
            <div className="bar-value">
              <strong>{Number(row[valueKey]).toFixed(3)}</strong>
              <small>{subtitleKey ? row[subtitleKey] : ''}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ModelComparison({ models }) {
  if (!models) return null

  const { regression, classification } = models.comparison

  return (
    <section className="card comparison-card">
      <div className="card-heading">
        <span className="eyebrow">Model comparison</span>
        <h2>How the models scored</h2>
        <p>
          Trained on {models.training_rows.toLocaleString()} cleaned listings. Best regressor:{' '}
          <strong>{models.selected_models.regressor}</strong>. Best classifier:{' '}
          <strong>{models.selected_models.classifier}</strong>.
        </p>
      </div>

      <div className="charts">
        <BarChart
          title="Rent prediction (R²)"
          rows={regression}
          valueKey="r2"
          subtitleKey="mae"
          color="linear-gradient(90deg, #4f46e5, #818cf8)"
          selected={models.selected_models.regressor}
        />
        <BarChart
          title="Category accuracy"
          rows={classification}
          valueKey="accuracy"
          subtitleKey="f1_weighted"
          color="linear-gradient(90deg, #059669, #34d399)"
          selected={models.selected_models.classifier}
        />
      </div>
    </section>
  )
}

export default ModelComparison

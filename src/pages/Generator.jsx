import { useState } from 'react'

export default function Generator() {
  const [description, setDescription] = useState('')
  const [numRows, setNumRows] = useState(100)
  const [columns, setColumns] = useState([
    { name: '', type: 'int', range: '', values: '' }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addColumn = () => {
    setColumns([...columns, { name: '', type: 'int', range: '', values: '' }])
  }

  const removeColumn = (index) => {
    setColumns(columns.filter((_, i) => i !== index))
  }

  const updateColumn = (index, field, value) => {
    const updated = [...columns]
    updated[index][field] = value
    setColumns(updated)
  }

  const handleGenerate = async () => {
    setLoading(true)
    setError('')

    const payload = {
      description,
      num_rows: parseInt(numRows),
      columns: columns.map(c => ({
        name: c.name,
        type: c.type,
        range: c.type !== 'category' ? c.range : null,
        values: c.type === 'category' ? c.values.split(',').map(v => v.trim()) : null
      }))
    }

    try {
      const res = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Erreur de génération')
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'dataset.csv'
      a.click()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Générateur de Dataset</h1>

        <label className="block mb-2 text-sm text-gray-400">Description du dataset</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Ex: données de patients diabétiques avec âge, glucose, diagnostic"
          className="w-full mb-4 p-3 rounded-lg bg-gray-800 border border-gray-700"
          rows={3}
        />

        <label className="block mb-2 text-sm text-gray-400">Nombre de lignes</label>
        <input
          type="number"
          value={numRows}
          onChange={e => setNumRows(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg bg-gray-800 border border-gray-700"
        />

        <h2 className="text-xl font-semibold mb-3">Colonnes</h2>

        {columns.map((col, i) => (
          <div key={i} className="bg-gray-900 p-4 rounded-lg mb-3 flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                placeholder="Nom (ex: age)"
                value={col.name}
                onChange={e => updateColumn(i, 'name', e.target.value)}
                className="flex-1 p-2 rounded bg-gray-800 border border-gray-700"
              />
              <select
                value={col.type}
                onChange={e => updateColumn(i, 'type', e.target.value)}
                className="p-2 rounded bg-gray-800 border border-gray-700"
              >
                <option value="int">Entier</option>
                <option value="float">Décimal</option>
                <option value="category">Catégorie</option>
              </select>
              <button onClick={() => removeColumn(i)} className="text-red-400 px-2">✕</button>
            </div>

            {col.type !== 'category' ? (
              <input
                placeholder="Range (ex: 18-90)"
                value={col.range}
                onChange={e => updateColumn(i, 'range', e.target.value)}
                className="p-2 rounded bg-gray-800 border border-gray-700"
              />
            ) : (
              <input
                placeholder="Valeurs séparées par virgule (ex: positif,negatif)"
                value={col.values}
                onChange={e => updateColumn(i, 'values', e.target.value)}
                className="p-2 rounded bg-gray-800 border border-gray-700"
              />
            )}
          </div>
        ))}

        <button onClick={addColumn} className="text-indigo-400 mb-6">+ Ajouter une colonne</button>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'Génération en cours...' : 'Générer le dataset'}
        </button>
      </div>
    </div>
  )
}
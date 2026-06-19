import React, { useEffect, useState } from 'react'

type Pack = {
  id: string
  name: string
  price: number
  stickersCount: number
  createdAt: string
}

const MOCK_KEY = 'mock_packs_v1'

// simple mock DB using localStorage so data persists across reloads
const mockDB = {
  read(): Pack[] {
    const raw = localStorage.getItem(MOCK_KEY)
    if (!raw) {
      const seed: Pack[] = [
        {
          id: 'seed-1',
          name: 'Sobre inicial',
          price: 1.5,
          stickersCount: 5,
          createdAt: new Date().toISOString(),
        },
      ]
      localStorage.setItem(MOCK_KEY, JSON.stringify(seed))
      return seed
    }
    try {
      return JSON.parse(raw) as Pack[]
    } catch {
      return []
    }
  },
  write(packs: Pack[]) {
    localStorage.setItem(MOCK_KEY, JSON.stringify(packs))
  },
}

const api = {
  async fetchPacks(): Promise<Pack[]> {
    const res = await fetch('http://localhost:3000/shop')
    if (!res.ok) throw new Error('Error al cargar sobres')
    return res.json()
  },
  async createPack(payload: Omit<Pack, 'id' | 'createdAt'>): Promise<Pack> {
    const res = await fetch('http://localhost:3000/shop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: payload.name,
        price: payload.price,
        stickersCount: payload.stickersCount,
      }),
    })
    if (!res.ok) throw new Error('Error al crear sobre')
    return res.json()
  },
}

export default function Shop() {
  const [packs, setPacks] = useState<Pack[]>([])
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState<string>('')
  const [stickersCount, setStickersCount] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    api
      .fetchPacks()
      .then((data) => setPacks(data))
      .finally(() => setLoading(false))
  }, [])

  function resetMessages() {
    setError(null)
    setSuccess(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    resetMessages()

    const trimmedName = name.trim()
    const parsedPrice = parseFloat(price)
    const parsedCount = parseInt(stickersCount, 10)

    if (!trimmedName) {
      setError('El nombre es obligatorio.')
      return
    }
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Precio inválido. Debe ser un número mayor que 0.')
      return
    }
    if (Number.isNaN(parsedCount) || parsedCount <= 0) {
      setError('Cantidad de figuritas inválida. Debe ser un entero mayor que 0.')
      return
    }

    setLoading(true)
    try {
      const created = await api.createPack({
        name: trimmedName,
        price: parsedPrice,
        stickersCount: parsedCount,
      })
      setPacks((prev) => [created, ...prev])
      setSuccess('Sobre creado correctamente.')
      setName('')
      setPrice('')
      setStickersCount('')
    } catch {
      setError('Error al crear el sobre (mock).')
    } finally {
      setLoading(false)
      setTimeout(() => setSuccess(null), 2500)
    }
  }

  return (
    <main style={{ padding: 16 }}>
      <h2>Tienda</h2>

      <section style={{ marginBottom: 20, maxWidth: 560 }}>
        <h3>Crear sobre de figuritas</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
          <label>
            Nombre
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Sobre Mundial"
              disabled={loading}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>

          <label>
            Precio (USD)
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ej: 1.5"
              disabled={loading}
              inputMode="decimal"
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>

          <label>
            Cantidad de figuritas por sobre
            <input
              value={stickersCount}
              onChange={(e) => setStickersCount(e.target.value)}
              placeholder="Ej: 5"
              disabled={loading}
              inputMode="numeric"
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
            <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>
              {loading ? 'Guardando...' : 'Crear sobre'}
            </button>
            <button
              type="button"
              onClick={() => {
                setName('')
                setPrice('')
                setStickersCount('')
                resetMessages()
              }}
              disabled={loading}
              style={{ padding: '8px 12px' }}
            >
              Limpiar
            </button>
            {error && <div style={{ color: 'crimson' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>{success}</div>}
          </div>
        </form>
      </section>

      <section>
        <h3>Listado de sobres</h3>
        {loading && packs.length === 0 ? (
          <div>Cargando...</div>
        ) : packs.length === 0 ? (
          <div>No hay sobres creados.</div>
        ) : (
          <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
            {packs.map((p) => (
              <li
                key={p.id}
                style={{
                  border: '1px solid #ddd',
                  padding: 12,
                  marginBottom: 8,
                  borderRadius: 6,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <div>
                    <strong>{p.name}</strong>
                    <div style={{ fontSize: 13, color: '#555' }}>
                      {p.stickersCount} figuritas · ${p.price.toFixed(2)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 12, color: '#666' }}>
                    {new Date(p.createdAt).toLocaleString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
import React, { useState, useEffect } from 'react'
import './App.css'

const QuoteViewer = () => {
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchQuote = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('https://api.quotable.io/random', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      })
      
      
      
      const data = await response.json()
      setQuote(data)
    } catch (error) {
      console.error('Error fetching quote:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuote()
    const interval = setInterval(fetchQuote, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ textAlign: "center", padding: '20px' }}>
      <h1>Quote Viewer</h1>
      { loading ? (
        <p>Loading...</p>
      ) : quote && (
        <div>
          <p style={{ fontStyle: 'italic' }}>"{quote.content}"</p>
          <p>- {quote.author}</p>
        </div>
      )}
      <button onClick={fetchQuote}>Get New Quote</button>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <QuoteViewer />
    </div>
  )
}

export default App

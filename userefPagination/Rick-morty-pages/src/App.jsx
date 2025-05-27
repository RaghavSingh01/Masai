import { useState, useEffect, useRef } from 'react'
// import './App.css'

function App() {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const pageRef = useRef(1)
  const charactersPerPage = 10


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
        const res = await fetch(`https://rickandmortyapi.com/api/character`)
        const data = await res.json()
        setCharacters(data.results)
        setLoading(false)
      
    }

    fetchData()
  },[])

  const totalPages = Math.ceil(characters.length / charactersPerPage)
  const indexOfLastChar = pageRef.current * charactersPerPage
  const indexOfFirstChar = indexOfLastChar - charactersPerPage
  const currentCharacters = characters.slice(indexOfFirstChar, indexOfLastChar)
  const handlePageChange = (newPage) => {
    pageRef.current = newPage
    setCharacters([...characters])
  }

  return (
    <>
      <div style={{padding:'20px'}}>
        <h2>Rick and Morty Characters</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
          <div style={{ display : 'grid', gridTemplateColumns : 'repeat(2,1fr)', gap : 10 , textAlign : 'center'}}>
            {currentCharacters.map((character) => (
              <div key={character.id} style={{border: '1px solid black', padding: '10px', textAlign: 'center', borderRadius: 10}}>
                <img src={character.image} alt={character.name} width={'100'}/>
                <p>{character.name}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop : 20}}>
            {[...Array(totalPages)].map((_, i) => (
              <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              style={{
                margin: 5,
                backgroundColor: pageRef.current === i + 1 ? 'blue' : 'lightgray',
              }}>
                {i+1}
              </button>  
            ))}
          </div>
          </>
        )
        }
        </div>    
    </>
  )
}

export default App

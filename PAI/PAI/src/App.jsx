import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>CountryBoard Lite – National Data Viewer & Analyzer</h1>
      <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
        <div style={{ display: 'flex', marginTop: '90px' }}>
          <ul id='countryList'>

          </ul>
          Add Country:
          <form action="">
            <input type="text" id='countryName' placeholder="Enter country name..." />
            <br />
            <input type="text" id='countryRegion' placeholder="Enter country region..." />
            <br />
            <input type="text" id='countryPopulation' placeholder="Enter country population..." />
            <br />
            <input type="text" id='countryArea' placeholder="Enter country area..." />
            <br />
            <input type="text" id='countryCapital' placeholder="Enter country capital..." />
            <br />
            <button type='submit' onClick={() => {

              const name = document.getElementById('countryName').value;
              const region = document.getElementById('countryRegion').value;
              const population = document.getElementById('countryPopulation').value;
              const area = document.getElementById('countryArea').value;
              const capital = document.getElementById('countryCapital').value;

              if (name === '') {
                alert('Please enter a country name');
                return
              }

              const country = {
                name,
                region,
                population,
                area,
                capital
              }


              const exist = JSON.parse(localStorage.getItem('countries')) || [];
              exist.push(country);
              localStorage.setItem('countries', JSON.stringify(exist));


              alert('Country added successfully!');
            }
            }>Submit</button>
          </form>
          <div style={{ display: 'flex' }}>Find Countries:
            <input type="text" placeholder="Search for a country..." id='findCountry' style={{height: "20px", }}/>
            <button onClick={() => {
              const country = document.getElementById('findCountry').value.trim().toLowerCase();
              const countries = JSON.parse(localStorage.getItem('countries')) || [];
              
              const result = countries.find(query => query.name.toLowerCase() === country);
              console.log(country);
              if (result) {
                const resultDiv = document.getElementById('resultDiv');
                resultDiv.innerHTML = JSON.parse(localStorage.getItem('countries')) ;
              }
              else {
                alert('Country not found');
              }
            }}  style={{height: '40px'}}>Get Countries</button>
          </div>

        </div>

      </div>
      <div id='resultDiv' >
        Result:
      </div>

      {/* <div>
        <ul id='countryList'>

        </ul>
      </div> */}
    </>
  )
}

export default App

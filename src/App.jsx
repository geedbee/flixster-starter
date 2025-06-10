import { useState } from 'react'
import './App.css'
import NewMovieList from './components/NewMovieList'
import Search from './components/Search'

const App = () => {
  const [isSearch, setIsSearch] = useState(false);

  function HandleSearchToggle(e){
    if (e.target.checked){
      setIsSearch(true);
    }
    else {
      setIsSearch(false);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Flixster</h1>
      </header>
      <main>
        <input type="checkbox" id="searchToggle" name="searchToggle" onClick={HandleSearchToggle}></input>
        <label htmlFor="searchToggle">Toggle</label>
        {isSearch ? <Search /> : <NewMovieList />}
      </main>
      <footer></footer>
    </div>
  )
}

export default App

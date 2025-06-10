import { useState, useEffect } from 'react'
import './App.css'
import NewMovieList from './components/NewMovieList'
import Search from './components/Search'
import Modal from './components/Modal'

const App = () => {
  const [isSearch, setIsSearch] = useState(false);
  //modal handling
  const [modal, setModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function HandleSearchToggle(e){
    if (e.target.checked){
      setIsSearch(true);
    }
    else {
      setIsSearch(false);
    }
  }

  useEffect(() => {
  }, [isModalOpen]);

  return (
    <div className="App">
      {isModalOpen && modal && <Modal modalInfo={modal} setModal={setModal} setIsModalOpen={setIsModalOpen}></Modal>}
      <header className="App-header">
        <h1>Flixster</h1>
        <div className='search-toggle-container'>
          <input type="checkbox" id="searchToggle" name="searchToggle" onClick={HandleSearchToggle}></input>
          <label htmlFor="searchToggle">Toggle</label>
        </div>
      </header>
      <main>
        {isSearch ? <Search setModal={setModal} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/> : <NewMovieList setModal={setModal} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>}
      </main>
      <footer></footer>
    </div>
  )
}

export default App

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
  const [sort, setSort] = useState('none');

  function HandleSearchToggle(e){
    if (e.target.checked){
      setIsSearch(true);
    }
    else {
      setIsSearch(false);
    }
  }
  function HandleSort(e){
    switch (e.target.value){
      case 'name':
        setSort('name');
        break;
      case 'dates':
        setSort('dates');
        break;
      case 'votes':
        setSort('votes');
        break;
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
        <div className="sort-bar">
            <select name="sort" onChange={HandleSort}>
                <option value="none">Sort By</option>
                <option value="name">Title (A-Z)</option>
                <option value="dates">Release Date (newest)</option>
                <option value="votes">Vote Average (highest)</option>
             </select>
         </div>
      </header>
      <main>
        {isSearch ? <Search setModal={setModal} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/> :
        <NewMovieList setModal={setModal} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} sort={sort}/>}
      </main>
      <footer></footer>
    </div>
  )
}

export default App

import { useState, useEffect } from 'react'
import './App.css'
import MovieList from './components/MovieList'
import Modal from './components/Modal'

const App = () => {
  //modal handling
  const [modal, setModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sort, setSort] = useState('none');
  const [liked, setLiked] = useState([]);
  const [watched, setWatched] = useState([]);

  useEffect(() => {
  }, [isModalOpen]);

  //sort handling
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
    console.log(liked);
    console.log(watched);
  }, [liked, watched]);

  return (
    <div className="App">
      {isModalOpen && modal && <Modal modalInfo={modal} setModal={setModal} setIsModalOpen={setIsModalOpen}></Modal>}
      <header className="App-header">
        <h1>Flixster</h1>
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
        <MovieList setModal={setModal} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} sort={sort} liked={liked} setLiked={setLiked}
        watched={watched} setWatched={setWatched}/>
      </main>
      <footer>Flixster {new Date().getFullYear()}</footer>
    </div>
  )
}

export default App

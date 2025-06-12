import { useState, useEffect , createContext} from 'react'
import './App.css'
import MovieList from './components/MovieList'
import Modal from './components/Modal'
import Sidebar from './components/Sidebar'
import Liked from './components/Liked'
import Watched from './components/Watched'
import { MdMovieFilter } from "react-icons/md";

export const LikeContext = createContext();
export const WatchedContext = createContext();

const App = () => {
  //modal handling
  const [modal, setModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //sort handling
  const [sort, setSort] = useState('none');

  const [liked, setLiked] = useState([]);
  const [watched, setWatched] = useState([]);

  //page handling
  const [pageIdx, setPageIdx] = useState(0);
  //0 is home, 1 is liked, 2 is watched

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


  return (
    <div className="App">
      {isModalOpen && modal && <Modal modalInfo={modal} setModal={setModal} setIsModalOpen={setIsModalOpen}></Modal>}
      <Sidebar pageIdx={pageIdx} setPageIdx={setPageIdx}></Sidebar>
      <header className="App-header">
        <h1><MdMovieFilter />Flixster</h1>
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
        <WatchedContext.Provider value={{watched, setWatched}}>
        <LikeContext.Provider value={{liked, setLiked}}>
          {pageIdx === 0 && <MovieList setModal={setModal} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} sort={sort}/>}
          {pageIdx === 1 && <Liked setModal={setModal} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} sort={sort}/>}
          {pageIdx === 2 && <Watched setModal={setModal} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} sort={sort}/>}
        </LikeContext.Provider>
        </WatchedContext.Provider>
      </main>
      <footer>Flixster {new Date().getFullYear()}</footer>
    </div>
  )
}

export default App

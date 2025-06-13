import { useState, useEffect , createContext} from 'react'
import './App.css'
import MovieList from './components/MovieList'
import Modal from './components/Modal'
import Sidebar from './components/Sidebar'
import Liked from './components/Liked'
import Watched from './components/Watched'
import { MdMovieFilter } from "react-icons/md";

export const LikedWatchedContext = createContext();
export const Page = {
  Home: 0,
  Liked: 1,
  Watched: 2
}

const App = () => {
  //modal handling
  const [modal, setModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //sort handling
  const [sort, setSort] = useState('none');

  const [likedList, setLikedList] = useState([]);
  const [watchedList, setWatchedList] = useState([]);

  //page handling
  const [pageIdx, setPageIdx] = useState(Page.Home);

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
  //handle search
  const [search, setSearch] = useState('');
  const [moviePageIdx, setMoviePageIdx] = useState(1);
  const [isSearch, setIsSearch] = useState(false);
  function HandleSearch(event){
      event.preventDefault();
      setIsSearch(true);
      setMoviePageIdx(1);
  }
  function HandleSearchChange(event){
      setSearch(event.target.value);
      setIsSearch(false);
  }
  function HandleClear(){
      setSearch('');
      setIsSearch(false);
      setMoviePageIdx(1);
  }

  const options = ["none", "name", "dates", "votes"];

  return (
    <div className="App">
      {isModalOpen && modal && <Modal modalInfo={modal} setModal={setModal} setIsModalOpen={setIsModalOpen}></Modal>}
      <nav>
        <Sidebar pageIdx={pageIdx} setPageIdx={setPageIdx}></Sidebar>
      </nav>
      <header className="App-header">
        <h1><MdMovieFilter />Flixster</h1>
        <div className='selection'>
          <aside className="sort-bar">
            <select className="sort-select" name="sort" onChange={HandleSort}>
                {options.map((option, index) => (
                  <option key={index} value={option}>{option === "none" ? "Sort By" : option[0].toUpperCase() + option.slice(1)}</option>
                ))}
             </select>
          </aside>
          <aside className="search-bar">
            <form onSubmit={HandleSearch}>
                <input type="text" name="search" value={search} onChange={HandleSearchChange} placeholder="Search"/>
                <button type="submit">Search</button>
                <button type="button" onClick={HandleClear}>Clear</button>
            </form>
          </aside>
        </div>
      </header>
      <main>
        <LikedWatchedContext.Provider value={{watchedList, setWatchedList, likedList, setLikedList}}>
          {pageIdx === Page.Home && <MovieList setModal={setModal} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} sort={sort}
          search={search} isSearch={isSearch} pageIdx={moviePageIdx} setPageIdx={setMoviePageIdx}/>}
          {pageIdx === Page.Liked && <Liked setModal={setModal} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} sort={sort}/>}
          {pageIdx === Page.Watched && <Watched setModal={setModal} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} sort={sort}/>}
        </LikedWatchedContext.Provider>
      </main>
      <footer>Flixster ©{new Date().getFullYear()}</footer>
    </div>
  )
}

export default App

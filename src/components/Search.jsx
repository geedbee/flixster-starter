import {useState, useEffect} from 'react';
import { parseMovieData , parseMovieDetails} from '../utils/utils';
import MovieCard from './MovieCard';

function Search({setModal, setIsModalOpen, isModalOpen}){
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [pageIdx, setPageIdx] = useState(1);

    //modal handling
    const [modalId, setModalId] = useState(null);
    useEffect(() => {
        if (isModalOpen && modalId){
            populateModal();
        }
    }, [isModalOpen]);
    async function populateModal(){
        const apiKey = import.meta.env.VITE_API_KEY;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${apiKey}`
            }
        };
        const response = await fetch(`https://api.themoviedb.org/3/movie/${modalId}`, options);
        const result = await response.json();
        console.log(result);
        console.log(parseMovieDetails(result));
        setModal(parseMovieDetails(result));
    }

    const fetchData = async () => {
        const apiKey = import.meta.env.VITE_API_KEY;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${apiKey}`
            }
          };
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false&language=en-US&page=${pageIdx}`, options);
        if (!response.ok) {
            throw new Error('Failed to fetch search data');
        }
        const result = await response.json();
        setData([...data, ...parseMovieData(result.results)]);
    }

    useEffect(() => {
        if (search) {
            fetchData();
        }
    }, [pageIdx]);

    function HandleLoadMore(){
        setPageIdx(pageIdx + 1);
        fetchData();
    }

    function HandleSearch(event){
        console.log('Search');
        event.preventDefault();
        fetchData();
    }

    function HandleSearchChange(event){
        setSearch(event.target.value);
    }

    return(
    <>
        <form onSubmit={HandleSearch}>
            <input type="text" name="search" value={search} onChange={HandleSearchChange} placeholder="search"/>
            <button type="submit">Search</button>
        </form>
        <div className="movie-card-container">
        {data.map((movie, index) => (
            <MovieCard key={index} id={movie.id} title={movie.title} img={movie.img} voteAvg={movie.voteAvg} setModalId={setModalId} setIsModalOpen={setIsModalOpen}/>
        ))}
        </div>
        <button onClick={HandleLoadMore}>Load More</button>
    </>
    );
}

export default Search

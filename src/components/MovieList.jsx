import {useState, useEffect} from 'react';
import { parseMovieData , parseMovieDetails, handleSort} from '../utils/utils';
import MovieCard from './MovieCard';

function MovieList({setModal, setIsModalOpen, isModalOpen, sort}){
    const [data, setData] = useState([]); //what will show in MovieCards
    const [search, setSearch] = useState('');
    const [pageIdx, setPageIdx] = useState(1);
    const [isSearch, setIsSearch] = useState(false);

    //initial load
    useEffect(() => {
        fetchNewMovieData(true);
    }, []);

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
        setModal(parseMovieDetails(result));
    }

    //sort handling
    useEffect(() => {
        if (sort != 'none'){
            setData(handleSort(sort, data));
        }
    }, [sort]);

    //fetching data
    //SEARCH API
    const fetchSearchData = async (isFirst) => {
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
            throw new Error('Failed to fetch movie list data');
        }
        //if it is the first page, we want to reset the data
        const result = await response.json();
        if (isFirst){
            setData(parseMovieData(result.results));
        }
        else{
            setData([...data, ...parseMovieData(result.results)]);
        }
    }
    //NOW PLAYING API
    const fetchNewMovieData = async (isFirst) => {
        const apiKey = import.meta.env.VITE_API_KEY;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${apiKey}`
            }
          };
        const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${pageIdx}`, options)
        if (!response.ok) {
            throw new Error('Failed to fetch movie list data');
        }
        //if it is the first page, we want to reset the data
        const result = await response.json();
        if (isFirst){
            setData(parseMovieData(result.results));
        }
        else{
            setData([...data, ...parseMovieData(result.results)]);
        }
    }

    //updates: load more and when user searches/clears
    function HandleLoadMore(){
        setPageIdx(pageIdx + 1);
    }
    useEffect(() => {
        if (isSearch){
            fetchSearchData(pageIdx === 1);
        }
        else{
            fetchNewMovieData(pageIdx === 1);
        }
    }, [pageIdx, isSearch]);

    //handle search
    function HandleSearch(event){
        event.preventDefault();
        setIsSearch(true);
        setPageIdx(1);
    }
    function HandleSearchChange(event){
        setSearch(event.target.value);
    }
    function HandleClear(){
        setSearch('');
        setIsSearch(false);
        setPageIdx(1);
    }

    return(
    <>
        <form onSubmit={HandleSearch}>
            <input type="text" name="search" value={search} onChange={HandleSearchChange} placeholder="search"/>
            <button type="submit">Search</button>
            <button type="button" onClick={HandleClear}>Clear</button>
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

export default MovieList;

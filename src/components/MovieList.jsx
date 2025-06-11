import {useState, useEffect} from 'react';
import { parseMovieData , parseMovieDetails, compareDates} from '../utils/utils';
import MovieCard from './MovieCard';

function MovieList({setModal, setIsModalOpen, isModalOpen, sort}){
    const [data, setData] = useState([]);
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
        console.log(result);
        console.log(parseMovieDetails(result));
        setModal(parseMovieDetails(result));
    }

    //sort handling
    useEffect(() => {
        if (sort != 'none'){
            let dataCpy = [...data];
            if (sort === 'name'){
                setData(dataCpy.sort((a, b) => a.title.localeCompare(b.title)));
            }
            else if (sort === 'votes'){
                setData(dataCpy.sort((a, b) => b.voteAvg - a.voteAvg));
            }
            else if (sort === 'dates'){
                setData(dataCpy.sort((a, b) => compareDates(a.releaseDate, b.releaseDate)));
            }
        }
    }, [sort]);

    //fetching data
    const fetchSearchData = async (isFirst) => {
        const apiKey = import.meta.env.VITE_API_KEY;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${apiKey}`
            }
          };
        console.log(`https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false&language=en-US&page=${pageIdx}`);
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
    const fetchNewMovieData = async (isFirst) => {
        const apiKey = import.meta.env.VITE_API_KEY;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${apiKey}`
            }
          };
        console.log(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${pageIdx}`);
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

    //load more
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
        fetchSearchData(true);
    }
    function HandleSearchChange(event){
        setSearch(event.target.value);
    }
    function HandleClear(){
        setSearch('');
        setIsSearch(false);
        setPageIdx(1);
        fetchNewMovieData(true);
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

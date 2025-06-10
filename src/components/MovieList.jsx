import {useState, useEffect} from 'react';
import { parseMovieData , parseMovieDetails, compareDates} from '../utils/utils';
import MovieCard from './MovieCard';

function NewMovieList({isSearch, setModal, setIsModalOpen, isModalOpen, sort}){
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
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false&language=en-US&page=${pageIdx}`, options);
        if (!response.ok) {
            throw new Error('Failed to fetch movie list data');
        }
        //if it is the first page, we want to reset the data
        const result = await response.json();
        if (isFirst){
            setData(parseMovieData(result.results));
            setPageIdx(1);
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
        const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${pageIdx}`, options)
        if (!response.ok) {
            throw new Error('Failed to fetch movie list data');
        }
        //if it is the first page, we want to reset the data
        const result = await response.json();
        if (isFirst){
            setData(parseMovieData(result.results));
            setPageIdx(1);
        }
        else{
            setData([...data, ...parseMovieData(result.results)]);
        }
    }

    //load more
    function HandleLoadMore(){
        console.log('Load more');
        setPageIdx(pageIdx + 1);
    }
    useEffect(() => {
        if (isSearch){
            fetchSearchData(false);
        }
        else{
            fetchNewMovieData(false);
        }
    }, [pageIdx]);


    //handle search
    function HandleSearch(event){
        console.log('Search');
        event.preventDefault();
        fetchSearchData(true);
    }
    function HandleSearchChange(event){
        setSearch(event.target.value);
    }

    //handle toggle
    useEffect(() => {
        if (!isSearch){
            fetchNewMovieData(true);
        }
        else{
            fetchSearchData(true);
        }
    }, [isSearch]);

    return(
    <>
        {isSearch && <form onSubmit={HandleSearch}>
            <input type="text" name="search" value={search} onChange={HandleSearchChange} placeholder="search"/>
            <button type="submit">Search</button>
            <button onClick={() => fetchNewMovieData(true)}>Clear</button>
        </form>}
        <div className="movie-card-container">
        {data.map((movie, index) => (
            <MovieCard key={index} id={movie.id} title={movie.title} img={movie.img} voteAvg={movie.voteAvg} setModalId={setModalId} setIsModalOpen={setIsModalOpen}/>
        ))}
        </div>
        <button onClick={HandleLoadMore}>Load More</button>
    </>
    );
}

export default NewMovieList;

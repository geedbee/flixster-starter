import {useState, useEffect, useContext} from 'react';
import { parseMovieData , parseMovieDetails, handleSort, getMovieDetails} from '../utils/utils';
import MovieCard from './MovieCard';
import {LikedWatchedSearchContext} from "../App.jsx"

function MovieList({setModal, setIsModalOpen, isModalOpen, sort, pageIdx, setPageIdx}){
    const [data, setData] = useState([]); //what will show in MovieCards
    const context = useContext(LikedWatchedSearchContext);
    const search = context.search;
    const isSearch = context.isSearch;
    //initial load
    useEffect(() => {
        fetchNewMovieData(true);
        setPageIdx(1);
    }, []);

    //modal handling
    const [modalId, setModalId] = useState(null);
    useEffect(() => {
        if (isModalOpen && modalId){
            populateModal();
        }
    }, [isModalOpen]);
    async function populateModal(){
        const result = await getMovieDetails(modalId);
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


    return(
    <>
        <section className="movie-card-container">
        {data.length === 0 && <p className='error-msg'>No search results</p>}
        {data.map((movie, index) => (
            <MovieCard key={index} id={movie.id} title={movie.title} img={movie.img} voteAvg={movie.voteAvg} setModalId={setModalId} setIsModalOpen={setIsModalOpen}/>
        ))}
        </section>
        {data.length > 0 && <button onClick={HandleLoadMore}>Load More</button>}
    </>
    );
}

export default MovieList;

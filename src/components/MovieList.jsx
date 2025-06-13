import {useState, useEffect, useContext} from 'react';
import { parseMovieData , parseMovieDetails, handleSort, getMovieDetails} from '../utils/utils';
import MovieCard from './MovieCard';
import "../MovieList.css"
import {Sort} from "../App.jsx"
import { AllContext } from '../App.jsx';

function MovieList({search, isSearch, sort, pageIdx, setPageIdx}){
    const [data, setData] = useState([]); //what will show in MovieCards
    const context = useContext(AllContext);
    const setModal = context.setModal;
    const setIsModalOpen = context.setIsModalOpen;
    const isModalOpen = context.isModalOpen;
    //initial load
    useEffect(() => {
        fetchNewMovieData();
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
        if (sort != Sort.none){
            setData(handleSort(sort, data));
        }
    }, [sort]);

    //fetching data
    //SEARCH API
    const fetchSearchData = async () => {
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
        if (pageIdx === 1){
            setData(parseMovieData(result.results));
        }
        else{
            setData([...data, ...parseMovieData(result.results)]);
        }
    }
    //NOW PLAYING API
    const fetchNewMovieData = async () => {
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
        if (pageIdx === 1){
            setData(parseMovieData(result.results));
        }
        else{
            let newData = parseMovieData(result.results);
            newData = newData.filter(movie => !data.some(dataMovie => dataMovie.id === movie.id));
            setData([...data, ...newData]);
        }
    }

    //updates: load more and when user searches/clears
    function HandleLoadMore(){
        setPageIdx(pageIdx + 1);
    }
    useEffect(() => {
        if (isSearch){
            fetchSearchData();
        }
        else{
            fetchNewMovieData();
        }
    }, [pageIdx, isSearch]);


    return(
    <>
        <section className="movie-card-container">
        {data.length === 0 && <p className='error-msg'>No search results</p>}
        {data.map((movie, index) => (
            <MovieCard key={index} id={movie.id} title={movie.title} img={movie.img} voteAvg={movie.voteAvg} setModalId={setModalId}/>
        ))}
        </section>
        {data.length > 0 && <button className='load-more-btn' onClick={HandleLoadMore}>Load More</button>}
    </>
    );
}

export default MovieList;

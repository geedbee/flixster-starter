import {useState, useEffect, useContext} from 'react';
import MovieCard from './MovieCard';
import {parseMovieData, parseMovieDetails, compareDates} from '../utils/utils.js';
import { WatchedContext } from "../App.jsx";

function Watched({setModal, setIsModalOpen, isModalOpen, sort}){
    const [data, setData] = useState([]); //what will show in MovieCards
    const watchContext = useContext(WatchedContext);
    const watched = watchContext.watched;
    const setWatched = watchContext.setWatched;

    //initial load
    useEffect(() => {
        fetchWatchedData();
    }, [watched]);

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

    const fetchWatchedData = async () => {
        const apiKey = import.meta.env.VITE_API_KEY;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${apiKey}`
            }
        };
        setData([]);
        let watchedData = [];
        for (let id of watched){
            const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
            if (!response.ok) {
                throw new Error('Failed to fetch atched list data');
            }
            const result = await response.json();
            watchedData.push(parseMovieDetails(result));
        }
        setData(watchedData);
    }

    return(
    <>
        <div className="movie-card-container">
        {data.map((movie, index) => (
            <MovieCard key={index} id={movie.id} title={movie.title} img={movie.img} voteAvg={movie.voteAvg} setModalId={setModalId} setIsModalOpen={setIsModalOpen}
            watched={watched} setWatched={setWatched}/>
        ))}
        {watched.length === 0 && <p>Nothing watched yet!</p>}
        </div>
    </>
    );
}

export default Watched;

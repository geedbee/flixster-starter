import {useState, useEffect} from 'react';
import MovieCard from './MovieCard';
import {parseMovieData, parseMovieDetails, compareDates} from '../utils/utils.js';

function Liked({setModal, setIsModalOpen, isModalOpen, sort, liked, setLiked, watched, setWatched}){
    const [data, setData] = useState([]); //what will show in MovieCards

    //initial load
    useEffect(() => {
        fetchLikedData();
    }, [liked]);

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

    const fetchLikedData = async () => {
        const apiKey = import.meta.env.VITE_API_KEY;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${apiKey}`
            }
        };
        setData([]);
        let likedData = [];
        for (let id of liked){
            const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
            if (!response.ok) {
                throw new Error('Failed to fetch liked list data');
            }
            const result = await response.json();
            likedData.push(parseMovieDetails(result));
        }
        setData(likedData);
    }

    return(
    <>
        <div className="movie-card-container">
        {data.map((movie, index) => (
            <MovieCard key={index} id={movie.id} title={movie.title} img={movie.img} voteAvg={movie.voteAvg} setModalId={setModalId} setIsModalOpen={setIsModalOpen}
            liked={liked} setLiked={setLiked} watched={watched} setWatched={setWatched}/>
        ))}
        {liked.length === 0 && <p>Nothing liked yet!</p>}
        </div>
    </>
    );
}

export default Liked;

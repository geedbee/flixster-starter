import {useState, useEffect, useContext} from 'react';
import MovieCard from './MovieCard';
import {parseMovieDetails, handleSort, getMovieDetails} from '../utils/utils.js';
import { LikedWatchedSearchContext} from "../App.jsx";

function Watched({setModal, setIsModalOpen, isModalOpen, sort}){
    const [data, setData] = useState([]); //what will show in MovieCards
    const watchContext = useContext(LikedWatchedSearchContext);
    const watched = watchContext.watchedList;

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
        const result = await getMovieDetails(modalId);
        setModal(parseMovieDetails(result));
    }

    //sort handling
    useEffect(() => {
        if (sort != 'none'){
            handleSort(sort, data);
        }
    }, [sort]);

    const fetchWatchedData = async () => {
        setData([]);
        let watchedData = [];
        for (let id of watched){
            const result = await getMovieDetails(id);
            watchedData.push(parseMovieDetails(result));
        }
        setData(watchedData);
    }

    return(
    <>
        <div className="movie-card-container">
        {data.map((movie, index) => (
            <MovieCard key={index} id={movie.id} title={movie.title} img={movie.img} voteAvg={movie.voteAvg} setModalId={setModalId} setIsModalOpen={setIsModalOpen}/>
        ))}
        {watched.length === 0 && <p className='error-msg'>Nothing watched yet!</p>}
        </div>
    </>
    );
}

export default Watched;

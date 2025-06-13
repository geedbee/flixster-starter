import {useState, useEffect, useContext} from 'react';
import MovieCard from './MovieCard';
import {parseMovieDetails, handleSort, getMovieDetails} from '../utils/utils.js';
import {LikedWatchedSearchContext} from "../App.jsx"

function Liked({setModal, setIsModalOpen, isModalOpen, sort}){
    const [data, setData] = useState([]); //what will show in MovieCards
    const likeContext = useContext(LikedWatchedSearchContext);
    const liked = likeContext.likedList;

    //dependent on if likedList changes
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
        const result = await getMovieDetails(modalId);
        setModal(parseMovieDetails(result));
    }

    //sort handling
    useEffect(() => {
        if (sort != 'none'){
            setData(handleSort(sort, data));
        }
    }, [sort]);

    const fetchLikedData = async () => {
        setData([]);
        let likedData = [];
        for (let id of liked){
            const result = await getMovieDetails(id);
            likedData.push(parseMovieDetails(result));
        }
        setData(likedData);
    }

    return(
    <>
        <div className="movie-card-container">
        {data.map((movie, index) => (
            <MovieCard key={index} id={movie.id} title={movie.title} img={movie.img} voteAvg={movie.voteAvg} setModalId={setModalId} setIsModalOpen={setIsModalOpen}/>
        ))}
        {liked.length === 0 && <p className='error-msg'>Nothing liked yet!</p>}
        </div>
    </>
    );
}

export default Liked;

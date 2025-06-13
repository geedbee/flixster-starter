import {useState, useEffect, useContext} from 'react';
import MovieCard from './MovieCard';
import {parseMovieDetails, handleSort, getMovieDetails} from '../utils/utils.js';
import {AllContext} from "../App.jsx"
import {Sort} from "../App.jsx"

function Liked({sort}){
    const [data, setData] = useState([]); //what will show in MovieCards
    const context = useContext(AllContext);
    const liked = context.likedList;
    const setModal = context.setModal;
    const setIsModalOpen = context.setIsModalOpen;
    const isModalOpen = context.isModalOpen;

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
        if (sort != Sort.none){
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

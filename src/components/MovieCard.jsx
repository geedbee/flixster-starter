import "../MovieCard.css"
import {useState, useEffect, useContext} from "react";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { MdOutlineStarRate } from "react-icons/md";
import {LikedWatchedContext} from "../App.jsx"

function MovieCard({id, title, img, voteAvg, setModalId, setIsModalOpen}){
    const [isLiked, setIsLiked] = useState(false);
    const [isWatched, setIsWatched] = useState(false);
    const context = useContext(LikedWatchedContext);
    const likedList = context.likedList;
    const setLiked = context.setLikedList;
    const watchedList = context.watchedList;
    const setWatched = context.setWatchedList;

    function HandleLiked(e){
        e.stopPropagation();
        if (likedList && likedList.includes(id)){
            setLiked(likedList.filter(item => item !== id));
            setIsLiked(false);
        }
        else{
            setLiked([...likedList, id]);
            setIsLiked(true);
        }
    }
    function HandleWatched(e){
        e.stopPropagation();
        if (watchedList && watchedList.includes(id)){
            setWatched(watchedList.filter(item => item !== id));
            setIsWatched(false);
        }
        else{
            setWatched([...watchedList, id]);
            setIsWatched(true);
        }
    }

    useEffect(() =>{
        if (likedList && likedList.includes(id)){
            setIsLiked(true);
        }
        else {
            setIsLiked(false);
        }
    }, [likedList, id]);
    useEffect(() =>{
        if (watchedList && watchedList.includes(id)){
            setIsWatched(true);
        }
        else {
            setIsWatched(false);
        }
    }, [watchedList, id]);

    return(
    <div className="movie-card" onClick={() => (setModalId(id), setIsModalOpen(true))}>
        <img className="movie-card-img" src={`https://image.tmdb.org/t/p/w500${img}`} alt={title} />
        <h3 className="movie-card-title">{title}</h3>
        <div className="movie-card-body">
            {<button onClick={HandleLiked} className="like-btn">{isLiked ? <FaHeart className='icon'/> : <FaRegHeart className='icon'/>}</button>}
            <div className='movie-card-rating'>
                <MdOutlineStarRate/>
                <div>
                    {voteAvg}
                </div>
            </div>
            {<button onClick={HandleWatched} className="watch-btn">{isWatched? <FaEye className='icon'/> : <FaRegEye className='icon'/>}</button>}
        </div>
    </div>
    );
}

export default MovieCard;

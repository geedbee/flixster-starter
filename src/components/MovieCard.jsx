import "../MovieCard.css"
import {useState, useEffect} from "react";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { MdOutlineStarRate } from "react-icons/md";

function MovieCard({id, title, img, voteAvg, setModalId, setIsModalOpen, liked, setLiked, watched, setWatched}){
    const [isLiked, setIsLiked] = useState(false);
    const [isWatched, setIsWatched] = useState(false);

    function HandleLiked(e){
        e.stopPropagation();
        if (liked && liked.includes(id)){
            setLiked(liked.filter(item => item !== id));
            setIsLiked(false);
        }
        else{
            setLiked([...liked, id]);
            setIsLiked(true);
        }
    }
    function HandleWatched(e){
        e.stopPropagation();
        if (watched && watched.includes(id)){
            setWatched(watched.filter(item => item !== id));
            setIsWatched(false);
        }
        else{
            setWatched([...watched, id]);
            setIsWatched(true);
        }
    }

    useEffect(() =>{
        if (liked && liked.includes(id)){
            setIsLiked(true);
        }
        else {
            setIsLiked(false);
        }
    }, [liked, id]);
    useEffect(() =>{
        if (watched && watched.includes(id)){
            setIsWatched(true);
        }
        else {
            setIsWatched(false);
        }
    }, [watched, id]);

    return(
    <div className="movie-card" onClick={() => (setModalId(id), setIsModalOpen(true))}>
        <img className="movie-card-img" src={`https://image.tmdb.org/t/p/w500${img}`} alt={title} />
        <h3 className="movie-card-title">{title}</h3>
        <div className="movie-card-body">
            {isLiked ? <button onClick={HandleLiked} className="like-btn"><FaHeart/></button>
            : <button onClick={HandleLiked} className="like-btn"><FaRegHeart/></button>}
            <p><MdOutlineStarRate/>{voteAvg}</p>
            {isWatched ? <button onClick={HandleWatched} className="like-btn"><FaEye/></button>
            : <button onClick={HandleWatched} className="like-btn"><FaRegEye/></button>}
        </div>
    </div>
    );
}

export default MovieCard;

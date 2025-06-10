import "../MovieCard.css"

function MovieCard({id, title, img, voteAvg, setModalId, setIsModalOpen}){
    return(
    <div className="movie-card" onClick={() => (console.log("open modal"),setModalId(id), setIsModalOpen(true))}>
        <img className="movie-card-img" src={`https://image.tmdb.org/t/p/w500${img}`} alt={title} />
        <p>{title}</p>
        <p>{voteAvg}</p>
    </div>
    );
}

export default MovieCard;

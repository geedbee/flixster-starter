import "../MovieCard.css"

function MovieCard({title, img, voteAvg}){
    return(
    <div className="movie-card">
        <p>{title}</p>
        <img src={`https://image.tmdb.org/t/p/w92${img}`} alt={title} />
        <p>{voteAvg}</p>
    </div>
    );
}

export default MovieCard;

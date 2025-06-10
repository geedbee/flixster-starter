import {useState, useEffect} from 'react';
import { parseMovieData , parseMovieDetails} from '../utils/utils';
import MovieCard from './MovieCard';

function NewMovieList({setModal, setIsModalOpen, isModalOpen}){
    const [data, setData] = useState([]);
    const [pageIdx, setPageIdx] = useState(1);

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
        console.log(result);
        console.log(parseMovieDetails(result));
        setModal(parseMovieDetails(result));
    }

    //fetching data
    const fetchData = async () => {
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
        const result = await response.json();
        setData([...data, ...parseMovieData(result.results)]);
    }
    useEffect(() => {
        fetchData();
    }, [pageIdx]);

    //load more
    function HandleLoadMore(){
        console.log('Load more');
        setPageIdx(pageIdx + 1);
        fetchData();
    }

    return(
    <>
        <div className="movie-card-container">
        {data.map((movie, index) => (
            <MovieCard key={index} id={movie.id} title={movie.title} img={movie.img} voteAvg={movie.voteAvg} setModalId={setModalId} setIsModalOpen={setIsModalOpen}/>
        ))}
        </div>
        <button onClick={HandleLoadMore}>Load More</button>
    </>
    );
}

export default NewMovieList;

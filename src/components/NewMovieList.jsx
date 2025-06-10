import {useState, useEffect} from 'react';
import { parseMovieData , parseMovieDetails, compareDates} from '../utils/utils';
import MovieCard from './MovieCard';

function NewMovieList({setModal, setIsModalOpen, isModalOpen, sort}){
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

    //sort handling
    useEffect(() => {
        if (sort != 'none'){
            let dataCpy = [...data];
            if (sort === 'name'){
                console.log('Sorting by name');
                setData(dataCpy.sort((a, b) => a.title.localeCompare(b.title)));
            }
            else if (sort === 'votes'){
                console.log('Sorting by votes');
                setData(dataCpy.sort((a, b) => b.voteAvg - a.voteAvg));
            }
            else if (sort === 'dates'){
                console.log('Sorting by dates');
                console.log(dataCpy);
                setData(dataCpy.sort((a, b) => compareDates(a.releaseDate, b.releaseDate)));
            }
        }
    }, [sort]);

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

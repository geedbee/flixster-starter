import {useState, useEffect} from 'react';
import { parseMovieData , parseMovieDetails, compareDates} from '../utils/utils';
import MovieCard from './MovieCard';

function Search({setModal, setIsModalOpen, isModalOpen, sort, data, setData, newMovieData}){
    const [search, setSearch] = useState('');
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

    //fetch handling
    const fetchData = async (isNewSearch) => {
        const apiKey = import.meta.env.VITE_API_KEY;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${apiKey}`
            }
          };
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false&language=en-US&page=${pageIdx}`, options);
        if (!response.ok) {
            throw new Error('Failed to fetch search data');
        }
        const result = await response.json();
        if (isNewSearch) {
            setData(parseMovieData(result.results));
        }
        else{
            setData([...data, ...parseMovieData(result.results)]);
        }
    }

    useEffect(() => {
        if (search) {
            fetchData(false);
        }
    }, [pageIdx]);

    function HandleLoadMore(){
        setPageIdx(pageIdx + 1);
        fetchData(false);
    }

    function HandleSearch(event){
        console.log('searching');
        event.preventDefault();
        fetchData(true);
    }

    function HandleSearchChange(event){
        setSearch(event.target.value);
    }

    function ClearData(event){
        event.preventDefault();
        setData(newMovieData);
        setSearch('');
        setPageIdx(1);
    }

    return(
    <>
        <form onSubmit={HandleSearch}>
            <input type="text" name="search" value={search} onChange={HandleSearchChange} placeholder="search"/>
            <button type="submit">Search</button>
            <button onClick={ClearData} >Clear</button>
        </form>
        <div className="movie-card-container">
        {data.map((movie, index) => (
            <MovieCard key={index} id={movie.id} title={movie.title} img={movie.img} voteAvg={movie.voteAvg} setModalId={setModalId} setIsModalOpen={setIsModalOpen}/>
        ))}
        </div>
        <button onClick={HandleLoadMore}>Load More</button>
    </>
    );
}

export default Search

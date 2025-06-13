import "../Modal.css"
import {convertRuntime, convertReleaseDate} from "../utils/utils.js"
import {useState, useEffect} from "react";
import { RxCross1 } from "react-icons/rx";

function Modal({modalInfo, setModal, setIsModalOpen}){
    const [trailerKey, setTrailerKey] = useState(null);

    async function fetchTrailer(){
        const apiKey = import.meta.env.VITE_API_KEY;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${apiKey}`
            }
        };
        const response = await fetch(`https://api.themoviedb.org/3/movie/${modalInfo.id}/videos?language=en-US`, options);
        const result = await response.json();
        const trailer = result.results.find(video => video.type === 'Trailer');
        setTrailerKey(trailer.key || null);
    }

    useEffect(() => {
        fetchTrailer();
    }, [modalInfo.id]);

    return(
        <div className='modal'>
            <div className='modal-content'>
                <div className='modal-body'>
                    <img className='modal-image' src={`https://image.tmdb.org/t/p/w780${modalInfo.img}`} alt={modalInfo.title} />
                    <div className='modal-info'>
                        <button className='close-modal' onClick={() => (setModal(null), setIsModalOpen(false))}><RxCross1 /></button>
                        <h2>{modalInfo.title}</h2>
                        <p>{modalInfo.overview}</p>
                        <p>Runtime: {convertRuntime(modalInfo.runtime)}</p>
                        <p>Release Date: {convertReleaseDate(modalInfo.releaseDate)}</p>
                        <ul>Genres:
                            {modalInfo.genres.map((genre, _) => <li key={genre}>{genre}</li>)}
                        </ul>
                        {trailerKey && <iframe width="560" height="315" src={`https://www.youtube.com/embed/${trailerKey}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ></iframe>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;

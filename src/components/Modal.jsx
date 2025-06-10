import "../Modal.css"
import {convertRuntime, convertReleaseDate} from "../utils/utils.js"
function Modal({modalInfo, setModal, setIsModalOpen}){
    return(
        <div className='modal'>
            <div className='modal-content'>
                <div className='modal-body'>
                <img className='modal-image' src={`https://image.tmdb.org/t/p/w780${modalInfo.img}`} alt={modalInfo.title} />
                    <div className='modal-info'>
                        <h2>{modalInfo.title}</h2>
                        <p>{modalInfo.overview}</p>
                        <p>Runtime: {convertRuntime(modalInfo.runtime)}</p>
                        <p>Release Date: {convertReleaseDate(modalInfo.releaseDate)}</p>
                        <ul>Genres:
                            {modalInfo.genres.map((genre, _) => <li key={genre}>{genre}</li>)}
                        </ul>
                    </div>
                </div>
                <button className='close-modal' onClick={() => (setModal(null), setIsModalOpen(false))}>Close</button>
            </div>
        </div>
    );
}

export default Modal;

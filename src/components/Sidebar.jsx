import { IoMenuSharp } from "react-icons/io5";
import { useState } from "react";
import '../Sidebar.css'

function Sidebar({pageIdx, setPageIdx}){
    const [isOpen, setIsOpen] = useState(false);

    function OpenMenu(){
        setIsOpen(true);
    }
    function HandleClick(idx){
        if (pageIdx !== idx){
            setPageIdx(idx);
        }
    }
    return (
    <>
        <div className='sidebar-container'>
            <button onClick={OpenMenu}><IoMenuSharp/></button>
            {isOpen && <div className='sidebar-body'>
                <button onClick={() => HandleClick(0)}>Home</button>
                <button onClick={() => HandleClick(1)}>Liked</button>
                <button onClick={() => HandleClick(2)}>Watched</button>
            </div>}
        </div>
    </>);
}

export default Sidebar;

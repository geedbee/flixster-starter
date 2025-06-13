import { IoMenuSharp } from "react-icons/io5";
import { useState } from "react";
import '../Sidebar.css'
import {Page} from "../App"

function Sidebar({pageIdx, setPageIdx}){
    const [isOpen, setIsOpen] = useState(false);

    function OpenMenu(){
        setIsOpen(!isOpen);
    }
    function HandleClick(idx){
        if (pageIdx !== idx){
            setPageIdx(idx);
        }
    }
    return (
    <>
        <div className='sidebar-container'>
            <button className='sidebar-menu-btn' onClick={OpenMenu}><IoMenuSharp/></button>
            {isOpen && <div className='sidebar-body'>
                <button onClick={() => HandleClick(Page.Home)}>Home</button>
                <button onClick={() => HandleClick(Page.Liked)}>Liked</button>
                <button onClick={() => HandleClick(Page.Watched)}>Watched</button>
            </div>}
        </div>
    </>);
}

export default Sidebar;

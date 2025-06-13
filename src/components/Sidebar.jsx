import { IoMenuSharp } from "react-icons/io5";
import { useState } from "react";
import '../Sidebar.css'
import {Page} from "../App.jsx"

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
        <nav className='sidebar-container'>
            <button className='sidebar-menu-btn' onClick={OpenMenu}><IoMenuSharp/></button>
            {isOpen && <div className='sidebar-body'>
                {pageIdx === Page.Home ? <button className='sidebar-dropdown blue' onClick={() => HandleClick(Page.Home)}>Home</button> :
                <button className='sidebar-dropdown' onClick={() => HandleClick(Page.Home)}>Home</button>}
                {pageIdx === Page.Liked ? <button className='sidebar-dropdown blue' onClick={() => HandleClick(Page.Liked)}>Liked</button> :
                <button className='sidebar-dropdown' onClick={() => HandleClick(Page.Liked)}>Liked</button>}
                {pageIdx === Page.Watched ? <button className='sidebar-dropdown blue' onClick={() => HandleClick(Page.Watched)}>Watched</button> :
                <button className='sidebar-dropdown' onClick={() => HandleClick(Page.Watched)}>Watched</button>}
            </div>}
        </nav>
    </>);
}

export default Sidebar;

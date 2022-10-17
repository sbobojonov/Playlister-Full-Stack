import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { song, index } = props;
    const [isDragging, setIsDragging] = useState(false);
    const [draggedTo, setDraggedTo] = useState(false);

    const handleDragStart = (event) => {
        event.dataTransfer.setData("song", event.target.id);
        setIsDragging(true);
    }
    const handleDragOver = (event) => {
        event.preventDefault();
        setDraggedTo(true);
    }
    const handleDragEnter = (event) => {
        event.preventDefault();
        setDraggedTo(true);
    }
    const handleDragLeave = (event) => {
        event.preventDefault();
        setDraggedTo(false);
    }
    const handleDrop = (event) => {
        event.preventDefault();

        let targetIndex = event.target.id;
        targetIndex = targetIndex.split('-')[1];
        let sourceIndex = event.dataTransfer.getData("song");
        sourceIndex = sourceIndex.split('-')[1];

        setIsDragging(false);
        setDraggedTo(false);

        store.addMoveSongTransaction(sourceIndex, targetIndex);
    }
    
    const handleRemoveSong = (event) => {
        event.stopPropagation();
        store.markSongForRemoval(index);
    }

    const handleEditSong = (event) => {
        event.stopPropagation();
        store.markSongForEdit(index);
    }

    let cardClass = "list-card unselected-list-card";
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDoubleClick={handleEditSong}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                value={"\u2715"}
                onClick={handleRemoveSong}
            />
        </div>
    );
}

export default SongCard;
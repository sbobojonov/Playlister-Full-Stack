import React, { useContext, useState, useEffect } from 'react';
import { GlobalStoreContext } from '../store';

function EditSongModal() {
  const { store } = useContext(GlobalStoreContext);
  const [song, setSong] = useState(null);
  
  const handleUpdateTitle = (event) => {
    setSong(
        { title: event.target.value, artist: song.artist, youTubeId: song.youTubeId }
      );
  }

  const handleUpdateArtist = (event) => {
    setSong(
        { title: song.title, artist: event.target.value, youTubeId: song.youTubeId }
      );
  }

  const handleUpdateYtId = (event) => {
    setSong(
        { title: song.title, artist: song.artist, youTubeId: event.target.value }
      );
  }

  const handleEditSong = () => {
    store.addEditSongTransaction(song);
    setSong(null);
    hideEditSongModal()
  };

  const hideEditSongModal = () => {
    store.closeModal();
  }

  useEffect(() => {
    setSong(
      (store.markedSong !== null) ? store.currentList.songs[store.markedSong] : null
    );
  }, [store.markedSong, store.currentList]);
  
  useEffect(() => {
    console.log("changing song..." + ((song !== null) ? song.title : null));
  }, [song]);

  return (
      <div className={store.modalActive === 'edit-song' ? 'modal is-visible' : 'modal'} id='edit-song-modal' data-animation='slideInOutLeft'>
        <div className="modal-root" id='verify-edit-song-root'>
          <div className="modal-north">
              Edit Song
          </div>
          <div id="edit-song-modal-content" className="modal-center">
              <div id="title-prompt" className="modal-prompt">Title:</div>
              <input id="edit-song-modal-title-textfield" className='modal-textfield' type="text" value={song != null ? song.title : ""} onChange={handleUpdateTitle}/>
              <div id="artist-prompt" className="modal-prompt">Artist:</div>
              <input id="edit-song-modal-artist-textfield" className='modal-textfield' type="text" value={song != null ? song.artist : ""} onChange={handleUpdateArtist}/>
              <div id="you-tube-id-prompt" className="modal-prompt">YouTube Id:</div>
              <input id="edit-song-modal-youTubeId-textfield" className='modal-textfield' type="text" value={song != null ? song.youTubeId : ""} onChange={handleUpdateYtId}/>
          </div>
          <div className="modal-south">
              <input type="button" 
                  id="edit-song-confirm-button" 
                  className="modal-button" 
                  onClick={handleEditSong}
                  value='Confirm' />
              <input type="button" 
                  id="edit-song-cancel-button" 
                  className="modal-button" 
                  onClick={hideEditSongModal}
                  value='Cancel' />
          </div>
      </div>
      </div>
  );
}

export default EditSongModal;
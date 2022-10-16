import React, { useContext, useState, useEffect } from 'react';
import { GlobalStoreContext } from '../store';

function RemoveSongModal() {
  const { store } = useContext(GlobalStoreContext);
  const [songName, setSongName] = useState('');

  const handleRemoveSong = () => {
    store.addRemoveSongTransaction();
    hideRemoveSongModal()
  };

  const hideRemoveSongModal = () => {
    store.closeModal();
  }

  useEffect(() => {
    setSongName(
      (store.markedSong !== null) ? store.currentList.songs[store.markedSong].title : ''
    );
  }, [store.markedSong]);
  
  return (
      <div className={store.modalActive === 'remove-song' ? 'modal is-visible' : 'modal'} id='remove-song-modal' data-animation='slideInOutLeft'>
        <div className='modal-root' id='verify-remove-song-root'>
          <div className='modal-north'>Remove Song?</div>
          <div className='modal-center'>
            <div className='modal-center-content'>
              Are you sure you wish to permanently remove the <span style={{fontWeight: 'bold'}}> {songName} </span> song?
            </div>
          </div>
          <div className='modal-south'>
            <input
              type='button'
              id='remove-song-confirm-button'
              className='modal-button'
              value='Confirm'
              onClick={handleRemoveSong}
            />
            <input
              type='button'
              id='remove-song-cancel-button'
              className='modal-button'
              value='Cancel'
              onClick={hideRemoveSongModal}
            />
          </div>
        </div>
      </div>
  );
}

export default RemoveSongModal;
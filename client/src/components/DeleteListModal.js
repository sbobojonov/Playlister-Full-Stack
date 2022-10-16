import React, { useContext, useState, useEffect } from 'react';
import { GlobalStoreContext } from '../store';

function DeleteListModal() {
  const { store } = useContext(GlobalStoreContext);
  const [playlistName, setPlaylistName] = useState('');

  const handleDeleteList = () => {
    store.deleteList();
    hideDeleteListModal()
  };

  const hideDeleteListModal = () => {
    store.closeModal();
  }

  useEffect(() => {
    setPlaylistName(
      (store.listToDelete !== null) ? store.getPlaylistById(store.listToDelete) : ''
    );
  }, [store.listToDelete]);
  
  return (
      <div className={store.modalActive === 'delete-list' ? 'modal is-visible' : 'modal'} id='delete-list-modal' data-animation='slideInOutLeft'>
        <div className='modal-root' id='verify-delete-list-root'>
          <div className='modal-north'>Delete playlist?</div>
          <div className='modal-center'>
            <div className='modal-center-content'>
              Are you sure you wish to permanently delete the <span style={{fontWeight: 'bold'}}> {playlistName} </span> playlist?
            </div>
          </div>
          <div className='modal-south'>
            <input
              type='button'
              id='delete-list-confirm-button'
              className='modal-button'
              value='Confirm'
              onClick={handleDeleteList}
            />
            <input
              type='button'
              id='delete-list-cancel-button'
              className='modal-button'
              value='Cancel'
              onClick={hideDeleteListModal}
            />
          </div>
        </div>
      </div>
  );
}

export default DeleteListModal;
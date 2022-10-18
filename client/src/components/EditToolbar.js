import { useContext , useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();
    const [editStatus, setEditStatus] = useState(false);
    const [undoStatus, setUndoStatus] = useState(false);
    const [redoStatus, setRedoStatus] = useState(false);


    let enabledButtonClass = "playlister-button";

    function handleAddSong(event) {
        store.addNewSong();
    }

    function handleUndo() {
        store.undo();
    }
    
    function handleRedo() {
        store.redo();
    }
    
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }

    // THIS FUNCTION SETS THE STATE FOR EDITING, UNDOING, AND REDOING
    useEffect(() => {
        if (store.currentList === null || store.modalActive !== false) {
            setEditStatus(false);
            setUndoStatus(false);
            setRedoStatus(false);
        } else {
            setEditStatus(true);
            setUndoStatus(store.hasUndo());
            setRedoStatus(store.hasRedo());
        }
    }, [store.currentList, store.modalActive]);
    
    // THIS FUNCTION DETECTS CTRL+Z AND CTRL+Y COMBINATIONS
    useEffect(() => {    
        function handleKeyDown(e) {
            if ((e.ctrlKey || e.metaKey ) && e.key === 'z' && undoStatus) {
                handleUndo();
            } else if ((e.ctrlKey || e.metaKey ) && e.key === 'y' && redoStatus) {
                handleRedo();
            }
        }
    
        document.addEventListener('keydown', handleKeyDown);
        
        return () => {
          document.removeEventListener('keydown', handleKeyDown); //cleanup
        }
      }, [undoStatus, redoStatus]);

    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                disabled={!editStatus}
                value="+"
                className={enabledButtonClass}
                onClick={handleAddSong}
            />
            <input
                type="button"
                id='undo-button'
                disabled={!undoStatus}
                value="⟲"
                className={enabledButtonClass}
                onClick={handleUndo}
            />
            <input
                type="button"
                id='redo-button'
                disabled={!redoStatus}
                value="⟳"
                className={enabledButtonClass}
                onClick={handleRedo}
            />
            <input
                type="button"
                id='close-button'
                disabled={!editStatus}
                value="&#x2715;"
                className={enabledButtonClass}
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;
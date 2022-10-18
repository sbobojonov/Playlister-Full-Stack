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
    const [editStatus, setEditStatus] = useState(true);

    let enabledButtonClass = "playlister-button";

    function handleAddSong(event) {
        store.addNewSong();
    }

    function handleUndo() {
        console.log("undoing");
        store.undo();
    }
    
    function handleRedo() {
        console.log("redoing");
        store.redo();
    }
    
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }

    useEffect(() => {
        if (store.currentList === null || store.modalActive !== false) {
            setEditStatus(true);
        } else {
            setEditStatus(false);
        }
    }, [store.currentList, store.modalActive]);
    
    
    let undoStatus = store.hasUndo() && (store.modalActive === false);
    let redoStatus = store.hasRedo() && (store.modalActive === false);

    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                disabled={editStatus}
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
                disabled={editStatus}
                value="&#x2715;"
                className={enabledButtonClass}
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;
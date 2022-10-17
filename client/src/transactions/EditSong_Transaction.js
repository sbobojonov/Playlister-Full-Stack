import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * EditSong_Transaction
 * 
 * This class represents a transaction that edits a song. It will be managed by the transaction stack.
 * 
 * @author Shahrizod Bobojonov
 */
export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(store, index, initSong, editedSong) {
        super();
        this.store = store;
        this.index = index;
        this.initSong = initSong;
        this.editedSong = editedSong;
    }

    doTransaction() {
        this.store.editSong(this.index, this.editedSong);
    }
    
    undoTransaction() {
        this.store.editSong(this.index, this.initSong);
    }
}
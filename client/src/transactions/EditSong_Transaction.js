import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * EditSong_Transaction
 * 
 * This class represents a transaction that edits a song. It will be managed by the transaction stack.
 * 
 * @author Shahrizod Bobojonov
 */
export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(initApp, id, initSong, editedSong) {
        super();
        this.app = initApp;
        this.id = id;
        this.initSong = initSong;
        this.editedSong = editedSong;
    }

    doTransaction() {
        this.app.editSong(this.id, this.editedSong);
    }
    
    undoTransaction() {
        this.app.editSong(this.id, this.initSong);
    }
}
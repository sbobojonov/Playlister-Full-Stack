import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * RemoveSong_Transaction
 * 
 * This class represents a transaction that removes a song. It will be managed by the transaction stack.
 * 
 * @author Shahrizod Bobojonov
 */
export default class RemoveSong_Transaction extends jsTPS_Transaction {
    constructor(store, index, song) {
        super();
        this.store = store;
        this.index = index;
        this.song = song;
    }

    doTransaction() {
        this.store.removeSong(this.index);
    }
    
    undoTransaction() {
        this.store.addBackSong(this.index-1, this.song);
    }
}
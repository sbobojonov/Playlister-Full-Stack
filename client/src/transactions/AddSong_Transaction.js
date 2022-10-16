import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * AddSong_Transaction
 * 
 * This class represents a transaction that adds a song. It will be managed by the transaction stack.
 * 
 * @author Shahrizod Bobojonov
 */
export default class AddSong_Transaction extends jsTPS_Transaction {
    constructor(store, index) {
        super();
        this.store = store;
        this.index = index;
    }

    doTransaction() {
        this.store.addSong({title: "Untitled", artist: "Unknown", youTubeId: "dQw4w9WgXcQ"});
    }
    
    undoTransaction() {
        this.store.removeSong(this.index);
    }
}
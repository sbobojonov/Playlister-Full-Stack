import { createContext, useEffect, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import AddSong_Transaction from '../transactions/AddSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import EditSong_Transaction from '../transactions/EditSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'

export const GlobalStoreContext = createContext({});

/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_MODAL: "SET_MODAL",
    MARK_SONG: "MARK_SONG"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        modalActive: false,
        listToDelete: null,
        markedSong: null
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    modalActive: false,
                    listToDelete: null,
                    markedSong: null
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    modalActive: false,
                    listToDelete: null,
                    markedSong: null
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    modalActive: false,
                    listToDelete: null,
                    markedSong: null
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    modalActive: false,
                    listToDelete: null,
                    markedSong: null
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    modalActive: false,
                    listToDelete: null,
                    markedSong: null
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    modalActive: false,
                    listToDelete: null,
                    markedSong: null
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    modalActive: payload.modal,
                    listToDelete: payload.id,
                    markedSong: null
                });
            }
            // TOGGLE THE DELETE MODAL
            case GlobalStoreActionType.SET_MODAL: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    modalActive: payload,
                    listToDelete: null,
                    markedSong: null
                });
            }
            // MARK A SONG
            case GlobalStoreActionType.MARK_SONG: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    modalActive: payload.modal,
                    listToDelete: null,
                    markedSong: payload.index
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if (playlist.name === newName) {return} //check if name was changed, return if not
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    store.createNewList = function () {
        async function asyncCreateNewList() {
            let response = await api.createPlaylist({ "name": "Untitled", "songs":[] });
            console.log(response);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: playlist
                });
                store.history.push("/playlist/" + playlist._id);
            } else {
                console.log("Error creating new list");
            }
        }
        asyncCreateNewList();
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        tps.clearAllTransactions();
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    store.hasUndo = function () {
        return tps.hasTransactionToUndo();
    }

    store.hasRedo = function () {
        return tps.hasTransactionToRedo();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.openModal = function (modal) {
        storeReducer({
            type: GlobalStoreActionType.SET_MODAL,
            payload: modal
        });
    }

    // THIS FUNCTION CLOSES THE MODAL
    store.closeModal = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_MODAL,
            payload: false
        });
    }

    // THIS FUNCTION ENABLES THE PROCESS OF DELETING A LIST
    store.markListForDeletion = function (id) {
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: { 
                id : id, 
                idNamePairs: store.idNamePairs,
                modal: "delete-list" 
            }
        });

    }

    // THIS FUNCTION TAKES IN AN ID AND RETURNS THE PLAYLIST NAME
    store.getPlaylistById = function (id) {
        return store.idNamePairs.find(pair => pair._id === id).name;
    }

    //THIS FUNCTION DELETES A LIST
    store.deleteList = function () {
        async function asyncDeleteList() {
            let response = await api.deletePlaylistById(store.listToDelete);
            if (response.data.success) {
                let playlist = response.data.playlist;
                async function getListPairs() {
                    response = await api.getPlaylistPairs();
                    if (response.data.success) {
                        let pairsArray = response.data.idNamePairs;
                        storeReducer({
                            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                            payload: { 
                                id : null, 
                                idNamePairs: pairsArray,
                                modal : null 
                            }
                        });   
                    }
                }
                getListPairs(playlist);
                return playlist;           
            }
        }
        asyncDeleteList();
    }

    store.addNewSong = function () {
        let transaction = new AddSong_Transaction(store, store.getPlaylistSize());
        tps.addTransaction(transaction);
    }

    // THIS FUNCTION ADDS A SONG TO THE CURRENTLY LOADED LIST
    store.addSong = function (song) {
        store.currentList.songs.push(song);
        async function asyncAddSong() {
            let response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
            }
        }
        asyncAddSong();
    }

    store.markSongForRemoval = function (index) {
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG,
            payload: { 
                index: index, 
                idNamePairs: store.idNamePairs,
                modal: "remove-song"
            }
        });
    }

    store.addRemoveSongTransaction = function () {
        let transaction = new RemoveSong_Transaction(store, store.markedSong, store.currentList.songs[store.markedSong]);
        tps.addTransaction(transaction);
    }

    // THIS FUNCTION REMOVES A SONG FROM THE CURRENTLY LOADED LIST
    store.removeSong = function (index) {
        store.currentList.songs.splice(index, 1);
        async function asyncRemoveSong() {
            let response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
            }
        }
        asyncRemoveSong();
    }

    store.addBackSong = function (index, song) {
        store.currentList.songs.splice(index, 0, song);
        async function asyncAddBackTransaction() {
            let response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
            }
        }
        asyncAddBackTransaction();
    }

    store.markSongForEdit = function (index) {
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG,
            payload: {
                index: index,
                idNamePairs: store.idNamePairs,
                modal: "edit-song"
            }
        });
    }

    store.addEditSongTransaction = function (editedSong) {
        let transaction = new EditSong_Transaction(store, store.markedSong, store.currentList.songs[store.markedSong], editedSong);
        tps.addTransaction(transaction);
    }

    store.editSong = function (index, editedSong) {
        store.currentList.songs[index] = editedSong;
        async function asyncEditSong() {
            let response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
            }
        }
        asyncEditSong();
    }

    store.addMoveSongTransaction = function (sourceIndex, targetIndex) {
        console.log("transacting...")
        let transaction = new MoveSong_Transaction(store, sourceIndex, targetIndex);
        tps.addTransaction(transaction);
    }

    store.moveSong = function (oldIndex, newIndex) {
        let editedList = store.currentList.songs
        let song = editedList[oldIndex]
        editedList.splice(oldIndex, 1);
        editedList.splice(newIndex, 0, song);
        console.log(editedList);
        store.currentList.songs = editedList;

        async function asyncMoveSong() {
            let response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
            }
        }
        asyncMoveSong();
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}
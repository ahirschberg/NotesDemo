define(function () {
    "use strict";
    var notes_store = JSON.parse(localStorage.getItem('notes_store'));
    if (!notes_store) {
        console.warn('notes_store could not be retrieved from localStorage, defaulting to [].');
        notes_store = [];
        localStorage.setItem('notes_store', JSON.stringify(notes_store));
    }
    notes_store = notes_store.notesdemo_compact(); // notesdemo_compact is a custom function we added earlier, prefixed with notesdemo to avoid namespace collision.
    
    var write_store = function () {
        localStorage.setItem('notes_store', JSON.stringify(notes_store));
    },
        id_rxp = /note_(\d+)/;
    return {
        add_note: function (note_obj) {
            var index = notes_store.length;
            notes_store[index] = note_obj;
            write_store();
            
            return index;
        },
        retrieve_note: function (index) {
            return notes_store[index];
        },
        delete_note: function (index) {
            delete notes_store[index];
            write_store();
        },
        update_note: function (index, new_note_obj) {
            notes_store[index] = new_note_obj;
            write_store();
        },
        get_index_from_id: function (id) {
            var match = id_rxp.exec(id);
            return parseInt(match[1], 10);
        },
        notes_store: notes_store
    };
});
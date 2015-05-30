define(function () {
    // TODO move this elsewhere
    Array.prototype.compact = function() { // add a compact() function to array that removes falsy values
      for (var i = 0; i < this.length; i++) {
        if (!this[i]) {         
          this.splice(i, 1);
          i--;
        }
      }
      return this;
    };


    var notes_store = JSON.parse(localStorage.getItem('notes_store'));
    
    if (!notes_store) {
        console.warn('notes_store could not be retrieved from localStorage, defaulting to [].');
        notes_store = [];
        localStorage.setItem('notes_store', JSON.stringify(notes_store));
    }
    notes_store = notes_store.compact(); // compact is a custom function we added earlier
    
    var write_store = function () {
        localStorage.setItem('notes_store', JSON.stringify(notes_store));
    }
    var id_rxp = /note_(\d+)/;
    
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
            return parseInt(match[1]);
        },
        notes_store: notes_store
    };
});
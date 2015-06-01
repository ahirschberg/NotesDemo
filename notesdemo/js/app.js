var NOTESDEMO = {};
require.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    //Also, bind the jQuery library to path 'jquery',  
    //as this fixes some issue with mixing
    //jQuery and require.js
    paths: {
        jquery: 'jquery-2.1.4.min',
        app: '../app'
    }
});

require(
    ['jquery', 'app/notes_storage_manager', 'app/notes_ui_manager_init'],
    function ($, notes_storage, notes_ui_manager_init) {
        'use strict';
        $(document).ready(function () {
            var notes_ui = notes_ui_manager_init(notes_storage),
                notes_store = notes_storage.notes_store;
            
            Object.keys(notes_store).forEach(function (key) {
                notes_ui.note_disp.append_note_to_list(notes_store[key], key);
            });

            var submit_func = notes_ui.note_add_input
                .create_note_submit_onclick(notes_ui);
            $('.submit_note').click(function () {
                submit_func.apply(this, arguments);
            });
        });
    }
);

// add a compact function to Array that removes falsy values,
// and prefix with 'notesdemo_' to avoid namespace conflict
Array.prototype.notesdemo_compact = function () {
    'use strict';
    for (var i = 0; i < this.length; i++) {
        if (!this[i]) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};
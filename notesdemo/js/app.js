'use strict'

require.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        jquery: 'jquery-2.1.4.min',
        app: '../app'
    }
});

require(
 ['jquery', 'app/notes_storage_manager', 'app/notes_ui_manager_init'],
 function ($, notes_storage, notes_ui_manager_init) {

    $(document).ready(function () {  
        console.log('document is ready!');
        var notes_ui = notes_ui_manager_init({notes_storage_mgr: notes_storage});

        var notes_store = notes_storage.notes_store;
        Object.keys(notes_store).forEach (function (key) {
            notes_ui.note_disp.append_note_to_list(notes_store[key], key);
        });

        var submit_func = notes_ui.note_add_input
            .create_note_submit_onclick(notes_ui);
        $('.submit_note').click(function () {
            submit_func.apply(this, arguments)
        });
    });
});

// ideally this would not be a global function, but oh well...
function debug_add_notes(n) {
    for (var i = 1; i <= n; i++) {
        NOTESDEMO.notes_ui_manager.new_note({title: ('generated note ' + i), body: ('I can do it! I can do it ' + i + ' times!')});
    }
}
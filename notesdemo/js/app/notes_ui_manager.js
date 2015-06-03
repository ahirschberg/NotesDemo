define(
    ['app/add_note_ui', 'app/generate_notes_view', 'app/notes_storage_manager'],
    function (add_note_ui, generate_notes_view, notes_storage_mgr) {
        "use strict";
        var ui_handlers = {
            note_add_input: add_note_ui,
            notes_view: generate_notes_view,
            new_note: function (note_obj) {
                var index = notes_storage_mgr.add_note(note_obj);
                this.notes_view.append_note_to_list(note_obj, index);
            }
        };

        // Debug function to add a set amount of notes
        NOTESDEMO.add_notes = function (n) {
            for (var i = 1; i <= n; i++) {
                ui_handlers.new_note({
                    title: ('generated note ' + i),
                    body: ('I can do it! I can do it ' + i + ' times!')
                });
            }
        };

        return ui_handlers;
    }
);
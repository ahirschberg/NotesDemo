define(
    ['app/add_note_ui', 'app/edit_note_ui', 'app/disp_note_ui_init'],
 function (add_note_ui, edit_note_ui, disp_note_ui_init) {
    return function (args) {
        var notes_storage_mgr = args.notes_storage_mgr;

        var ui_handlers = {
            note_add_input:  add_note_ui,
            note_edit_input: edit_note_ui,
            note_disp:       disp_note_ui_init({note_edit: edit_note_ui, note_storage: notes_storage_mgr}),
            
            new_note: function (note_obj) {
                var index = notes_storage_mgr.add_note(note_obj);
                this.note_disp.append_note_to_list(note_obj, index);
            }
        };

        return ui_handlers;
    };
});
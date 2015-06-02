define(['jquery', 'app/ui_validate_init'], function ($, ui_validate_init) {
    "use strict"; 
    var input_validate = ui_validate_init({
        title_input: '.note_title_edit',
        body_input: '.note_body_edit'
    });
    var remove_edit_ui = function () {
        $('.edit_note').each(function () {
            $(this).parent().children().show();
            $(this).remove();
        });
    };
    var create_note_edit_submit_onclick = function (index, notes_storage_mgr, notes_disp_ui) {
        return function () {
            var note_obj = input_validate.get_note_obj_from_inputs();
            if (!note_obj.isBlank()) {
                notes_storage_mgr.update_note(index, note_obj);
                notes_disp_ui.update_note_in_list({
                    note_index: index,
                    note: note_obj
                });
                remove_edit_ui();
            } else {
                alert('Please fill out a note!');
            }
        };
    };
    
    return {
        create_note_edit_onclick: function (notes_storage_mgr, notes_disp_ui) {
            return function () {
                remove_edit_ui(); // only allow the user to edit one note at a time
                var $note_element = $(this).parent(),
                    note_index = notes_storage_mgr.get_index_from_id($note_element.attr('id')),
                    note_obj = notes_storage_mgr.retrieve_note(note_index),
                    $edit_div = $('<div class="edit_note"/>');
                
                $('<input type="text" class="note_input note_title_edit">')
                    .val(note_obj.title)
                    .appendTo($edit_div);
                $('<textarea class="note_input note_body_edit"/>')
                    .val(note_obj.body)
                    .appendTo($edit_div);
                $edit_div.append('<br/>');
                $('<button class="submit_note_edit">Done</button>')
                    .click(create_note_edit_submit_onclick(note_index, notes_storage_mgr, notes_disp_ui))
                    .appendTo($edit_div);
                $('<button class="">Cancel</button>')
                    .click(remove_edit_ui)
                    .appendTo($edit_div);

                $note_element.children().hide();
                $edit_div.appendTo($note_element);
            };
        }
    };
});
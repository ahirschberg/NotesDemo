define(['jquery', 'app/ui_validate_init'], function ($, ui_validate_init) {
    "use strict";    
    // ASK kevin what he thinks about this
    var toggle_note_input = function () {        
        var $input_area = $('.note_input_section');
        $input_area.toggle();
        update_new_note_button($input_area.css('display') != 'none');
    };
    var update_new_note_button = function (visible) {
        if (visible) {
            $('.toggle_note_input i').removeClass('fa-plus-circle');
            $('.toggle_note_input i').addClass('fa-minus-circle');
        } else {
            $('.toggle_note_input i').removeClass('fa-minus-circle');
            $('.toggle_note_input i').addClass('fa-plus-circle');
        }
    };
    
    // set up add note event
    $('.toggle_note_input').click(function () {
        toggle_note_input();
    });
    
    var input_validate = ui_validate_init({title_input: '.note_title_add', body_input: '.note_body_add'});
    return {
        toggle_note_input: toggle_note_input,
        update_new_note_button: update_new_note_button,
        create_note_submit_onclick: function (notes_ui_manager) { // woah, the function returned closes over notes_make! neat!
            var that = this;
            return function (e) {
                var note_obj = input_validate.get_note_obj_from_inputs();
                if (!note_obj.isBlank()) {
                    notes_ui_manager.new_note(note_obj);
                    
                    that.toggle_note_input();
                    input_validate.clear_note_inputs();
                } else {
                    alert('Please fill out a note!');
                }
            }
        }
    };
});
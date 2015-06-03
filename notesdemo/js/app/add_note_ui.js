define(['jquery', 'app/ui_validate_init'], function ($, ui_validate_init) {
    "use strict";
    var selectors = {
        input_toggle_btn: '.toggle_note_input',
        input_section: '.note_input_section'
    };
    var toggle_note_input = function () {
        var $input_area = $(selectors.input_section);
        $input_area.toggle();
        update_new_note_button($input_area.css('display') != 'none');
    };
    var update_new_note_button = function (visible) {
        var menu_open_state = 'fa-plus-circle',
            menu_closed_state = 'fa-minus-circle';
        
        if (visible) {
            $(selectors.input_toggle_btn + ' .fa').removeClass(menu_open_state);
            $(selectors.input_toggle_btn + ' .fa').addClass(menu_closed_state);
        } else {
            $(selectors.input_toggle_btn + ' .fa').removeClass(menu_closed_state);
            $(selectors.input_toggle_btn + ' .fa').addClass(menu_open_state);
        }
    };
    
    // set up element click events
    $(selectors.input_toggle_btn).click(toggle_note_input);
    
    var input_validate = ui_validate_init({title_input: '.note_title_add', body_input: '.note_body_add'});
    return {
        create_note_submit_onclick: function (notes_ui_manager) { // woah, the function returned closes over notes_ui_manager! neat!
            return function (e) {
                var note_obj = input_validate.get_note_obj_from_inputs();
                if (!note_obj.isBlank()) {
                    notes_ui_manager.new_note(note_obj);
                    
                    toggle_note_input();
                    input_validate.clear_note_inputs();
                } else {
                    alert('Please fill out a note!');
                }
            }
        }
    };
});
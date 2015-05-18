// DOMContentLoaded is fired once the document has been loaded and parsed,
// but without waiting for other external resources to load (css/images/etc)
// That makes the app more responsive and perceived as faster.
// https://developer.mozilla.org/Web/Reference/Events/DOMContentLoaded
window.addEventListener('DOMContentLoaded', function() {

  // We'll ask the browser to use strict code to help us catch errors earlier.
  // https://developer.mozilla.org/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
  'use strict';

  var translate = navigator.mozL10n.get;
});

var NOTESDEMO = {};

$(document).ready(function () {
    var notes = NOTESDEMO.notes = new_notes_obj();
    var ui    = NOTESDEMO.ui = new_ui_obj();

    $('.toggle_note_input').click(function () {
        ui.toggle_note_input();
    });
    $('.submit_note').click(function () {
        notes.submit_note();
        ui.toggle_note_input();
        ui.clear_note_inputs();
    });
});

var new_notes_obj = function () {
    return {
        submit_note: function () {
            this.append_note(
            {
                title: $('.note_title_input').val(),
                body: $('.note_body_input').val()
            });
        },
        append_note: function (note_obj) {
            var li = $('<li class="note_listing"></li>');
            li.append('<div class="trash_button"><i class="fa fa-trash"></i></div>');
            li.append('<h2 class="note_title">' + (note_obj.title || 'Untitled Note') + '</h2>');
            
            var note_body = '<p class="note_body ' +
                (note_obj.body ? '' : 'note_body_empty') + '">' + 
                (note_obj.body || '') +
                '</p>'; // clean this up
            
            li.append(note_body);
            li.appendTo('.notes_container');
        }
    }
};

var new_ui_obj = function () {
    return {
        clear_note_inputs: function () {
            $('.note_title_input').val('');
            $('.note_body_input').val('');
        },
        toggle_note_input: function () {
            var $input_area = $('.note_input_section');
            $input_area.toggle();
            this.update_new_note_button($input_area.css('display') != 'none');
        },
        update_new_note_button: function (visible) {
            if (visible) {
                $('.toggle_note_input i').removeClass();
                $('.toggle_note_input i').text('-');
            } else {
                $('.toggle_note_input i').text('');
                $('.toggle_note_input i').addClass('fa fa-pencil fa-lg');
            }
        }
    };
};
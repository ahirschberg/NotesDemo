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
    var ui            = NOTESDEMO.ui            = new_ui_obj();
    var notes_storage = NOTESDEMO.notes_storage = new_notes_storage_manager();
    var notes_make    = NOTESDEMO.notes_make    = new_notes_make_manager(ui, notes_storage);
    
    notes_storage.retrieve_all_notes().forEach(function (obj) {
        obj && ui.append_note_to_list(obj);
    }); // should be moved to object
    
    $('.toggle_note_input').click(function () {
        ui.toggle_note_input();
    });
    $('.submit_note').click(function () {
        if (ui.check_inputs_filled()) {
            notes_make.new_note();
            
            ui.toggle_note_input();
            ui.clear_note_inputs();
        } else {
            alert('Please fill out a note!');
        }
    });
    $('.trash_button').click(function () {
        var note_full_id = $(this).parent().attr('id');
        notes_storage.delete_note(note_full_id);
    });
});

var new_notes_make_manager = function (ui, notes_storage) {
    return {
        new_note: function () {
            var note_data = ui.get_note_inputs();
            var index = notes_storage.write_note(note_data);
            note_data.index = index;
            ui.append_note_to_list(note_data);
        }
    };
};

var new_notes_storage_manager = function () {
    var notes_size = localStorage.getItem('notes_size');
    if (!notes_size || parseInt(notes_size) != notes_size) {
        console.error('Notes size was not retrieved, defaulting to zero.  If this is the first run, ignore this message.');
        localStorage.setItem('notes_size', 0);
    }
    delete notes_size;
    
    return {
        get_notes_size: function () {
            return parseInt(localStorage.getItem('notes_size'));
        },
        write_note: function (note_obj) {
            var curr_index = this.get_notes_size();
            localStorage.setItem('note_' + curr_index, JSON.stringify(note_obj));
            localStorage.setItem('notes_size', curr_index + 1);
            return curr_index; // todo fix this message structure
        },
        retrieve_note: function (index) {
            var note_obj = JSON.parse(localStorage.getItem('note_' + index));
            if (!note_obj) {
                console.warn('could not parse not object with index ' + index);
                return null;
            }
            note_obj.index = index;
            return note_obj;
        },
        delete_note: function (full_id) { // insecure, allows malicious user to delete anything in local storage.
            localStorage.removeItem(full_id);
        },
        retrieve_all_notes: function () {
            var res = [];
            for (var i = 0; i < this.get_notes_size(); i++) {
                res.push(this.retrieve_note(i));
            }
            return res;
        }
    };
}

var new_ui_obj = function () {
    return {
        check_inputs_filled: function () {
            return $('.note_title_input').val() || $('.note_body_input').val();
        },
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
                $('.toggle_note_input i').addClass('fa fa-pencil');
            }
        },
        append_note_to_list: function (note_obj) {
            var li = $('<li class="note_listing" id="note_' + note_obj.index + '"></li>');
            li.append('<div class="trash_button"><i class="fa fa-trash"></i></div>');
            li.append('<h2 class="note_title">' + (note_obj.title || 'Untitled Note') + '</h2>');
            
            var note_body = '<p class="note_body ';
            if (note_obj.body) {
                note_body += ('">' + note_obj.body);
            } else {
                note_body += 'note_body_empty">';
            }
            note_body += '</p>'; // clean this up more?
            
            console.log('note body: \n' + note_body);
            
            li.append(note_body);
            li.appendTo('.notes_container');
        },
        get_note_inputs: function () {
            return {
                title: $('.note_title_input').val(),
                body: $('.note_body_input').val()
            };
        }
    };
};
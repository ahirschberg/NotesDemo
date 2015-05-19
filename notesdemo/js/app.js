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
    
    var notes_hash = notes_storage.notes_hash;
    Object.keys(notes_hash).forEach (function (key) {
        console.log(notes_hash[key]);
        ui.append_note_to_list(notes_hash[key], key);
    });
    
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
        var note_element = $(this).parent();
        var note_index = notes_storage.get_index_from_id(note_element.attr('id'));
        console.log('deleting note with index ' + note_index);
        notes_storage.delete_note(note_index);
    });
});

var new_notes_make_manager = function (ui, notes_storage) {
    return {
        new_note: function () {
            var note_obj = ui.get_note_inputs();
            var index = notes_storage.add_note(note_obj);
            ui.append_note_to_list(note_obj, index);
        }
    };
};

var new_notes_storage_manager = function () {
    var notes_hash = JSON.parse(localStorage.getItem('notes_hash'));
    var notes_max_index = parseInt(localStorage.getItem('notes_max_index')); 

    if (!notes_hash) {
        console.error('Notes hash was not retrieved, defaulting to {}.  If this is the first run, ignore this message.');
        notes_hash = {};
        localStorage.setItem('notes_hash', JSON.stringify(notes_hash));
    }
    if (!notes_max_index || typeof notes_max_index != 'number') { // NaN is a number :P
        console.error('Notes max index was not retrieved, defaulting to 0.  If this is the first run, ignore this message.');
        notes_max_index = 0;
        localStorage.setItem('notes_max_index', JSON.stringify(notes_max_index));

    }
    var new_note_key = function () { return notes_max_index += 1; }
    var update_ls_hash = function () {
        localStorage.setItem('notes_hash', JSON.stringify(notes_hash));
        localStorage.setItem('notes_max_index', JSON.stringify(notes_max_index));
    }
    var id_rxp = /note_(\d+)/;
    
    return {
        add_note: function (note_obj) {
            var index = new_note_key();
            notes_hash[index] = note_obj;
            update_ls_hash();
            
            return index;
        },
        retrieve_note: function (index) {
            return notes_hash[index];
        },
        delete_note: function (index) {
            delete notes_hash[index];
            update_ls_hash();
        },
        get_index_from_id: function (id) {
            var match = id_rxp.exec(id);
            return parseInt(match[1]);
        },
        notes_hash: notes_hash
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
        append_note_to_list: function (note_obj, index) {
            var li = $('<li class="note_listing" id="note_' + index + '"></li>');
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
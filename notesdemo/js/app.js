// DOMContentLoaded is fired once the document has been loaded and parsed,
// but without waiting for other external resources to load (css/images/etc)
// That makes the app more responsive and perceived as faster.
// https://developer.mozilla.org/Web/Reference/Events/DOMContentLoaded
window.addEventListener('DOMContentLoaded', function() {

  // We'll ask the browser to use strict code to help us catch errors earlier.
  // https://developer.mozilla.org/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
  'use strict';

});

var NOTESDEMO = {};

$(document).ready(function () {
    
    Array.prototype.compact = function() { // add a compact() function to array that removes falsy values
      for (var i = 0; i < this.length; i++) {
        if (!this[i]) {         
          this.splice(i, 1);
          i--;
        }
      }
      return this;
    };
    
    var notes_storage    = NOTESDEMO.notes_storage    = new_notes_storage_manager();
    var notes_ui_manager = NOTESDEMO.notes_ui_manager = new_ui_manager_obj({notes_storage_mgr: notes_storage});

    var notes_store = notes_storage.notes_store;
    Object.keys(notes_store).forEach (function (key) {
        notes_ui_manager.note_disp.append_note_to_list(notes_store[key], key);
    });
    
    var submit_func = notes_ui_manager.note_add_input.create_note_submit_onclick(notes_ui_manager);
    $('.submit_note').click(function () {
        submit_func.apply(this, arguments)
    });
});

function debug_temp_add_n_notes(n) {
    for (var i = 1; i <= n; i++) {
        NOTESDEMO.notes_ui_manager.new_note({title: ('generated note ' + i), body: ('I can do it! I can do it ' + i + ' times!')});
    }
}

var new_notes_storage_manager = function () {
    var notes_store = JSON.parse(localStorage.getItem('notes_store'));
    
    if (!notes_store) {
        console.warn('notes_store could not be retrieved from localStorage, defaulting to [].');
        notes_store = [];
        localStorage.setItem('notes_store', JSON.stringify(notes_store));
    }
    notes_store = notes_store.compact(); // compact is a custom function we added earlier
    
    var write_store = function () {
        localStorage.setItem('notes_store', JSON.stringify(notes_store));
    }
    var id_rxp = /note_(\d+)/;
    
    return {
        add_note: function (note_obj) {
            var index = notes_store.length;
            notes_store[index] = note_obj;
            write_store();
            
            return index;
        },
        retrieve_note: function (index) {
            return notes_store[index];
        },
        delete_note: function (index) {
            delete notes_store[index];
            write_store();
        },
        update_note: function (index, new_note_obj) {
            notes_store[index] = new_note_obj;
            write_store();
        },
        get_index_from_id: function (id) {
            var match = id_rxp.exec(id);
            return parseInt(match[1]);
        },
        notes_store: notes_store
    };
}

var new_ui_manager_obj = function (args) {
    var notes_storage_mgr = args.notes_storage_mgr;

    var note_edit_input = new_edit_note_ui_obj();
    var ui_handlers = {
        note_add_input:  new_add_note_ui_obj(),
        note_edit_input: note_edit_input,
        note_disp:       new_note_disp_ui_obj({note_edit: note_edit_input, note_storage: notes_storage_mgr}),
        
        new_note: function (note_obj) {
            var index = notes_storage_mgr.add_note(note_obj);
            this.note_disp.append_note_to_list(note_obj, index);
        }
    };

    return ui_handlers;
};

var new_edit_note_ui_obj = function () {
    var input_validate = new_validate_note_input_obj({title_input: '.note_title_edit', body_input: '.note_body_edit'});
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
                
                var $note_element = $(this).parent();
                var note_index = notes_storage_mgr.get_index_from_id($note_element.attr('id'));
                var note_obj = notes_storage_mgr.retrieve_note(note_index);

                var $edit_div = $('<div class="edit_note" />');
                $('<input type="text" class="note_input note_title_edit">')
                    .val(note_obj.title)
                    .appendTo($edit_div);
                $('<textarea class="note_input note_body_edit"/>')
                    .val(note_obj.body)
                    .appendTo($edit_div);
                $('<button class="submit_note_edit">Done</button>')
                    .click(create_note_edit_submit_onclick(note_index, notes_storage_mgr, notes_disp_ui))
                    .appendTo($edit_div);

                $note_element.children().hide();
                $edit_div.appendTo($note_element);
            };
        }
    };
};
var new_add_note_ui_obj = function () {
    // TODO ask kevin what he thinks about this
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
    
    var input_validate = new_validate_note_input_obj({title_input: '.note_title_add', body_input: '.note_body_add'});
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
};

var new_validate_note_input_obj = function (selectors) {
    return {
        get_note_obj_from_inputs: function () {
            return {
                title: $(selectors.title_input).val(),
                body:  $(selectors.body_input).val(),
                isBlank: function () {
                    return !(this.title || this.body); // empty string is falsy
                }
            };
        },
        clear_note_inputs: function () {
            $(selectors.title_input).val('');
            $(selectors.body_input).val('');
        }
    };
};

var new_note_disp_ui_obj = function (args) {
    var edit_note_ui = args.note_edit, 
        notes_storage_mgr = args.note_storage,
        disp_ui_obj = {};
        
    var trash_click_fn = function () {
        var $note_element = $(this).parent();
        var note_index = notes_storage_mgr.get_index_from_id($note_element.attr('id'));
        
        console.log('deleting note with index ' + note_index);
        notes_storage_mgr.delete_note(note_index);
        $note_element.fadeOut("fast", function() {
            $(this).remove();
        });
    };
    var edit_click_fn = edit_note_ui.create_note_edit_onclick(notes_storage_mgr, disp_ui_obj);

    var $populate_note_data_element = function (note_obj) {
        var $note_data = $('<div class="note_data"></div>');
        
        // append note title
        $note_data.append(
            '<h2 class="note_title">' +
            (note_obj.title || '') +
            '</h2>');

        // append note body            
        $note_data.append(
            '<p class="note_body">' + 
            (note_obj.body || '') +
            '</p>');
        
        return $note_data;
    };
    
    disp_ui_obj.append_note_to_list = function (note_obj, index) {
        var $li = $('<li/>', {
            class: 'note_listing',
            id: ('note_' + index)
        });

        // append trash button
        var $trash = $('<div/>', {
            class: 'notes_button notes_trash_button',
            html: '<i class="fa fa-trash"></i>', // put a font-awesome icon inside the trash div
            click: trash_click_fn
        }).appendTo($li);

        // append edit button
        var $edit = $('<div/>', {
            class: 'notes_button notes_edit_button',
            html: '<i class="fa fa-pencil"></i>',
            click: edit_click_fn
        }).appendTo($li);
        
        $note_data = $populate_note_data_element(note_obj);
        $li.append($note_data);

        // add to the DOM inside the notes list
        $li.prependTo('.notes_container');

        console.log('Appended note with index ' + index);
    };
    disp_ui_obj.update_note_in_list = function (args) {
        var $li = $('#note_' + args.note_index);
        $li.find('.note_data').replaceWith(
            $populate_note_data_element(args.note)
        );
    };
    
    return disp_ui_obj;
};
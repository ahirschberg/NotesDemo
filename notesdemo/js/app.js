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

$(document).ready(function () {
    var notes = new_notes_obj();
    $('.toggle_note_input').click(function () {
        notes.toggle_note_input();
    });
    $('.submit_note').click(function () {
        notes.submit_note();
    });
});

var new_notes_obj = function () {
    return {
        toggle_note_input: function () {
            var $input_area = $('.note_input_section');
            $input_area.toggle();
        },
        submit_note: function () {
            this.append_note({body: $('.note_input').val()});
        },
        append_note: function (note_obj) {
            var li = $('<li class="note_listing"></li>');
            li.append('<h2 class="note_title">' + (note_obj.title || 'Untitled Note') + '</h2>');
            li.append('<p class="note_body">' + note_obj.body + '</p>');
            li.appendTo('.notes_container');
        }
    }
}
define(['jquery'], function ($) {
    "use strict"; 
    return function (selectors) { // this is a constructor function
        return {
            get_note_obj_from_inputs: function () {
                return {
                    title: $(selectors.title_input).val(),
                    body:  $(selectors.body_input).val(),
                    isBlank: function () {
                        return !(this.title || this.body); // empty string is falsy in js
                    }
                };
            },
            clear_note_inputs: function () {
                $(selectors.title_input).val('');
                $(selectors.body_input).val('');
            }
        };
    };
});
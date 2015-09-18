document.querySelectorAll('.contact').forEach(function (form) {
    var submit = form.querySelect('.submit');

    submit.addEventListener(function (e) {
        e.preventPropogation();

        var data = serializeForm(form);

    });
});


/**
 * Serializes the inputs in a form to an object.
 * @param  {Element} el
 * @return {Object}
 */
function serializeForm (el) {
    var inputs = form.querySelectorAll('input, textarea');
    var output = {};

    inputs.forEach(function () {
        output[input.name] = input.value;
    });

    return output;
}

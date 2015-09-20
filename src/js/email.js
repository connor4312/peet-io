var forms = document.querySelectorAll('.contact');
var util = require('./util');

for (var i = 0; i < forms.length; i++) {
    forms[i].onsubmit = handleSubmit;
}

/**
 * Handles submission of an AJAX form; cancelling the propagation and
 * sending an AJAX request instead.
 * @return {Boolean}
 */
function handleSubmit (e) {
    var form = this;
    e.stopPropagation();

    function showAlert (kind, text) {
        form.insertAdjacentHTML('beforebegin', '<div class="alert alert-' + kind + '">' + text + '</div>');
    }

    util.forEach('input, textarea, button', function (el) {
        el.disabled = true;
    }, form);

    var data = serializeForm(form);
    data.isValid = true; // additional thing so spam bots don't spam too easily.

    sendData('/api/mail', data, function (err) {
        if (err) {
            showAlert('danger', 'There was an error sending your message. Try ' +
                'contacting me directly using one of the buttons on the left..');
        } else {
            showAlert('success', 'Your message has been sent, I will reply to you shortly!');
        }
    });

    return false;
}

/**
 * Sends form data to the URL.
 * @param  {String}   endpoint
 * @param  {Object}   data
 * @param  {Function} callback
 */
function sendData (endpoint, data, callback) {
    var str = '';
    for (var key in data) {
        str += key + '=' + encodeURIComponent(data[key]) + '&';
    }

    var request = new XMLHttpRequest();
    request.open('POST', '/api/mail', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send(str);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            callback(undefined, request);
        } else {
            callback(new Error('Unexpected response code ' + request.status), request);
        }
    };

    request.onerror = function (err) {
        callback(err, request);
    };
}

/**
 * Serializes the inputs in a form to an object.
 * @param  {Element} el
 * @return {Object}
 */
function serializeForm (el) {
    var inputs = el.querySelectorAll('input, textarea');
    var output = {};

    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        if (input.name) {
            output[input.name] = input.value;
        }
    }

    return output;
}

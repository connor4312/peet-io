/**
 * Iterates over elements got from a querySelectorAll on the element.
 * @param  {String} selector
 * @param  {Function} iterator
 * @param  {Node} [element=document]
 */
exports.forEach = function (selector, iterator, element) {
    var elements = (element || document).querySelectorAll(selector);
    for (var i = 0; i < elements.length; i++) {
        iterator(elements[i], i);
    }
}

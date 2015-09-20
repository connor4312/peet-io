var util = require('./util');
require('smoothscroll'); // registers on window :(


util.forEach('.screen-fill', function (fill) {
    var mod = parseFloat(fill.dataset.mod, 10) || 1;
    function adjust () {
        fill.style['minHeight'] = (window.innerHeight * mod) + 'px';
    }

    window.addEventListener('resize', adjust);
    adjust();
});

var center = { lat: 43.662907, lng: -79.395656 };
var Maps = google.maps;

Maps.event.addDomListener(window, 'load', function () {
    var el = document.getElementById('js-map');
    var map = new Maps.Map(el, {
        styles: require('./mapStyle.json'),
        scrollwheel: false,
        disableDefaultUI: true,
        center: center,
        zoom: 8
    });

    var marker = new Maps.Marker({
        position: center,
        title: 'Toronto, ON',
        map: map,
        icon: {
            url: '/img/map-tag.png',
            size: new Maps.Size(203, 61),
            anchor: new Maps.Point(101, 47)
        }
    });
});

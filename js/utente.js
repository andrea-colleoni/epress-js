var user = {};
var map;

$(function() {
    caricaNavbar();
    caricaUtente(getParameterByName('userId'), generaInfoUtente);
});

function initMap() {
    // Create a map object and specify the DOM element for display.
    var initLoc = new google.maps.LatLng(0.0, 0.0); 
    map = new google.maps.Map(document.getElementById('map'), {
      center: initLoc,
      zoom: 2
    });    
  }

function caricaUtente(userId, callback) {
    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/users/' + userId,
        method: 'get'
    })
    .done(function(rispUser) {
        user = rispUser;
        if(callback)
            callback();
    }); 
}

function generaInfoUtente() {
    var userLoc = new google.maps.LatLng(parseFloat(user.address.geo.lat), parseFloat(user.address.geo.lng)); 
    var marker = new google.maps.Marker({
        position: userLoc,
        map: map
    }); 
    map.setCenter(userLoc);
    $('#map').show();
    $('#nome').html(user.name);
    $('#indirizzo').append(`
    <p class="card-text"><strong>Street:</strong> ` + user.address.street + `</p>
    <p class="card-text"><strong>Suite:</strong> ` + user.address.suite + `</p>
    <p class="card-text"><strong>City:</strong> ` + user.address.city + `</p>
    <p class="card-text"><strong>ZIP code:</strong> ` + user.address.zipcode + `</p>
    `);
    $('#azienda').append(`
    <p class="card-text"><strong>Company:</strong> ` + user.company.name + `</p>
    <p class="card-text"><strong>Catch phrase:</strong> ` + user.company.catchPhrase + `</p>
    <p class="card-text"><strong>BS:</strong> ` + user.company.bs + `</p>
    `);
}
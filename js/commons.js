function caricaNavbar(searchCallback) {
    $.ajax({
        url: 'navbar.html',
        method: 'get'
    })
    .done(function(respHtml) { 
        $('body').prepend(respHtml);
        $('#btnSearch').click(function(e) {
            e.preventDefault();
            searchCallback();
        }); 
    });
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
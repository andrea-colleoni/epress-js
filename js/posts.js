var posts = [];
var elementiPerPagina = 10;
var pagina = 0;
var templPost = '';
var templCommento = '';

// on document ready
$(function() {  // closure
    caricaNavbar(generaTuttiPost);
    caricaPosts(function() {
        // punto 1.
        $.ajax({
            url: 'rigaPost.html',
            method: 'get'
        })
        .done(function(respHtmlPost) {
            templPost = respHtmlPost;
            // punto 2
            $.ajax({
                url: 'commentoPost.html',
                method: 'get'
            })
            .done(function(respHtmlCommento){
                templCommento = respHtmlCommento;
                generaTuttiILinkDiPaginazione();
                generaTuttiPost();
            });
        });        
    });
    $( "#postsContainer" ).on("click", "span.not-starred", function() {
        aggiungiBookmark( $( this ) );
    });
    $( "#postsContainer" ).on("click", "span.starred", function() {
        rimuoviBookmark( $( this ) );
    });
    $('#paginazione-posts').on('click', '.page-link', function() {
        cambiaPagina($(this));
    });
    console.log('finito');
});

function caricaPosts(callBack) {
    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'get'
    })
    .done(function(listaPosts) {
        posts = listaPosts;
        if(callBack)
            callBack();
    }); 
}

/* giorno 1 */
function generaTuttiPost() {
    // punto 3.
    $('#postsContainer').empty();
    var inizio = pagina * elementiPerPagina;
    var fine = inizio + elementiPerPagina;
    $.each(
        posts
        .filter(function(post) {
            return  $('#searchTerms').val() == '' || 
                    (post.body.indexOf($('#searchTerms').val().trim()) >= 0) ||
                    (post.title.indexOf($('#searchTerms').val().trim()) >= 0);
        })
        .slice(inizio, fine), function(ixPost, post) {
            //console.log(post);
            generaSingoloPost(post);
        });
}

function generaTuttiILinkDiPaginazione() {
    $('#paginazione-posts').empty();
    $('#paginazione-posts').append(
        '<li class="page-item"><a class="page-link" href="#" data-numpagina="' 
        + (pagina - 1) + '">Precedente</a></li>'
    );
    for(i = pagina - 3; i <= pagina + 3; i++) {
        var li = '<li class="page-item' + (i == pagina ? ' active' : '') + '"><a class="page-link" href="#" data-numpagina="' + i + '">' 
        + (i + 1) + '</a></li>';
        $('#paginazione-posts').append(li);
    }
    $('#paginazione-posts').append(
        '<li class="page-item"><a class="page-link" href="#" data-numpagina="' 
        + (pagina + 1) + '">Prossima</a></li>');
}

function cambiaPagina(pageLinkElement) {
    pagina = new Number(pageLinkElement.data('numpagina'));
    generaTuttiILinkDiPaginazione();
    generaTuttiPost();
}

function generaSingoloPost(post) {
   // punto 3.1   
    $('#postsContainer').append(
        templPost
            .replace(/{{post.title}}/g, post.title)
            .replace(/{{post.body}}/g, post.body)
            .replace(/{{post.id}}/g, post.id)
    );
    commentiDelPost(post.id);
    impostaAutoreDelPost(post);

    var arr = caricaBookmarks();
    if(arr.indexOf(post.id) >= 0) {
        $('span[data-postid=' + post.id + ']').removeClass('not-starred');
        $('span[data-postid=' + post.id + ']').addClass('starred');
    } else {
        $('span[data-postid=' + post.id + ']').removeClass('starred');
        $('span[data-postid=' + post.id + ']').addClass('not-starred');
    }
}

function impostaAutoreDelPost(post) {
    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/users/' + post.userId,
        method: 'get'
    })
    .done(function (user) {
        $('#autore-' + post.id + ' .nome-autore').html(user.name);
        //$('#autore-' + post.id).html('<span class="oi oi-person"></span> ' + user.name);
        $('#autore-' + post.id).attr('href', 'utente.html?userId=' + user.id);
    });
}

function commentiDelPost(postId) {
   // punto 3.2
   $.ajax({
    url: 'https://jsonplaceholder.typicode.com/comments?postId=' + postId,
    method: 'get'
    })
    .done(function(listaCommenti) {
        $('#badge-commento-' + postId).html(listaCommenti.length);
        // punto 3.2.1
        $.each(listaCommenti, function(ixCommento, comment) {
            $('#commenti-' + postId).append(
                templCommento
                    .replace(/{{comment.name}}/g, comment.name)
                    .replace(/{{comment.body}}/g, comment.body)
                    .replace(/{{comment.email}}/g, comment.email)
            );
        });
    }); 
}

/* giorno 2 */
function caricaBookmarks() {
    var strPreferiti = localStorage.getItem('postPreferiti');
    var bookmarks = (strPreferiti ? JSON.parse(localStorage.getItem('postPreferiti')) : []);
    return bookmarks;
}

function salvaBookmarks(arr) {
    localStorage.setItem('postPreferiti', JSON.stringify(arr));
}

function eliminaTuttiIBookmarks() {
    localStorage.removeItem('postPreferiti');
}

function aggiungiBookmark( starElement ) {
    var postId = new Number(starElement.data('postid'));
    var arr = caricaBookmarks();
    if (arr.indexOf(postId.valueOf()) >= 0) {
        console.warn('bookmark già esistente');
    } else {
        arr.push(postId);
        starElement.removeClass('not-starred');
        starElement.addClass('starred');
        salvaBookmarks(arr);
        console.log('bookmark aggiunto');
    }
}

function rimuoviBookmark( starElement ) {
    var postId = new Number(starElement.data('postid'));
    var arr = caricaBookmarks();
    if (arr.indexOf(postId.valueOf()) >= 0) {
        arr.splice(arr.indexOf(postId.valueOf()), 1);
        starElement.removeClass('starred');
        starElement.addClass('not-starred');
        salvaBookmarks(arr);
        console.log('bookmark aggiunto');     
    } else {
        console.warn('bookmark inesistente');
    }
}
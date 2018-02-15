// on document ready
$(function() {  // closure
    // punto 1.
    $.ajax({
        url: 'rigaPost.html',
        method: 'get'
    })
    .done(function(templPost) {
        // punto 2
        $.ajax({
            url: 'commentoPost.html',
            method: 'get'
        })
        .done(function(templCommento){
            generaTuttiPost(templPost, templCommento);
        });
    });
    $( "#postsContainer" ).on("click", "span.not-starred", function() {
        aggiungiBookmark( $( this ) );
    });
    $( "#postsContainer" ).on("click", "span.starred", function() {
        rimuoviBookmark( $( this ) );
    });
    console.log('finito');
});

/* giorno 1 */
function generaTuttiPost(templPost, templCommento) {
   // punto 3.
   $.ajax({
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'get'
    })
    .done(function(listaPosts) {
        //console.log(listaPosts);
        $.each(listaPosts, function(ixPost, post) {
            //console.log(post);
            generaSingoloPost(post, templPost, templCommento);
        });
    }); 
}

function generaSingoloPost(post, templPost, templCommento) {
   // punto 3.1   
    $('#postsContainer').append(
        templPost
            .replace(/{{post.title}}/g, post.title)
            .replace(/{{post.body}}/g, post.body)
            .replace(/{{post.id}}/g, post.id)
    );
    commentiDelPost(post.id, templCommento);
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

function commentiDelPost(postId, templCommento) {
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
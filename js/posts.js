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
    console.log('finito');
});

function generaTuttiPost(templPost, templCommento) {
   // punto 3.
   $.ajax({
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'get'
    })
    .done(function(listaPosts) {
        console.log(listaPosts);
        $.each(listaPosts, function(ixPost, post) {
            console.log(post);
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
}

function impostaAutoreDelPost(post) {
    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/users/' + post.userId,
        method: 'get'
    })
    .done(function (user) {
        $('#autore-' + post.id).html('<span class="oi oi-person"></span> ' + user.name);
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
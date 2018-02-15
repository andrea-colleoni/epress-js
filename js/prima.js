// on document ready
$(function() {  // closure
    // punto 3.
    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'get'
    })
    .done(function(listaPosts) {
        console.log(listaPosts);
        // punto 1.
        $.ajax({
            url: 'rigaPost.html',
            method: 'get'
        })
        .done(function(templPost) {
            $.each(listaPosts, function(ixPost, post) {
                console.log(post);
                // punto 3.1
                $('#postsContainer').append(
                    templPost
                        .replace(/{{post.title}}/g, post.title)
                        .replace(/{{post.body}}/g, post.body)
                        .replace(/{{post.id}}/g, post.id)
                );
                // punto 2
                $.ajax({
                    url: 'commentoPost.html',
                    method: 'get'
                })
                .done(function(templCommento){
                    // punto 3.2
                    $.ajax({
                        url: 'https://jsonplaceholder.typicode.com/comments?postId=' + post.id,
                        method: 'get'
                    })
                    .done(function(listaCommenti) {
                        $('#badge-commento-' + post.id).html(listaCommenti.length);
                        // punto 3.2.1
                        $.each(listaCommenti, function(ixCommento, comment) {
                            $('#commenti-' + post.id).append(
                                templCommento
                                    .replace(/{{comment.name}}/g, comment.name)
                                    .replace(/{{comment.body}}/g, comment.body)
                                    .replace(/{{comment.email}}/g, comment.email)
                            );
                        });
                    });
                });
            });
        });
    })
    .fail(function() {
        console.error('ko');
    });
    console.log('finito');
});
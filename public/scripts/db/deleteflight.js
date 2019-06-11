function deleteflight(id){
    $.ajax({
        url: '/db-project/flights/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    });
}
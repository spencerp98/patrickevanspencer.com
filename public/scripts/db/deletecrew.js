function deleteCrew(id){
    $.ajax({
        url: '/db-project/crew/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    });
}
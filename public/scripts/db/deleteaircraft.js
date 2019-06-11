function deleteAircraft(id){
    $.ajax({
        url: '/db-project/aircraft/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    });
}
function deleteCrewFlight(id){
    $.ajax({
        url: '/db-project/flights/assignment/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    });
}
function updateAircraft(id){
    $.ajax({
        url: '/db-project/aircraft/' + id,
        type: 'PUT',
        data: $('#update-aircraft').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    });
}
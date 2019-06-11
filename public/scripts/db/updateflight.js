function updateflight(id){
    $.ajax({
        url: '/db-project/flights/' + id,
        type: 'PUT',
        data: $('#update-flight').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    });
}

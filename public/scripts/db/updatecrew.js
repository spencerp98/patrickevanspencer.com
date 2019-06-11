function updateCrew(id){
    $.ajax({
        url: '/db-project/crew/' + id,
        type: 'PUT',
        data: $('#update-crew').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    });
}
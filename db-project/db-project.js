module.exports = function(){
    var express = require('express');
    var router = express.Router();

    router.get("/", function(req, res){
        res.render('db-project/340home', {layout: 'db-project'});
    });

    router.use('/crew', require('./crew.js'));
    router.use('/aircraft', require('./aircraft.js'));
    router.use('/flights', require('./flights.js'));

    return router;
}();
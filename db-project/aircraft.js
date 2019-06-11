module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getAircraftTypes(res, mysql, context, complete, func){
    	mysql.pool.query("SELECT id, manufacturer, model FROM aircraft_type", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.aircraftType = results;
            func(context);
            complete();
        });
    }

    function getAircrafts(res, mysql, context, complete, func){
        mysql.pool.query("SELECT aircraft.id, registrationNumber, manufacturer, model FROM aircraft INNER JOIN aircraft_type ON aircraft.type = aircraft_type.id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.aircraft = results;
            func(context);
            complete();
        });
    }

     function getAircraft(res, mysql, context, id, complete, func){
        var sql = "SELECT id, type, registrationNumber FROM aircraft WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.aircraft = results[0];
            func(context);
            complete();
        });
    }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.layout = 'db-project';
        context.jsscripts = ["scripts/db/deleteaircraft.js"];
        var mysql = req.app.get('mysql');
        getAircrafts(res, mysql, context, complete, function(){
            getAircraftTypes(res, mysql, context, complete, function(){});
        });
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('db-project/aircraft', context);
            }

        }
    });

    router.get('/aircraftType', function(req, res){
        var context = {};
        context.layout = 'db-project';
        var mysql = req.app.get('mysql');
        res.render('db-project/add-aircraftType', context);
    });

    router.get('/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.layout = 'db-project';
        context.jsscripts = ["scripts/db/selectedaircraft.js", "scripts/db/updateaircraft.js"];
        var mysql = req.app.get('mysql');
        getAircraft(res, mysql, context, req.params.id, complete, function(){
            getAircraftTypes(res, mysql, context, complete, function(){});
        });
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('db-project/update-aircraft', context);
            }

        }
    });

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO aircraft (type, registrationNumber) VALUES (?,?)";
        var inserts = [req.body.acType, req.body.registrationNumber];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/db-project/aircraft');
            }
        });
    });

     router.post('/aircraftType', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO aircraft_type (manufacturer, model) VALUES (?,?)";
        var inserts = [req.body.manufacturer, req.body.model];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/db-project/aircraft');
            }
        });
    });


    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE aircraft SET type=?, registrationNumber=? WHERE id=?";
        var inserts = [req.body.aircraftType, req.body.registrationNumber, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM aircraft WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();


    
module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getCrewBases(res, mysql, context, complete, func){
        mysql.pool.query("SELECT id, city FROM crew_base", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.crewbase = results;
            func(context);
            complete();
        });
    }

    function getCrewMembers(res, mysql, context, complete, func){
        mysql.pool.query("SELECT crew_member.id, fname, lname, crew_base.city AS crewbase, role FROM crew_member LEFT JOIN crew_base ON crew_member.crewbase = crew_base.id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.crew_member = results;
            func(context);
            complete();
        });
    }

    function getCrewMember(res, mysql, context, id, complete, func){
        var sql = "SELECT id, fname, lname, crewbase, role FROM crew_member WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.crew_member = results[0];
            func(context);
            complete();
        });
    }

    function getCrewSearch(res, mysql, context, id, complete, func){
        var sql = "SELECT crew_id, fname, lname, aircraft_type.manufacturer, aircraft_type.model FROM crew_member LEFT JOIN crew_aircraft ON crew_member.id = crew_aircraft.crew_id LEFT JOIN aircraft_type ON crew_aircraft.aircraftTypeID = aircraft_type.id WHERE crew_member.id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.crew_search = results;
            func(context);
            complete();
        });
    }
    
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

    /*Display all crew. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["scripts/db/deletecrew.js"];
        var mysql = req.app.get('mysql');
        getCrewMembers(res, mysql, context, complete, function(context){
            getCrewBases(res, mysql, context, complete, function(){});
        });
        context.layout = 'db-project';
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('db-project/crew', context);
            }

        }
    });
    
    /* Displays form to create new crewbase */
    
    router.get('/crewbase', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        context.layout = 'db-project';
        res.render('db-project/add-crewbase', context);
    });

    router.get('/crewsearch', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.layout = 'db-project';
        context.jsscripts = ["scripts/db/searchmember.js"];
        var mysql = req.app.get('mysql');
        getCrewMembers(res, mysql, context, complete, function(){});
        function complete(){
            callbackCount++;
            if(callbackCount >=1){
                res.render('db-project/crew-search', context);
            }
        }
    });

    
    router.get('/crewsearch/:id', function(req, res){
       var callbackCount = 0;
       var context = {};
       context.layout = 'db-project';
       var mysql = req.app.get('mysql');
       getCrewSearch(res, mysql, context, req.params.id, complete, function(context){
           getCrewMember(res, mysql, context, req.params.id, complete, function(context){
               getAircraftTypes(res, mysql, context, complete, function(){});
           });
       });
       function complete(){
           callbackCount++;
           if(callbackCount >=3){
               res.render('db-project/member-certification', context);
           }
       }
   });
   
   router.post('/crewsearch/:id', function(req, res){
       var mysql = req.app.get('mysql');
        var sql = "INSERT INTO crew_aircraft (crew_id, aircraftTypeID) VALUES (?,?)";
        var inserts = [req.body.crew_id, req.body.aircraftTypeID];
	    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/db-project/crew/crewsearch/' + req.params.id);
            }
        });
   })

    /* Display one crew_member for the specific purpose of updating that crew_member */

    router.get('/:id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.layout = 'db-project';
        context.jsscripts = ["scripts/db/selectedcrewbase.js", "scripts/db/updatecrew.js"];
        var mysql = req.app.get('mysql');
        getCrewMember(res, mysql, context, req.params.id, complete, function(context){
            getCrewBases(res, mysql, context, complete, function(){});
        });
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('db-project/update-crew', context);
            }

        }
    });

    /* Adds a crew_member, redirects to the crew page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO crew_member (fname, lname, crewbase, role) VALUES (?,?,?,?)";
        var inserts = [req.body.fname, req.body.lname, req.body.crewMemberBase, req.body.position];
	    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/db-project/crew');
            }
        });
    });
    
    /* New crew base data is sent here to create a new crew base */
    
    router.post('/crewbase', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO crew_base (city) VALUES (?)";
        var inserts = [req.body.city];
	    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/db-project/crew');
            }
        });
    });

    /* The URI that update data is sent to in order to update a crew_member */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE crew_member SET fname=?, lname=?, crewbase=?, role=? WHERE id=?";
        var inserts = [req.body.fname, req.body.lname, req.body.crewbase, req.body.role, req.params.id];
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

    /* Route to delete a crew_member, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM crew_member WHERE id = ?";
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

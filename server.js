(function(){
    'use strict';
    var garage = require('./lib/garage.js');
    var express = require('express');
    var app = express();

    //Middleware
    app.use(express.json());
    app.use(express.urlencoded());

    //API
    app.get('/garage', function(req, res){
        garage.isOpen(function(err, open){
            if(err){
                return res.status(500).send({"error" : err.toString()});
            }
            res.send({"open": open});
        });
    });

    app.put('/garage', function(req, res){
        if(typeof req.body.open === 'boolean'){
            if(req.body.open){
                activateGarage(true, res);
            }else{
                activateGarage(false, res);
            }
        }else if(typeof req.body.close === 'boolean'){
            if(req.body.close){
                activateGarage(false, res);
            }else{
                activateGarage(true, res);
            }
        }else{
            res.status(500).send({"error":"Command other than open or close"});
        }
    });

    function activateGarage(open, res){
        if(open){
            garage.open(function(err, state){
                if(err){
                    return res.status(500).send(err);
                }
                res.send({"open": true});
            });
        }else{
            garage.close(function(err, state){
                if(err){
                    return res.status(500).send(err);
                }
                res.send({"close": true});
            });
        }
    }

    var monitor = require('./lib/garage-monitor');
    monitor.on('change', function(open){
        console.log('Garage changed: ' + open);
    });

    app.listen(8080);
})();

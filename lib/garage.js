(function(){
    'use strict';
    var gpio = require('pi-gpio');

    var READ_PIN = 12;
    var WRITE_PIN = 11;

    function Garage(){
        this.isActive = false;
    }

    Garage.prototype.readState = function(callback){
        callback = callback.bind(this);

        gpio.open(READ_PIN, 'input', function(err){
            if(err){
                return callback(err, null);
            }
            gpio.read(READ_PIN, function(err, value){
                gpio.close(READ_PIN, function(){
                    callback(null, value ? true : false);
                });
            });
        });
    };

    Garage.prototype.activate = function(callback){
        var _this = this;
        callback = callback.bind(_this);

        if(this.isActive){
            return callback(new Error('Cannot activate garage, already activated'), null);
        }

        gpio.open(WRITE_PIN, 'output', function(err){
            if(err) return callback(err, null);

            this.isActive = true;
            gpio.write(WRITE_PIN, 1, function(err){
                if(err) return callback(err, null);

                setTimeout(function(){
                    gpio.write(WRITE_PIN, 0, function(err){
                        if(err) return callback(err, null);

                        gpio.close(WRITE_PIN, function(){
                            this.isActive = false;
                            callback(null);
                        }.bind(_this));
                    });
                }.bind(_this), 2000);
            }.bind(_this));
        }.bind(_this));
    };

    Garage.prototype.isOpen = function(callback){
        callback = callback.bind(this);

        this.readState(function(err, value){
            if(err) return callback(err, null);
            callback(null, value);
        });
    };

    Garage.prototype.isClosed = function(callback){
        callback = callback.bind(this);

        this.readState(function(err, value){
            if(err) return callback(err, null);
            callback(null, !value);
        });
    };

    Garage.prototype.close = function(callback){
        callback = callback.bind(this);

        this.isOpen(function(err, open){
            if(err) return callback(err, null);
            if(open){
                this.activate(function(err){
                    if(err) return callback(err);
                    callback(null, true);
                });
            }else{
                callback(null, false);
            }
        });
    };

    Garage.prototype.open = function(callback){
        callback = callback.bind(this);

        this.isClosed(function(err, closed){
            if(err) return callback(err, null);
            if(closed){
                this.activate(function(err){
                    if(err) return callback(err);
                    callback(null, true);
                });
            }else{
                callback(null, false);
            }
        });
    };

    module.exports = exports = new Garage();
})();

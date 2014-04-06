(function(){
    'use strict';
    var garage = require('./garage');
    var util = require('util');
    var events = require('events');

    function GarageMonitor(){
        this.interval = setInterval(function(){
            garage.isOpen(function(err, open){
                this.emit('update', open);
            }.bind(this));
        }.bind(this), 30000);

        this.on('update', function(open){
            if(open !== this.open){
                this.open = open;
                this.emit('change', this.open);
            }
        }.bind(this));
    }

    util.inherits(GarageMonitor, events.EventEmitter);

    module.exports = exports = new GarageMonitor();
})();

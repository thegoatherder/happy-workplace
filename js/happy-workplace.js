//Namespace
var HappyWorkplace = HappyWorkplace || {};

/*
 * Worker Object
 */
HappyWorkplace.Worker = function(config) {
    
    this.min_happy = 0;
    this.max_happy = 100;
    this.happiness = 100;
    this.name = "Adam";
    $.extend(this, config);
    this.make_face();
        
};

HappyWorkplace.Worker.prototype = {
    
    update_happiness: function(amount) {
        this.happiness = amount;
        this.correct_happiness();
        this.happiness = Math.round(this.happiness*10)/10;
    },

    correct_happiness: function() {
        if(this.happiness > this.max_happy) this.happiness = this.max_happy;
        else if(this.happiness < this.min_happy) this.happiness = this.min_happy;
    },
    
    status: function () {
        return this.name + ' is ' + this.happiness + '% happy';
    },
    
    make_face: function () {
        this.face = $('<div class="yellow smileyface"><p class="eyes lefteye"></p><p class="eyes righteye"></p><div class="smile"></div></div>');
    }
};

/*
 * Node Object Literal
 */
HappyWorkplace.Node = function (config, worker) {
    
    this.worker = worker || new HappyWorkplace.Worker();
    this.min_effect_up = 0;
    this.max_effect_up = 0.5;
    this.min_effect_across = 0.25;
    this.max_effect_across = 0.75;
    this.min_effect_down = 0.5;
    this.max_effect_down = 1;
    this.promotion_gain = 10;
    this.min_resistance = 0;
    this.max_resistance = 1;
    this.coworkers = [];
    this.staff = [];
    this.boss = false;
    this.num_bosses = 0;
    this.num_coworkers = 0;
    this.num_staff = 0;
    $.extend(this, config);
    this.add();

};

HappyWorkplace.Node.prototype = {
    add_coworker : function(coworker) {
        this.coworkers.push(coworker);
        this.num_coworkers += 1;
    },
    
    employ: function () {
        console.log('adding staff...');
        new_staff = new HappyWorkplace.Node({boss: this},new HappyWorkplace.Worker);
        new_staff.num_bosses = this.num_bosses + 1;
        console.log('getting coworkers');
        if(this.num_staff > 0) new_staff.coworkers = this.staff[0].coworkers;
        
        //first add this staff member as a coworker of all of this Node's staff
        console.log('updating coworkers...');
        for(var i = 0; i < this.staff.length; i++ ) {
            this.staff[i].add_coworker(new_staff);
        }
        
        if(this.num_staff > 0) new_staff.num_coworkers = this.staff[0].num_coworkers;
        
        //now add this staff member to the list of this Node's staff
        this.staff.push(new_staff);
        this.num_staff += 1;
    },
    
    status: function () {
        return this.worker.status() + "\n" + 
                 "He has:" + "\n" +
                 " " + this.num_bosses + " bosses" + "\n" + 
                 " " + this.num_staff + " staff" + "\n" + 
                 " " + this.num_coworkers + " coworkers" + "\n" +
                "===============================================";
    },
    
    add: function () {
        $('#canvas').append(this.worker.face);
    },
    
    render: function () {
            
    }
    
};

/*
 * Network object literal
 */
HappyWorkplace.Network = {
    
    nodes: [],
    num_nodes: 0,
    
    createNode: function() {
        node = {};
        this.addNode(node);
    },
    
    addNode: function(node) {
        this.nodes.push(node);
        this.num_nodes += 1;
    }
    
};

//A face object literal
HappyWorkplace.Face = function () {
    
};

//var worker;
//worker = new HappyWorkplace.Worker({min_happy: 5, max_happy:95});
//worker2 = new HappyWorkplace.Worker({min_happy: 1, max_happy:99});
var boss;
$(document).ready(function() {
    boss = new HappyWorkplace.Node();
    boss.employ();
});



//Initialise the simulation (a self-executing singleton)
/*HappyWorkplace.simulation = (function(){
    
    return {
        
        init: function() {
            worker = Object.create(HappyWorkplace.Worker);
            worker.hire({min_happy: 5, max_happy:95});
            return worker;
        }

    };
    
})();*/
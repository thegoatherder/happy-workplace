//Namespace
var HappyWorkplace = HappyWorkplace || {};

/*
 * Worker Object
 */
HappyWorkplace.Worker = function(config) {
    
    //config
    this.min_happy = 0;
    this.max_happy = 100;
    this.happiness = 100;
    this.id = nameGen.capitalize(nameGen.randomName());
    
    //overwrite defaults with any passed params
    $.extend(this, config);
    
    //create this worker's face DOM element (don't append to DOM yet)
    this.make_face();
        
};

HappyWorkplace.Worker.prototype = {
    
    /**
     * Change this worker's happiness
     * @var float amount
     */
    update_happiness: function(amount) {
        this.happiness = amount;
        this.correct_happiness();
        this.happiness = Math.round(this.happiness*10)/10;
        this.render();
    },

    /**
     * Ensure this worker's happiness never exceeds max/min allowed
     */
    correct_happiness: function() {
        if(this.happiness > this.max_happy) this.happiness = this.max_happy;
        else if(this.happiness < this.min_happy) this.happiness = this.min_happy;
    },
    
    /**
     * Human readable happiness
     * @return string
     */
    status: function () {
        return "Worker " + this.id + ' is ' + this.happiness + '% happy';
    },
    
    /**
     * Creates a DOM object for this worker's face (doesn't append the element)
     */
    make_face: function () {
        this.face = $('<div class="yellow smileyface"><p class="eyes lefteye"></p><p class="eyes righteye"></p><div class="smile"></div></div>');
    },
    
    /**
     * Redraw the worker's face with the current happiness
     */
    render: function () {
        //@todo implement this
    }
};

/*
 * Node Object Literal
 */
HappyWorkplace.Node = function (config, worker) {
    
    //add the passed worker, or create on on the fly
    this.worker = worker || new HappyWorkplace.Worker();
    
    //configuration
    this.min_effect_up = 0;
    this.max_effect_up = 0.5;
    this.min_effect_across = 0.25;
    this.max_effect_across = 0.75;
    this.min_effect_down = 0.5;
    this.max_effect_down = 1;
    this.promotion_gain = 10;
    this.min_resistance = 0;
    this.max_resistance = 1;
    
    //related nodes
    this.coworkers = [];
    this.staff = [];
    this.boss = false;
    
    //counters
    this.num_bosses = 0;
    this.num_coworkers = 0;
    this.num_staff = 0;
    
    //overwrite defaults with any passed params
    $.extend(this, config);
    
    //div to hold child nodes
    this.staff_div = $('<div class="staff"></div>');
    this.staff_div_added = false;

};

HappyWorkplace.Node.prototype = {
    
    /**
     * Adds a coworker to this Node's coworkers[]
     * @var Node coworker
     */
    add_coworker : function(coworker) {
        this.coworkers.push(coworker);
        this.num_coworkers += 1;
    },
    
    /**
     * Creates a new worker node
     * Updates this workers staff[]
     * Updates this workers' staff.coworkers[]
     */
    employ: function () {
        
        //Create the Node
        new_staff = new HappyWorkplace.Node({boss: this},new HappyWorkplace.Worker());
        new_staff.num_bosses = this.num_bosses + 1;
        
        //This Node has the same coworkers[] as any of its coworkers
        if(this.num_staff > 0) new_staff.coworkers = this.staff[0].coworkers;
        
        //first add this staff member as a coworker of all of this Node's staff
        for(var i = 0; i < this.staff.length; i++ ) {
            this.staff[i].add_coworker(new_staff);
        }
        
        //Update this Node's number of staff
        if(this.num_staff > 0) new_staff.num_coworkers = this.staff[0].num_coworkers;
        
        //now add this staff member to the list of this Node's staff (child nodes)
        this.staff.push(new_staff);
        this.num_staff += 1;
        
        //Append the new staff member to the document
        new_staff.add();
    },
    
    /**
     * Human readable status of this Node
     * @return string
     */
    status: function () {
        return this.worker.status() + "\n" + 
                 "He has:" + "\n" +
                 " " + this.num_bosses + " bosses" + "\n" + 
                 " " + this.num_staff + " staff" + "\n" + 
                 " " + this.num_coworkers + " coworkers" + "\n" +
                "===============================================";
    },
    
    /**
     * Append the Node's smiley element to the DOM
     */
    add: function () {
        //If this is The Boss (has no boss), append it to the canvas
        if( ! this.boss ) {
            $('#canvas').append(this.worker.face);
        }
        //Or if we have a boss...
        else {
            //Make sure we have a staff container for this Node's boss
            if( ! this.boss.staff_div_added ) {
                $('#canvas').append(this.boss.staff_div);
                this.boss.staff_div_added = true;
            } 
            //Append this node to our boss's staff container
            $(this.boss.staff_div).append(this.worker.face);
        }
        
        //store 'this' as jQuery click handler will overwrite it
        var $this = this;
        
        //Click handler: employ
        $(this.worker.face).click(function() { 
            $this.employ(); 
            console.log($this.status());
        });
    },
    
    /**
     * Update the node's smiley face with new happiness
     */
    render: function () {
        this.worker.render();
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

var boss;
$(document).ready(function() {
    boss = new HappyWorkplace.Node();
    boss.add();
    //boss.employ();
    //boss.employ();
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
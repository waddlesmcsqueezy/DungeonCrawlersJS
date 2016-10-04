var classAbilities = {
    lycan: {
        transformToBeast: function() {		//Part 1 of ability "Beast Blood"
            this.agility += 5;
            if(agility <= 0) {this.agility = 1;}
            this.strength += 5;
            if(strength <= 0) {this.strength = 1;}
        },

        transformFromBeast: function() {		//Part 2 of ability "Beast Blood"
            this.agility -= 5;
            this.strength -= 5;
        },

        pounce: function() {//mutually exclusive with charge

        },

        charge: function() { //mutually exclusive with pounce

        },

        bloodThirst: function() {

        },

        moonlight: function() {

        },

        bane: function() {

        },

        feral: function() {
        	
        }
    }
}
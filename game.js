var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'Dungeon Crawlers', {
    preload: preload,
    create: create,
    update: update
});

const WORLD_SCALE = 64;

//DEFINE PATHFINDING V

var map =       [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	             [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1],
	             [1,0,0,0,0,0,0,1,1,1,0,0,0,0,0,1],
	             [1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1],
	             [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
	             [1,0,0,0,0,1,1,0,0,0,0,1,0,0,0,1],
	             [1,0,0,0,1,1,0,0,0,0,1,1,1,0,0,1],
	             [1,0,0,0,1,0,0,0,0,0,1,1,1,0,0,1],
	             [1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1],
	             [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
	             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	             [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	             [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];

var pathfinder = new EasyStar.js();

pathfinder.setGrid(map);

//END PATHFINDING ^

//DEFINE ENUMS! V

var abilityTypes = {
    PROC: 1,
    PASSIVE: 2,
    ACTIVE: 3
}

var potionTypes = {
    HEALTH: 1,
    BUFF: 2
}

itemTypes = {
	WEAPON: 1, // weapon
	ARMOR: 2, //armor item
	FOOD: 3, //food item
	AID: 4, // aid/health item
	DRUG: 5, //drug
	PART: 6, //crafting ingredient
	QST: 7, //quest item
}

weaponTypes = {
	MELEE: 1,
	RANGED: 2,
}

var itemTiers = {
    WHITE: 1,
    GREEN: 2,
    BLUE: 3,
    PURPLE: 4,
    PINK: 5,
    RED: 6,
    ORANGE: 7
}

var armorSlots = {
    HEAD: 1,
    TORSO: 2
}

var equipSlots = {
    RIGHT: 1,
    LEFT: 2,
    TWO: 3
}

//END ENUMS ^

//BEING LOADING V

function preload() {

    game.load.image('highwayman', 'assets/highwayman_idle.png');

    game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/spritesheet.png');

    game.load.image('error', 'assets/error.png');

    game.load.image('hint', 'assets/hint.png');
    game.load.image('inv', 'assets/inv.png');
}

//END LOADING ^

//CREATE GAME WORLD V

var map;
var layer;

function create() {

	// levedList1 = new LeveledList(null);

    game.world.resize(6400, 6400);

    cursors = game.input.keyboard.createCursorKeys();

    interact = game.input.keyboard.addKey(Phaser.KeyCode.E);

    game.stage.backgroundColor = '#000000';

    map = new GameMap('map', 'wall', 'floor', 'objects', 'tiles');

    playerClass = new LycanClass();

    enemyClass = new EnemyClass();

    player = new Actor('player', playerClass, 'highwayman');

    enemy = new Actor('enemy1', enemyClass, 'highwayman');

    player.sprite.position.setTo(64, 64);

    enemy.sprite.position.setTo(512, 64);

    console.log(player.gridX);
    console.log(player.gridY);

    hint = game.add.sprite(0,0,'hint');
    hint.scale.setTo(3,3);
    hint.smoothed = false;
    hint.visible = false;

    // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    pathfinder.setAcceptableTiles([0]);
    //easystar.enableCornerCutting();
}

//END CREATING GAME WORLD ^

//GAME LOOP V

function update() {

	hint.x = game.input.mousePointer.x;

	hint.y = game.input.mousePointer.y - hint.height;

    game.camera.x = (player.sprite.x - (game.width / 2)) + 32;
    game.camera.y = (player.sprite.y - (game.height / 2)) + 32;

    enemy.updateGrid();
    player.updateGrid();

    if (player.turnsLeft > 0) {

        if (!player.isMoving) {

            if (cursors.up.isDown) {
                if (player.getWallAbove(map) == null) {
                    player.isMoving = true;
                    player.move(0, -1);
                    player.useTurn();
                    console.log(player.getWallAbove(map))
                } else {
                    console.log('tile is solid')
                }
            } else if (cursors.down.isDown) {
                if (player.getWallBelow(map) == null) {
                    player.isMoving = true;
                    player.move(0, 1);
                    player.useTurn();
                    console.log(player.getWallBelow(map))
                } else {
                    console.log('tile is solid')
                }
            } else if (cursors.left.isDown) {
                if (player.getWallLeft(map) == null) {
                    player.isMoving = true;
                    player.move(-1, 0);
                    player.useTurn();
                    console.log(player.getWallLeft(map))
                } else {
                    console.log('tile is solid')
                }
            } else if (cursors.right.isDown) {
                if (player.getWallRight(map) == null) {
                    player.isMoving = true;
                    player.move(1, 0);
                    player.useTurn();
                    console.log(player.getWallRight(map))
                } else {
                    console.log('tile is solid')
                }
            } else if (interact.isDown) {
                if (player.getObjectUnder(map) != null) {
                    console.log('getting items')
                    map.removeObject(player.gridX, player.gridY);
                    player.useTurn();
                } else {
                    console.log('nothing underfoot')
                }
            }
        }
    }

    if (player.turnsLeft <= 0) {

        //enemy turn
        findPath(enemy, player.gridX, player.gridY);

        //reset player turns
        player.resetTurns();
    }

}

//END OF GAME LOOP

//BEGIN CLASS DEFINITIONS V

class Actor {
    constructor(name, characterClass, sprite) {
    	this.name = name;

    	this.characterClass = characterClass;

        //inventory
        this.maxWeight = (((this.strength + 5) * 15) / 1.5);
        this.inventory = [];

        //turn based logic
        this.maxTurns = 1;
        this.turnsLeft = this.maxTurns;

        //visual stuff
        this.isMoving;

        this.sprite = game.add.sprite(0, 0, sprite);

        this.sprite.smoothed = false;

        //tile grid position - has nothing to do with graphics
        this.gridX = this.sprite.x / 64;
        this.gridY = this.sprite.y / 64;
    }

    getWallAbove(map) {
        return map.tileMap.getTile(this.gridX + 0, this.gridY - 1, map.wall);
    }

    getWallBelow(map) {
        return map.tileMap.getTile(this.gridX + 0, this.gridY + 1, map.wall);
    }

    getWallLeft(map) {
        return map.tileMap.getTile(this.gridX - 1, this.gridY + 0, map.wall);
    }

    getWallRight(map) {
        return map.tileMap.getTile(this.gridX + 1, this.gridY + 0, map.wall);
    }


    getObjectUnder(map) {
        return map.tileMap.getTile(this.gridX, this.gridY, map.objects);
    }

    move(x, y) {
        game.add.tween(this.sprite).to({
                x: this.sprite.x + x * WORLD_SCALE,
                y: this.sprite.y + y * WORLD_SCALE
            }, 250,
            Phaser.Easing.Quadratic.InOut, true).onComplete.add(function() {
            this.isMoving = false;
        }, this);
    }

    interactAnim() {
        game.add.tween(this.sprite).to({}, 250,
            Phaser.Easing.Quadratic.InOut, true).onComplete.add(function() {
            this.isMoving = false;
        }, this);
    }

    useTurn() {
        this.turnsLeft -= 1;
    }

    resetTurns() {
        this.turnsLeft = this.maxTurns;
    }

    updateGrid() {
        this.gridX = this.sprite.x / 64;
        this.gridY = this.sprite.y / 64;
    }

    findPathTo(destinationX, destinationY) { //tilex & tiley = desired location - likely player's position.

    }

    addItemToInventory(item) {
        if (item != null) {
	        if (this.inventory[0] != null) {
	            if (item.weight + this.getInventoryWeight() < this.maxWeight) {
	                this.inventory.push(item);
	            } else { console.log("Item would exceed carry limit."); }
	        } else { this.inventory.push(item); }
	    } else { console.log("DUNGEON CRAWLERS: Not a valid Item."); }
    }

    removeItemFromInventory(item) {
        if (typeof item == "string") {
            var itemIndex = this.inventory.indexOf(item);
            this.inventory.splice(itemIndex, 1);
        }

        if (typeof item == "number") {
            this.inventory.splice(item, 1);
        }
    }

    getInventoryWeight() {
        var weight = 0;
        for (var i = 0; i < this.inventory.length; i++) {
            weight += this.inventory[i].weight;
        }
        return weight;
    }
}

class GameMap {
    constructor(key, wallLayer, floorLayer, objectLayer, tileSet) {

        this.wallIndex = 1;
        this.floorIndex = 2;
        this.objectIndex = 3;

        this.tileMap = game.add.tilemap(key);

        this.tileMap.addTilesetImage(tileSet, tileSet, 64, 64);

        this.floor = this.tileMap.createLayer(floorLayer);

        this.wall = this.tileMap.createLayer(wallLayer);

        this.objects = this.tileMap.createLayer(objectLayer);
    }

    removeObject(x, y) {

        this.tileMap.removeTileWorldXY(x, y, 1, 1, this.objects);
        this.putFloorTile(x, y);
    }

    putFloorTile(x, y) {

        this.tileMap.putTile(this.floorIndex, x, y, this.floor);
    }
}

class Quest {
    constructor(name, description, exp, reward, itemReward, stages) {
        this.name = name;
        this.description = description;
        this.exp = exp;
        this.reward = reward;
        this.itemReward = itemReward;
        this.totalStages = totalStages;
        this.currentStage = 0;
    }

    advanceStage() {
        this.currentStage += 1;
    }

    checkComplete() {
        if (this.currentStage >= this.totalStages) {
            return true;
        }
    }
}

class Bounty {
    constructor(name, description, exp, reward, stages) {
        this.name = name;
        this.description = description;
        this.exp = exp;
        this.reward = reward;
        this.currentStage = 0;
        this.stages = stages;
    }

    advanceStage() {
        this.currentStage += 1;
    }

    checkComplete() {
        if (completionState) {
            return true;
        }
    }
}

class CharacterClass {
    constructor(characterClass) {
        //fluff & stats
        this.name = characterClass.name;
        this.description = characterClass.description;
        this.agility = characterClass.baseAgility;
        this.strength = characterClass.baseStrength;
        this.speech = characterClass.baseSpeech;
        this.health = ((((this.strength + this.agility) + 2) * 10) / 5);

        this.skillLevel = 0; //This is the player's current skill tree tier; starts at 0 for all skill trees; 

        this.quests;
        this.completedQuests;
        this.bounties;
        this.completedBounties;
    }
}

class LycanClass extends CharacterClass {
	constructor() {
		super(classes.lycan);
	}	

	transformToBeast() {
		this.agility += 5;
		if(agility <= 0) {this.agility = 1;}
		this.strength += 5;
		if(strength <= 0) {this.strength = 1;}
	}

	transformFromBeast() {
		this.agility -= 5;
		this.strength -= 5;
	}

	proc() {
		if (skillLevel == 0){
			if (this.health < 0.20 * this.health) {this.transformToBeast();}
		}
	}
}

class EnemyClass extends CharacterClass {
	constructor() {
		super(classes.enemy);
	}

	proc() {
		if (skillLevel == 0){
			
		}
	}
}

class Item {
    constructor(item) {
        this.item = item;
        if (this.item.sprite != null) {
            this.sprite = game.add.sprite(0, 0, this.item.sprite);
        } else {
            this.sprite = game.add.sprite(0, 0, 'error');
        }
    }
}

class HealthPotion extends Item {
    constructor(name, description, value, tier, sprite, health) {
        super(name, description, value, tier, sprite);
    }
}

class BuffPotion extends Item {
    constructor(name, description, value, tier, sprite, buffType) {
        super(name, description, value, tier, sprite);
    }
}

class Container {
	constructor(){
		inventory = [];

	}
}

class LeveledList {
	constructor(list) {
		if (list == null) {
			throw "DUNGEON CRAWLERS ERROR: LEVELED LIST INVALID OR DOESNT EXIST\n IF THIS ERROR CONTINUES, SEND THE DEVELOPER A SCREENSHOT OF THE CONSOLE.";
		}
	}
}

function findPath(entity, destinationX, destinationY) {
    pathfinder.findPath(entity.gridX, entity.gridY, destinationX, destinationY, function( path ) {
        if (path === null) {
            console.log("The path to the destination point was not found.");
        } else {
          
            for (var i = 1; i <= entity.turnsLeft; i++)
            {
                console.log("P: " + i + ", X: " + path[i].x + ", Y: " + path[i].y);
                console.log(path[i].x + " " + path[i].y)
                entity.move(path[i].x - entity.gridX, path[i].y - entity.gridY);
            }
            console.log(path);
        }
    });
    
    pathfinder.calculate();
}
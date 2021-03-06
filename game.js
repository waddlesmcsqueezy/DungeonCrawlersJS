

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

var plugins = {
    COLLECTIONS: "plugins/collections/",
}

var errors = {
    genericError: "DUNGEON CRAWLERS ERROR",
    invalidItem: "DUNGEON CRAWLERS ERROR : 001; Invalid Item",
    invalidLeveledList: "DUNGEON CRAWLERS ERROR : 002; Invalid LeveledList",
    invalidRefId: "DUNGEON CRAWLERS ERROR : 003; Invalid RefId",
    invalidWeaponType: "DUNGEON CRAWLERS ERROR : 003, Invalid weapon type"
}

//END ENUMS ^

// REQUIRES V

// var Map = require(plugins.COLLECTIONS + "map");

//END REQUIRES ^

//BEING LOADING V

function preload() {

    game.load.image('highwayman', 'assets/highwayman_idle.png');

    game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/spritesheet.png');

    game.load.image('error', 'assets/error.png');

    game.load.image('hint', 'assets/hint.png');
    game.load.image('inv', 'assets/inv.png');

    game.load.image('sprite_sword', 'assets/sword.png');

    itemManager = new ItemManager();

    // for (var key in items) {
    //   if (items.hasOwnProperty(key)) {
    //     itemManager.collection[Guid.raw()] = items[key];
    //     console.log(key + " -> " + items[key]);
    //   }
    // }
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

    // hint.x = game.input.mousePointer.x;

    // hint.y = game.input.mousePointer.y - hint.height;

    game.camera.x = (player.sprite.x - (game.width / 2)) + 32;
    game.camera.y = (player.sprite.y - (game.height / 2)) + 32;

    if (player.turnsLeft > 0) {
        playerTurn();
        player.updateGrid();
    }

    if (player.turnsLeft <= 0 && !player.isMoving) {

        //enemy turn
        enemyTurn();
        enemy.updateGrid();

        //reset player turns
        player.resetTurns();
    }

}

//END OF GAME LOOP

//BEGIN CLASS DEFINITIONS V

// ______            _                     _ 
// | ___ \          | |                   | |
// | |_/ / __ _  ___| | __   ___ _ __   __| |
// | ___ \/ _` |/ __| |/ /  / _ \ '_ \ / _` |
// | |_/ / (_| | (__|   <  |  __/ | | | (_| |
// \____/ \__,_|\___|_|\_\  \___|_| |_|\__,_|                                 

class Actor {
    constructor(name, characterClass, sprite) {
    	this.name = name;

    	this.characterClass = characterClass;

        //inventory
        this.maxWeight = (((this.strength + 5) * 15) / 1.5);
        this.inventory = new Container();

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

//  _____                            _             
// |  __ \                          | |            
// | |  \/ __ _ _ __ ___   ___ _ __ | | __ _ _   _ 
// | | __ / _` | '_ ` _ \ / _ \ '_ \| |/ _` | | | |
// | |_\ \ (_| | | | | | |  __/ |_) | | (_| | |_| |
//  \____/\__,_|_| |_| |_|\___| .__/|_|\__,_|\__, |
//                            | |             __/ |
//                            |_|            |___/ 

class Quest {
    constructor(quest) {
        this.name = quest.name;
        this.description = quest.description;
        this.exp = quest.exp;
        this.reward = quest.reward;
        this.stages = quest.stages;
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
    constructor(bounty) {
        this.name = bounty.name;
        this.description = bounty.description;
        this.exp = bounty.exp;
        this.reward = bounty.reward;
        this.stages = bounty.stages;
        this.currentStage = 0;
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
        this.divinity = characterClass.baseDivinity;
        this.heresy = characterClass.baseHeresy;
        this.intuition = characterClass.baseIntuition;
        this.strength = characterClass.baseStrength;
        this.speech = characterClass.baseSpeech;

        this.maxHealth = ((((this.strength + this.agility) + 2) * 10) / 5);
        this.currentHealth = this.maxHealth;

        this.skills = new Map(); //This is the player's current skill tree tier; starts at 0 for all skill trees;

        this.spells = new Set(); //Player's current collection of spells. Can only have 1 of each spell, infinite uses.

        this.quests = new Map();
        this.completedQuests = new Map();
        this.bounties = new Map();
        this.completedBounties = new Map();
    }
}

class LycanClass extends CharacterClass {
	constructor() {
		super(classes.lycan);
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
        if (item.type == null || item.name == null || item.description == null || item.value == null || item.weight == null || item.tier == null) {
            throw errors.invalidItem; // + "type: " + item.type + "name: " + item.name + "desc: " + item.description + "value: " + item.value + "wgt: " + item.weight + "tier: " + item.tier
        } else {
            this.type = item.type;
            this.name = item.name;
            this.description = item.description;
            this.value = item.value;
            this.weight = item.weight;
            this.tier = item.tier;
        }

        if (item.sprite != null) {
            this.sprite = game.add.sprite(0, 0, item.sprite);
        } else if (item.sprite == null) {
            this.sprite = game.add.sprite(0, 0, 'error');
        }
    }
}

class Weapon extends Item {
    constructor(item) {
        super(item);

        if (item.type != itemTypes.WEAPON || item.damage == null || item.accuracy == null || item.range == null || item.skill1 == null) {
            throw errors.invalidItem;
        } else {
            this.damage = item.damage;
            this.accuracy = item.accuracy;
            this.range = item.range;
            this.skill1 = item.skill1
            if (item.skill2) {
                this.skill2 = item.skill2
            }

            if (item.effect != null) {
                this.effect = item.effect;
            }
        }
    }

    attack(target) {
        if (accuracy < 1.0) {
            if (this.accuracy > (Math.random() * (1.0 - 0.0)) + 0.0) {
                var damageDealt = Math.round(this.damage - target.strength);
                target.health -= damageDealt;
            }
        }
    }
}

class Armor extends Item {
    constructor(item) {
        super(item);

        if (item.type != itemTypes.ARMOR || item.protection == null || item.skill1 == null) { 
            throw errors.invalidItem; 
        } else {
            this.protection = item.protection;
            this.slot = item.slot;
            this.skill1 = item.skill1
            if (item.skill2) {
                this.skill2 = item.skill2
            }
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

class Spell {
    constructor(spell) {
        this.name = spell.name;
        this.description = spell.name
    }
}

class Container {
	constructor(){
        this.containingItems = new Map();
        this.maxWeight = 200;
    }

    addItemToInventory(item) {
        if (item != null) {
            console.log("Guid: " + item.guid + " | " + "Values: " + item.values);
            // this.containingItems[item] = item;
            this.containingItems.set(item.guid, item.values);
        } else { throw errors.invalidItem; }
    }

    removeItemFromInventory(refId) {
        if (item.type != itemTypes.QST) {
            this.collection.delete(refId);
        } else if (item.type == itemTypes.QST) { console.log("Can't drop quest items!") }
    }

    transferItem(refId, container) {
        if (refId != null) {
            container.addItemToInventory(refId);
            this.containingItems.delete(refId);
        }
    }

    getInventoryWeight() {
        var weight = 0;
        for (var i = 0; i < this.containingItems.length; i++) {
            weight += this.containingItems[i].weight;
        }
        return weight;
    }
}

class LeveledList {
	constructor(list) {
		if (list == null) {
			throw errors.invalidLeveledList;
		}
	}
}

class ItemManager {
    constructor() {
        this.collection = new Map();
    }

    createSendItem(baseId, container) {
        if (baseId != null) {
            switch (baseId.type) {
                case itemTypes.ARMOR:
                    var newItem = new Armor(baseId);
                    break;
                case itemTypes.WEAPON:
                    var newItem = new Weapon(baseId);
                    break;
                default:
                    throw errors.invalidWeaponType;
            }
            var guid = Guid.raw();
            console.log("Created new Item: " + guid + " - stats: " + newItem);
            var itemObject = {"guid" : guid, "values" : newItem};
            this.sendItemToContainer(itemObject, container);
        } else { throw errors.invalidItem; }
    }

    sendItemToContainer(refId, container) {
        if (refId != null) {
            container.addItemToInventory(refId);
        } else { throw errors.invalidRefId; }
    }
}

//  _____                  _                 _      
// |_   _|                | |               (_)     
//   | |_   _ _ __ _ __   | |     ___   __ _ _  ___ 
//   | | | | | '__| '_ \  | |    / _ \ / _` | |/ __|
//   | | |_| | |  | | | | | |___| (_) | (_| | | (__ 
//   \_/\__,_|_|  |_| |_| \_____/\___/ \__, |_|\___|
//                                      __/ |       
//                                     |___/        

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

function playerTurn() {
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

function enemyTurn() {
    findPath(enemy, player.gridX, player.gridY);
}
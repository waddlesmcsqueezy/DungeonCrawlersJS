var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'Dungeon Crawlers', {
    preload: preload,
    create: create,
    update: update
});

const WORLD_SCALE = 64;

var abilityTypes = {
    PROC: 1,
    PASSIVE: 2,
    ACTIVE: 3
}

var potionTypes = {
    HEALTH: 1,
    BUFF: 2
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

function preload() {

    game.load.image('highwayman', 'assets/highwayman_idle.png');

    game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/spritesheet.png');

    game.load.image('error', 'assets/error.png');
}

var map;
var layer;

function create() {

	// levedList1 = new LeveledList(null);

    game.world.resize(6400, 6400);

    cursors = game.input.keyboard.createCursorKeys();

    interact = game.input.keyboard.addKey(Phaser.KeyCode.E);

    game.stage.backgroundColor = '#000000';

    map = new GameMap('map', 'wall', 'floor', 'objects', 'tiles');

    player = new Actor('name', 'placeholder', 10, 10, 10, 'highwayman', 64, 64, true);

    player.sprite.position.setTo(64, 64);

    console.log(player.gridX)
    console.log(player.gridY)

    // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
}

function update() {

    game.camera.x = (player.sprite.x - (game.width / 2)) + 32;
    game.camera.y = (player.sprite.y - (game.height / 2)) + 32;

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

    console.log(player.turnsLeft);

    if (player.turnsLeft <= 0) {

        //enemy turn

        //reset player turns
        player.resetTurns();
    }

}

class Actor {
    constructor(name, characterClass, agility, strength, speech, sprite, isPlayer) {

        //fluff & stats
        this.name = name;
        this.characterClass = characterClass;
        this.agility = agility;
        this.strength = strength;
        this.speech = speech;
        this.health = ((((this.strength + this.agility) + 2) * 10) / 5);

        //inventory
        this.maxWeight = (((this.strength + 5) * 15) / 1.5);
        this.inventory = [];

        //abilities and perks  
        this.skills;
        this.perks;

        //turn based logic
        this.maxTurns = 1;
        this.turnsLeft = this.maxTurns;

        //visual stuff
        this.isMoving;

        this.sprite = game.add.sprite(0, 0, sprite);

        this.sprite.smoothed = false;

        this.gridX = this.sprite.x / 64;
        this.gridY = this.sprite.y / 64;

        this.isPlayer = isPlayer;

        if (isPlayer) {
            this.quests;
            this.completedQuests;
            this.bounties;
            this.completedBounties;
        }
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

    addItemToInventory(item) {
        if (item == null) {
            console.log("invalid item");
        } else if (this.inventory[0] != null) {
            if (item.weight + this.getInventoryWeight() < this.maxWeight) {
                this.inventory.push(item);
            } else {
                console.log("Item would exceed carry limit.")
            }
        } else {
            this.inventory.push(item);
        }
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
    constructor(name, description, baseAgility, baseStrength, baseSpeech, skillTree) {
        this.name = name;
        this.description = description;

        this.baseAgility = baseAgility;
        this.baseStrength = baseStrength;
        this.baseSpeech = baseSpeech;

        this.skillTree = skillTree;
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
			throw "DUNGEON CRAWLERS ERROR: LEVELED LIST INVALID OR DOESNT EXIST";
		}
	}
}
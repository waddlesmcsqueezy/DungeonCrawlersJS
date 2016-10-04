var Items = {};

Items.BASE_ITEM = {
	type : itemTypes.QST,
	name : "Item001",
	description : "Description001",
	value : 1,
	weight : 1,
	tier : itemTiers.WHITE,
	sprite : 'sprite_sword'
}

//COMMON ITEMS / WHITE

Items.WEAPON_WHITE_SWORD_001 = {
	type : itemTypes.WEAPON,
	name : "Old Sword",
	description : "A rusty blade.",
	value : 25,
	weight : 3,
	tier : itemTiers.WHITE,
	sprite : "",
	damage : 5,
	accuracy : 85,
	range : 1,
	skill1 : stats.STRENGTH
},

Items.ARMOR_WHITE_TORSO_001 = {
	type : itemTypes.ARMOR,
	name : "Rusty Chestplate",
	description : "An antique. Found hanging over a fireplace.",
	value : 25,
	weight : 6,
	tier : itemTiers.WHITE,
	sprite : "",
	slot : armorSlots.TORSO,
	protection : 5,
	skill1 : stats.STRENGTH
},

//ARTIFACTS / ORANGE

Items.WEAPON_ORANGE_SWORD_FIRE = {
	type : itemTypes.WEAPON,
	name : "The Flame of Damnation",
	description : "A sword born in the heart of an ancient dragon. It's ember resonates with the soul of a Great Lord.",
	value : 1500,
	weight : 4,
	tier : itemTiers.ORANGE,
	sprite : "",
	damage : 20,
	accuracy : 95,
	range : 1,
	skill1 : stats.STRENGTH,
	skill2 : stats.AGILITY,
	effect : Effects.fire
}
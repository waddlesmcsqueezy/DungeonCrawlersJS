var Effects = {};

Effects.fire = {
	name: 'Ember',
	description: "Burns flesh very well.",
	color: "#ff6600",
	type: effectTypes.DAMAGE,
	damage: 8,			//Base damage
	apply: function (caster, target) {
		target.health -= Math.round(((caster.intuition * damageScales.C) + (caster.divinity * damageScales.E) / 2) + damage);
	}
}

Effects.light = {
	name: 'Light',
	description: "The damage of one that is holy.",
	color: "#ccff66",
	type: effectTypes.DAMAGE,
	damage: 5,			//Base damage
	apply: function (caster, target) {
		target.health -= Math.round((caster.divinity * damageScales.B) + damage);
	}
}

Effects.curse = {
	name: 'Curse',
	description: "Incantation of one who is attuned to the dark arts.",
	color: "#000066",
	type: effectTypes.DAMAGE,
	damage: 10,			//Base damage
	apply: function (caster, target) {
		target.health -= Math.round(((caster.intuition * damageScales.E) + (caster.heresy * damageScales.D) / 2) + damage);
	}
}

Effects.slash = {
	name: 'Slash',
	description: "Opening wounds on one's enemy creates despair.",
	color: "",
	type: effectTypes.DAMAGE,
	damage: 9,			//Base damage
	apply: function (caster, target) {
		target.health -= Math.round(((caster.agility * damageScales.D) / 2) + damage);
	}
}

Effects.trauma = {
	name: 'Trauma',
	description: "Cracking of bones, crushing of blows, brute force can drive one's will to live.",
	color: "",
	type: effectTypes.DAMAGE,
	damage: 7,
	apply: function (caster, target) {
		target.health -= Math.round(((caster.strength * damageScales.E) / 2) + damage);
	}
}
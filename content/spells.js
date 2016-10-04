var Spells = new Map();

Spells.set(
"BASE_SPELL", 
{
	category : spellCategories.SORCERY,
	type: effectTypes.SPECIAL,
	name : 'Spell001',
	description : "Description001",
	level : 0,
	staminaCost : 1,
	inventorySprite : "error"
});

Spells.set(
	"HEAL_SPELL_001", 
{
	category : spellCategories.HOLY,
	type: effectTypes.HEAL,
	name : 'Heal',
	description : "A lesser healing spell.",
	level : 0,
	staminaCost : 10,
	inventorySprite : "error",
	healAmount : 12
});

Spells.set(
	"DARK_BOLT_001",
{
	category : spellCategories.UNHOLY,
	type: effectTypes.DAMAGE,
	name : 'Dark Bolt',
	description : "A sphere of dark energy.",
	level : 0,
	staminaCost : 15,
	inventorySprite : "error",
	damage : 15
});

Spells.set(
	"HEALTH_BUFF_001",
{
	category : spellCategories.SORCERY,
	type: effectTypes.BUFF,
	name : 'Vigor',
	description : "A spell that increases vitality.",
	level : 0,
	staminaCost : 10,
	inventorySprite : "error",
	buffType: buffTypes.PERCENT
	buffedStat: stats.MAXHEALTH,
	buffAmount: 0.20
});
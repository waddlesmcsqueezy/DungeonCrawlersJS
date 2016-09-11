

var intelligentPrePrefixes = preprefixes.intelligent;
var intelligentPrefixes = prefixes.intelligent;
var intelligentNames = names.intelligent;
var intelligentSuffixes = suffixes.intelligent;

var normalPrePrefixes = preprefixes.normal;
var normalPrefixes = prefixes.normal;
var normalNames = names.normal;
var normalSuffixes = suffixes.normal;

var primitivePrePrefixes = preprefixes.primitive;
var primitivePrefixes = prefixes.primitive;
var primitiveNames = names.primitive;
var primitiveSuffixes = suffixes.primitive;

function randomIndex(array) {
	return Math.floor((Math.random() * array.length) + 0)
}

function pickRandomName(prePrefixArray, prefixArray, nameArray, suffixArray) {

	prePrefixIndex = randomIndex(prePrefixArray);
	prefixIndex = randomIndex(prefixArray);
	nameIndex = randomIndex(nameArray);
	suffixIndex = randomIndex(suffixArray);

	var name = nameArray[nameIndex].name;

	if (.50 > Math.random()) {

		finalName = prePrefixArray[prePrefixIndex].name + " " + prefixArray[prefixIndex].name + " of " + name;
	} else {

		finalName = name + " " + suffixArray[suffixIndex].name;
	}

	return finalName;
}

class Name {
	constructor(name, description, type) {
		this.name = name;
		this.description = description;
		this.type = type;
	}
}

function createRandomInhabitant(description) {

	var inhabitant;

	if (type.intelligence < 5) {
		var inhabitant = new Inhabitant(pickRandomName(primitivePrePrefixes,primitivePrefixes,
			primitiveNames,primitiveSuffixes), description, type);
	}

	if (type.intelligence < 8 && type.intelligence >= 5) {
		var inhabitant = new Inhabitant(pickRandomName(normalPrePrefixes, normalPrefixes, normalNames, normalSuffixes), description, type);
	}

	if (type.intelligence >= 8) {
		var inhabitant = new Inhabitant(pickRandomName(intelligentPrePrefixes, intelligentPrefixes,
			intelligentNames, intelligentSuffixes), description, type);
	}

	return inhabitant;
}

inhabitant = createRandomInhabitant("Placeholder");
console.log(inhabitant);
console.log(inhabitant.type);
let settings = {
	mapWidth: 500,
	mapHeight: 500,
	seed: 123,
	scale: 250,
	octaves: 4,
	ex: 1.0,
	colour: false
};

let biomes = null;

function setup() {
	createCanvas(1000, 1000);
	setMapData(settings);
	biomes = [
		ocean1 = {
			altitude: 0.25,
			colour: color(2, 30, 103),
		},
		ocean2 = {
			altitude: 0.35,
			colour: color(35, 61, 128),
		},
		sand = {
			altitude: 0.415,
			colour: color(255, 204, 0),
		},
		grass1 = {
			altitude: 0.5,
			colour: color(23, 176, 3),
		},
		grass2 = {
			altitude: 0.62,
			colour: color(20, 151, 2),
		},
		grass3 = {
			altitude: 0.7,
			colour: color(16, 115, 2),
		},
		rock1 = {
			altitude: 0.75,
			colour: color(153, 77, 0),
		},
		rock2 = {
			altitude: 0.95,
			colour: color(128, 64, 0),
		},
		snow = {
			altitude: 1,
			colour: color(255, 255, 255),
		}
	];
}

function draw() {
	updateMap(settings);
	//showColorMap(circularGradient(500, 500), 500, 500);
	noLoop();
}

function showNoiseMap(noiseMap, mapWidth, mapHeight) {
	loadPixels();
	for (let x = 0; x < mapWidth; x++) {
		for (let y = 0; y < mapHeight; y++) {
			let currentHeight = noiseMap[x][y];
			let colour = color(255 * currentHeight);
			set(x, y, colour);
		}
	}
	updatePixels();
}

function showColorMap(colorMap, mapWidth, mapHeight) {
	//loadPixels();
	for (let x = 0; x < mapWidth; x++) {
		for (let y = 0; y < mapHeight; y++) {
			let colour = colorMap[x][y];
			set(x, y, colour);
		}
	}
	updatePixels();
}

function updateMap(mapSettings) {
	settings = mapSettings;
	console.log("NEW MAP");
	let map = GenerateNoiseMap(settings.mapWidth, settings.mapHeight, settings.seed, settings.scale, settings.octaves, settings.ex);
	updatePixels();

	if (settings.colour)
		showColorMap(map.colourMap, settings.mapWidth, settings.mapHeight);
	else
		showNoiseMap(map.noiseMap, settings.mapWidth, settings.mapHeight);
}

function updatePixel(x, y, colour) {
	set(x, y, colour);
}
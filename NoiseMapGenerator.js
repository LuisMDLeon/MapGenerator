let simplex = null;

'use strict';

function GenerateNoiseMap(mapWidth, mapHeight, seed, scale, octaves, ex, callback, persistence = 0.3, lacunarity = 4) {
    randomSeed(seed);
    simplex = new SimplexNoise(random);
    let noiseMap = [];
    let colourMap = [];

    let minHeight = Infinity;
    let maxHeight = -Infinity;

    let offsets = Array.from(Array(octaves), () => ({
        offsetX: random(-10, 10),
        offsetY: random(-10, 10)
    }));

    let halfH = mapHeight / 2;
    let halfW = mapWidth / 2;

    for (let x = 0; x < mapWidth; x++) {
        noiseMap[x] = []
        for (let y = 0; y < mapHeight; y++) {
            let amplitude = 1;
            let frequency = 1;
            let noiseHeight = 0;

            for (let i = 0; i < octaves; i++) {
                let sampleX = (x - halfW) / scale * frequency + offsets[i].offsetX;
                let sampleY = (y - halfH) / scale * frequency + offsets[i].offsetY;

                let perlinValue = simplex.noise2D(sampleX, sampleY) * 2 + 0.5;
                noiseHeight += perlinValue * amplitude;

                amplitude *= persistence;
                frequency *= lacunarity;
            }

            //noiseHeight = Math.pow(noiseHeight, ex);

            if (noiseHeight > maxHeight) {
                maxHeight = noiseHeight;
            } else if (noiseHeight < minHeight) {
                minHeight = noiseHeight;
            }
            noiseMap[x][y] = noiseHeight;
        }
    }
    for (let x = 0; x < mapWidth; x++) {
        colourMap[x] = [];
        for (let y = 0; y < mapHeight; y++) {
            noiseMap[x][y] = map(noiseMap[x][y], minHeight, maxHeight, 0, 1);
            noiseMap[x][y] = Math.pow(noiseMap[x][y], ex);
            colourMap[x][y] = setBiome(noiseMap[x][y]);
            if (callback) callback(x, y, colourMap[x][y]);
        }
    }

    //setHeightEffect(noiseMap, colourMap, mapHeight, mapWidth);
    return {
        noiseMap,
        colourMap
    };
}

function setBiome(altitude) {
    for (let i = 0; i < biomes.length; i++) {
        if (altitude <= biomes[i].altitude) {
            return biomes[i].colour;
        }
    }
}

function setHeightEffect(noiseMap, colourMap, height, width) {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let currentHeight = noiseMap[x][y];
            let currentColour = colourMap[x][y];
            if (y + 1 < height) {
                if (currentColour != colourMap[x][y + 1] && currentHeight < 2 && currentHeight > noiseMap[x][y + 1]) {
                    colourMap[x][y + 1] = color(red(currentColour) * 0.5, green(currentColour) * 0.5, blue(currentColour) * 0.5);
                    noiseMap[x][y + 1] = 2;
                }
            }
        }
    }
}

function circularGradient(mapWidth, mapHeight) {
    let circularMap = [];
    let cx = parseInt(mapWidth / 2);
    let cy = parseInt(mapHeight / 2);

    let maxDist = Math.sqrt((mapWidth * mapHeight) / 2);

    for (let x = 0; x < mapWidth; x++) {
        circularMap[x] = [];
        for (let y = 0; y < mapHeight; y++) {
            let distance = dist(cx, cy, x, y);
            let height = map(distance, 0, maxDist, 1, 0);
            circularMap[x][y] = color(255 * height);
            //console.log(height);
        }
    }
    return circularMap;
}
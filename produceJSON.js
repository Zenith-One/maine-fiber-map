let shapefile = require('shapefile');
let fs = require('fs');

let colors = {};
let usedColors = {};

function random255(){
  return Math.floor(Math.random() * 256);
}

function getRandomRGB(){
  return [random255(), random255(),random255()];
}

function getRandomColorCode() {
  let rgb = getRandomRGB();
  return rgb
    .map((value) => {
      let str = (value).toString(16);
      while(str.length < 2){
        str = '0' + str;
      }
      return str;
    })
    .join('');
}

function getUnusedColorCode(){
  let uniqueColor;
  let reps = 0;
  while(!uniqueColor && reps < 500) {
    let code = getRandomColorCode();
    if(usedColors[code] === undefined) {
      uniqueColor = code;
    }
    reps += 1;
  }
  return uniqueColor || '000000';
}

function parseGeoJSON(features, outPath, doColors, colorOutPath){
  // console.log(body);
  if(doColors){
    features.forEach((feature) => {
      let owner = feature.properties.OWNER;

      // check to see if there's already a color for this owner
      if(!colors[owner]){
        let uniqueColor = getUnusedColorCode();
        // flag that color as used so we don't repeat
        usedColors[uniqueColor] = true;
        colors[owner] = '#' + uniqueColor;
      }
    });
    // write out the colors to JSON so we can pull them in on the client later.
    let colorWriteStream = fs.createWriteStream(colorOutPath);
    colorWriteStream.write(JSON.stringify(colors));
    colorWriteStream.end();
  }
  let geoJson = {type: "FeatureCollection", features: features};
  let jsonWriteStream = fs.createWriteStream(outPath);
  jsonWriteStream.write(JSON.stringify(geoJson));
  jsonWriteStream.end();
}

function shpToJson(filePath, outPath, doColors, colorOutPath){
  console.log('doing a thing!');
  let features = [];
  shapefile.open(filePath,filePath.replace(/\.shp$/,'.dbf'))
    .then(source => source.read()
      .then(function step(result, acc) {
        if (result.done) {
          console.log('finishing up',filePath);
          parseGeoJSON(features, outPath, doColors, colorOutPath);
          return acc;
        }
        if(result.value){
          features.push(result.value);
        }

        return source.read().then(step);
      }))
    .catch(error => console.error(error.stack));
}

let dataDir = './src/public/data/';
shpToJson(dataDir + 'cables/maine_fiber_cables.shp', dataDir + 'cables/cables.json',true, dataDir + 'colors.json');
shpToJson(dataDir + 'buildings/maine_fiber_buildings.shp', dataDir + 'buildings/buildings.json');

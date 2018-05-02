# Making a Map

## Getting Started

Having built a project or two from scratch in the past, I knew I would prefer to hit the ground running instead, so I began with a [seed project](https://github.com/preboot/angularjs-webpack) and went from there. I chose that particular project because I've been slowly falling in love with webpack over the past couple of years. I was once a zealous supporter of Grunt, but webpack's power and speed won me over in the end. Also I really enjoy ES6+. My final tooling/infrastructure decision was to use [yarn](https://yarnpkg.com/en/) instead of npm for package management.  It's light and quite fast. It works with multiple parallel downloads at a time and automatically generates a lock file which points to the exact package archives used by me. I know that npm's most recent version does this latter part as well, but in my experience it still isn't as fast as yarn.  As an added bonus, yarn hits an npm cache located on CloudFlare, so there's an extra layer of reliability built-in.

That done, I was ready to get going.

```bash
$ yarn install
```

There were several things in the seed project I didn't want or didn't need, so I removed them. There were likewise several things I knew I would.

```bash
$ yarn remove autoprefixer postcss-loader

$ yarn add leaflet leaflet-geometryutil
```

...and so on. If you want to see the full list of dependencies and what have you, you can check out the [package.json](package.json).

The most notable decision I made was in using TypeScript. I wanted to show that TypeScript can play well with AngularJS, and I believe I have managed to do so.

## Data Processing - [produceJSON.js](produceJSON.js)

I knew that I would eventually need to come up with some color-coding for the fiber cables, so I wrote a few functions which collectively generate random colors. In addition, there is a dictionary of used colors which the generator checks against to ensure that the colors for the various cable owners are all unique. A possible future enhancement would be refining the manner in which the colors are generated to also ensure a high level of contrast between different owners.

Processing the shapefiles into geoJSON was likely the most time-consuming part of the entire project. I tried many different approaches (and packages). shp2json, its fork (shp2jsonx), and shpjs all failed to deliver what I needed. I eventually landed on the 'shapefile' package. I saved that one for last specifically because of its strange promise/stream hybrid API. I'd have preferred to use streams for code legibility and elegance, but I decided that code that works was better than code that looks great.

It's worth noting that my original plan was to use shpjs and serve the zip files directly. In a project of this small size, that would worked well enough. However, at any larger scale, the amount of necessary processing would choke many clients. A further measure would have been to pre-generate map tiles from the cable data or chunking up the json for lazy loading, but there simply wasn't time for either of these and it didn't seem necessary with the amount of data in play.  In the end, I unzipped the shapefile archives and set produceJSON.js loose to build my geoJSON files.

The one final bit of interest in this section was the decision to pregen the color codes and write those to a JSON file as well. When processing the cable data, there is a section of code which iterates through the individual cable segment and examines the owner. It then does a lookup to see if there is already a color for that owner. If there isn't, it generates a unique one. Once it's done with all of that, it writes the list of owners with their associated hex color codes to colors.json to be used later by the client.

## Rendering Maps [fiber-map.directive.ts](src/app/map/fiber-map.directive.ts)

The point of the previous exercise was to get the shapefile data into a format which Leaflet.JS can consume. Therefore, with that done, the next logical step was getting the client side consuming that data.  I did this via a tiny service (which is essentially little more than a proxy to $http) and a directive - `fiber-map.directive.ts`. The directive's link function interacts with Leaflet to initialize the map and its tile layer. Once that's done, it has a clickHandler generated based on the current map and data. This clickHandler will later be used by the building layers.

The next step was to fetch the color and cable data. I did the color coding using the `style` option of `L.geoJSON`, the function therein consulting the color data provided by the server. I then used `onEveryFeature` to build popups for each cable in order to display its owner and total length.

The buildings layer has a bit more going on code-wise. Rather than use the stock Leaflet map marker image, I opted for a dot. More importantly, however, I put that clickHandler from before to work. A few interesting things happen when the user clicks on a building. First, I create a popup and populate it with the necessary data, then show it. I also determine the nearest fiber cable using a Leaflet plugin (GeometryUtil). That gives me the nearest cable as well as the distance to said cable from the building. Since those are required pieces of data, I append them to the popup content. Finally, I highlight that nearest cable, storing a reference to it for later un-highlighting, which occurs in the event handler for the popup's `remove` event.

There were several decision points in here. The first major one was how to interpret the "optionally show the distance to the nearest fiber cable and highlight it" part of the requirements. Ordinarily, I would reach out to the product owner or project manager and clarify what that meant. However, in this instance, it was outside normal business hours and I didn't want to bother the director of this project, so I decided to go with "you may, at your option, also do this thing."  Once I'd decided upon that course, the next big decision was in grabbing a reference to an array of the layers associated with the cable data. I would then pass that in to the clickHandler for the previously mentioned 'closest cable' calculations.

One thing I would revisit in this part of the project if I knew this was going to need to scale would be the data being compared to find the nearest cable. With the small data set in use here, checking every cable isn't so bad. Obviously it's not ideal, but it's not terrible. One enhancement I would make would be to break up the cable segments into smaller chunks (possibly by lat/lng zones) and check against the most likely chunks first, then fan out from there. For instance, I can look at the map and know that a cable segment in Presque Isle would be a rather unlikely candidate for nearest neighbor to a building in Oakfield. It is inefficient to check those when there are more obvious geographically similar cables. But again, working code that's shipped is better than better code that was never finished, and so I let it be...for now at least.

## Deployment

I mentioned before that one of the most challenging parts of this project was processing the data. I also mentioned that it was highly interesting, and therefore satisfying.  Getting the application built for, and deployed to, GitHub Pages was essentially all of the former with none of the latter. I spent a great deal of time iterating on the webpack configuration to try and fix it so that it would build with proper paths for GitHub, while preserving the same functioning paths for local development. In the end, it was time to ship and I opted to deploy the working code and let the development environment be slightly busted for now.

It is available [here](https://zenith-one.github.io/maine-fiber-map/) if you'd like to have a look at the working application.

## Conclusions

Looking back, there are several decisions I made which I would reconsider. First, forcing webpack into the mix ended up being more work than it was worth. I was trying to be flashy, using webpack and TypeScript to get it done, and that decision ended up causing a reasonable amount of frustration in the end. I do stand by TypeScript in general, especially for large projects. However, in a project of this small scale, it mostly got in the way. AngularJS was never written to be used with TypeScript, and there is a bit of ceremony you need to go through to get it working the way it's supposed to.  In my previous AngularJS project, we had hundreds of thousands of lines of code and TypeScript saved us a lot of time in the long run. However, I had a team and more than a day and a half to work on that app, both considerations I would take into account if I had it to do over.

Deployment woes aside, I had a fantastic time working on this project. I learned many new technologies and techniques and the problem space was fascinating. Are there some parts of the code and process that I would do differently? Absolutely. But then, that's how I know I'm growing.
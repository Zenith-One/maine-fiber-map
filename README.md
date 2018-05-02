# Maine Fiber Map

> details here

## How did I get here?

If you would like to recreate what I've done here, or if you're just curious about my process, I've written it up [here](/process.md).

### Quick start


```bash
# clone our repo
$ git clone https://github.com/Zenith-One/maine-fiber-map my-app

# change directory to your app
$ cd my-app

# install the dependencies with npm
$ yarn install

# start the server
$ npm start
```

go to [http://localhost:4200](http://localhost:4200) in your browser.

# Table of Contents

* [Getting Started](#getting-started)
    * [Dependencies](#dependencies)
    * [Installing](#installing)
    * [Running the app](#running-the-app)
    * [Developing](#developing)
    * [Testing](#testing)
* [License](#license)

# Getting Started

## Dependencies

You will need to have the following in order to run this project:

* [Node.js](https://nodejs.org/en/) (I used version 8.11.1)
* npm (5.6.0 - this ships with node v8.11.1)
* yarn (1.6+ - get this via npm) 
  ```bash
  $ npm install -g yarn@~1.6
  ```

## Installing

* `fork` this repo
* `clone` your fork
* `npm install` to install all dependencies

## Running the app

After you have installed all dependencies you can now run the app with:
```bash
npm start
```

It will start a local server using `webpack-dev-server` which will watch, build (in-memory), and reload for you. The port will be displayed to you as `http://localhost:8080`.

## Developing

### Build files

* single run: `npm run build`
* build files and watch: `npm start`

## Testing

#### 1. Unit Tests

* single run: `npm test`
* live mode (TDD style): `npm run test-watch`

# Credits/License

I used the [angularjs-webpack seed project](https://github.com/preboot/angularjs-webpack) (License: [MIT](/SEED-LICENSE)) to get started.
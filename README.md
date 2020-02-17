# TI Elections Web App


## Contains

- [x] [Typescript](https://www.typescriptlang.org/) 3
- [x] [React](https://facebook.github.io/react/) 16.7
- [x] [Redux](https://github.com/reactjs/redux) 4
- [x] [React Router](https://github.com/ReactTraining/react-router) 4.3
- [x] [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension)

### Build tools

- [x] [Webpack](https://webpack.github.io) 4
  - [x] [Tree Shaking](https://medium.com/@Rich_Harris/tree-shaking-versus-dead-code-elimination-d3765df85c80)
  - [x] [Webpack Dev Server](https://github.com/webpack/webpack-dev-server)
- [x] [Typescript Loader](https://github.com/TypeStrong/ts-loader)
- [x] [PostCSS Loader](https://github.com/postcss/postcss-loader)
  - [x] [PostCSS Preset Env](https://preset-env.cssdb.org/)
  - [x] [CSS modules](https://github.com/css-modules/css-modules)
- [x] [React Hot Loader](https://github.com/gaearon/react-hot-loader)
- [x] [Mini CSS Extract Plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)
- [x] [HTML Webpack Plugin](https://github.com/ampedandwired/html-webpack-plugin)

## Installation

```
$ npm ci
```

## Running

To run the frontend locally:
```
$ npm start
```

## Build

```
$ npm run build
```

## Deploy 

Deploy via Heroku.


## Envrionmental Variables

This app requires you to set two environmental variables to act as the administrator of the election. The first is ADMIN_KEY, which allows you to access the administrator home page for the app at the endpoint /ADMIN_KEY. The second envriomental variable is the SENDGRID_API_KEY, which is an API key that you get from signing up for SendGrid. 

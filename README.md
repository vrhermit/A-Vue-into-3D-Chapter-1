# A-Vue-into-3D-Chapter-1

This project is part of a series called [A Vue into 3D](https://radicalappdev.com/2021/11/23/a-vue-into-3d-introduction/).

This is chapter 1.
This project was forked from a CodeSandbox [project](https://codesandbox.io/s/a-vue-into-3d-chapter-1-3-o138b) for Chapter 1.3

NOTE: This project is set to run with a fake SSL cert on the local network. To run this project, follow the steps [here](https://bharathvaj.me/blog/use-ssl-with-vue-cli-locally) or comment out the devServer object in vue.config.js.

Install
`npm install`

Create cert folder
`mkdir -p .certs`

Create cert files
`mkcert -key-file ./.certs/key.pem -cert-file ./.certs/cert.pem "localhost"`

Add or update vue.config.js

```js
const fs = require("fs");

module.exports = {
  devServer: {
    open: process.platform === "darwin",
    host: "0.0.0.0",
    port: 8080,
    https: {
      key: fs.readFileSync(".certs/key.pem"),
      cert: fs.readFileSync(".certs/cert.pem")
    },
    hotOnly: false
  }
};
```

Run
`npm run serve`

Don't forget to add the cert directory to `.gitignore`

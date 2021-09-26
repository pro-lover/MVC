"use strict";

const Hapi = require("@hapi/hapi");
const Settings = require("./settings");
const Routes = require("./lib/routes");
const Models = require("./lib/models/");
const Path = require("path");

const init = async () => {
  const server = new Hapi.Server({ port: Settings.port });

  //_____________________[Routes]
  await server.register([require("@hapi/vision")]);

  server.views({
    engines: { pug: require("pug") },
    path: Path.join(__dirname, "lib/views"),
    compileOptions: {
      pretty: false
    },
    isCached: Settings.env === "production"
  });

  // Add routes
  server.route(Routes);

  await Models.sequelize.sync();

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
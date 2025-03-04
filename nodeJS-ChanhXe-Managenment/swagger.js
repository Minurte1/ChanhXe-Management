require("dotenv").config();
const swaggerAutogen = require("swagger-autogen")();
const isProduction = process.env.NODE_ENV === "production";

const doc = {
  info: {
    version: "1.0.0",
    title: "Document API Chành Xe",
    description: "",
  },
  host: isProduction
    ? "chanhxe-management.onrender.com"
    : `${process.env.HOST_NAME}:${process.env.PORT}`,
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "tts.vnpt",
    },
  ],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/routers/apiRouters.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./src/Server.js");
});

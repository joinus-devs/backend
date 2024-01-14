import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Joinus API",
  },
  host: "localhost:3000",
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./index.ts"];

swaggerAutogen(outputFile, endpointsFiles, doc);

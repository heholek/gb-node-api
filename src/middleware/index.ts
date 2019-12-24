/**
 * Imports all middleware to provide single connection point
 */
import {
  expressValidate,
  handleBodyRequestParsing,
  handleCompression,
  handleCors
} from "./common";

export default [
  handleCors,
  handleBodyRequestParsing,
  handleCompression,
  expressValidate
];

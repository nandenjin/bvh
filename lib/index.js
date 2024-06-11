import Parser from "./parser.js";
import BVH from "./bvh.js";

export async function read(url, callback) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const text = await response.text();
    callback(parse(text));
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export function parse(str) {
  const lines = str.replace("\r", "").split("\n");
  return new BVH(new Parser(lines).parse());
}

import { Parser } from "./parser";
import { BVH } from "./bvh";

export async function read(
  url: string,
  callback: (bvh: BVH) => void
): Promise<void> {
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

export function parse(str: string): BVH {
  const lines = str.replace("\r", "").split("\n");
  return new BVH(new Parser(lines).parse());
}

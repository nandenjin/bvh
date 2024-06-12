import * as bvh from "../lib";
import { BVH } from "../lib/bvh";
import { BVHNode } from "../lib/bvh_node";
// import { Parser } from "../lib/parser";
import express from "express";
import { readFileSync } from "fs";
import { describe, expect, test } from "vitest";

const app = express();
app.use(express.static(import.meta.dirname));
app.listen(8383);

describe("bvh.js", function () {
  test("should read remote bvh file using xhr", function (done) {
    bvh.read("http://127.0.0.1:8383/fixtures/A_test.bvh", function (motion) {
      expect(motion).toBeInstanceOf(BVH);
    });
  });
});

describe("BVH", function () {
  const str = readFileSync(
    import.meta.dirname + "/fixtures/A_test.bvh",
    "utf-8"
  );
  const motion = bvh.parse(str);

  test("should be instance of BVH", function () {
    expect(motion).toBeInstanceOf(BVH);
  });

  describe("node", function () {
    const head = motion.of("Head");

    test("should be instance of BVHNode", function () {
      expect(head).toBeInstanceOf(BVHNode);
    });
  });
});

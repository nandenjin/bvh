import * as bvh from "../lib/index.js";
import BVH from "../lib/bvh.js";
import BVHNode from "../lib/bvh_node.js";
import Parser from "../lib/parser.js";
import express from "express";
import { readFileSync } from "fs";
import { describe, it } from "mocha";
import "should";

const app = express();
app.use(express.static(import.meta.dirname));
app.listen(8383);

describe("bvh.js", function () {
  it("should expose .read()", function () {
    bvh.read.should.be.a("function");
  });

  it("should expose .parse()", function () {
    bvh.parse.should.be.a("function");
  });

  it("should read remote bvh file using xhr", function (done) {
    bvh.read("http://127.0.0.1:8383/fixtures/A_test.bvh", function (motion) {
      motion.should.be.instanceof(BVH);
      done();
    });
  });
});

describe("Parser", function () {
  // TODO: put test for Parser
  it("should pass test", function (done) {
    done();
  });
});

describe("BVH", function () {
  const str = readFileSync(
    import.meta.dirname + "/fixtures/A_test.bvh",
    "utf-8"
  );
  const motion = bvh.parse(str);

  it("should be instance of BVH", function () {
    motion.should.be.instanceof(BVH);
  });

  it("should expose .at()", function () {
    motion.at.should.be.a("function");
  });

  it("should expose .of()", function () {
    motion.of.should.be.a("function");
  });

  it("should have frameTime", function () {
    motion.should.have.property("frameTime");
  });

  it("should have numFrames", function () {
    motion.should.have.property("numFrames");
  });

  describe("nodeList", function () {
    const nodeList = motion.nodeList;

    it("should be instance of Array", function () {
      nodeList.should.be.instanceof(Array);
    });
  });

  describe("node", function () {
    const head = motion.of("Head");

    it("should be instance of BVHNode", function () {
      head.should.be.instanceof(BVHNode);
    });
  });
});

import chai = require("chai");
import {CQRSGraph} from "./../CQRSGraph";

let expect = chai.expect;

describe("Empty Graph", () => {
	let subject: CQRSGraph;

	beforeEach(function() {
		subject = new CQRSGraph(null);
	});

	describe("GetGraph", () => {
		it("should return an empty CQRSGraph", (done) => {
			let result = subject.GetGraph().serialize();
			let expected = {
				"models": {},
				"nodes": {},
				"edges": {},
				"connectors": {}
			};
			expect(result).to.deep.equal(expected);
			done();
		});
	});
	describe("GetVersion", () => {
		it("should return version 0", (done) => {
			let result = subject.GetVersion();
			expect(result).to.equal(0);
			done();
		});
	});
});

import chai = require("chai");
import {CQRSGraph} from "./../CQRSGraph";
import * as Commands from "cubitt-commands";
import * as Common from "cubitt-common";

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
	describe("BeginTransaction", () => {
		it("should work correctly after a rollback", (done) => {
			try {
				subject.BeginTransaction();
				//Valid command
				let com: Commands.Command = new Commands.AddModelCommand(
					Common.Guid.newGuid(),
					Common.Guid.newGuid(),
					Common.Guid.newGuid(),
					Common.Guid.newGuid(),
					"TEST_MODEL",
					{}
				);
				subject.ApplyCommand(com);

			} catch(e) {
				subject.Rollback();
			}
			done();
		});
	});
});

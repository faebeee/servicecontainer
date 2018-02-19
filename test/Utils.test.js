"use strict";

const unit = require("unit.js");
const { isParameterReference } = require("../bin/Utils");

describe("Utils", function() {
    describe("isParameterReference", function() {
        it("simple parameter reference", () => {
            unit
                .bool(isParameterReference("%variableServiceFile%"))
                .isTrue();
        });

        it("inline reference", () => {
            unit
                .bool(
                    isParameterReference(
                        "/Users/fabiogianini/Work/servicecontainer/test/Mock/%variableServiceFile%"
                    )
                )
                .isTrue();
        });
    });
});

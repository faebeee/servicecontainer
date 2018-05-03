"use strict";

let unit = require("unit.js");
let path = require("path");

let ServiceContainer = require("../").default;

let MockService = require("./Mock/Mock.service");
let OtherService = require("./Mock/Other.service");

describe("Container", function () {
    beforeEach(() => {
        this.container = ServiceContainer.create(
            path.join(__dirname, "/Mock/Services.json")
        );
    });

    afterEach(() => {
        ServiceContainer.destroy();
    });

    it("create container instance", () => {
        unit.object(this.container).isNot(null);
    });

    it("get container as a reference", () => {
        unit.object(this.container.get("testcontainer")).isNot(null);
        unit.object(this.container.get("testcontainer").container).isNot();
        unit
            .object(this.container.get("testcontainer").container)
            .is(this.container);
    });

    it("check references", () => {
        this.container.addParameters({ test2: true });
        unit
            .bool(this.container.get("container").getParameter("test2"))
            .isTrue();
        unit.bool(ServiceContainer.get().getParameter("test2")).isTrue();

        unit.bool(require("../").default.get().getParameter("test2")).isTrue();
    });

    it("get services", () => {
        unit.object(this.container.get("mock")).isNot(null);
        unit.object(this.container.get("mock")).isInstanceOf(MockService);
    });

    if (
        ("get service with parameterized filename",
            () => {
                unit.object(this.container.get("variableServiceFile")).isNot(null);
            })
    ) ;

    it("get multiple services", () => {
        unit.object(this.container.get("mock")).isNot(null);
        unit.object(this.container.get("other")).isNot(null);
        unit.object(this.container.get("mock")).isInstanceOf(MockService);
        unit.object(this.container.get("other")).isInstanceOf(OtherService);
    });

    it("throw error when no definition is given", () => {
        function loadServiceWithoutClassDef() {
            unit.object(this.container.get("mock2")).isNot(null);
        }

        unit.exception(loadServiceWithoutClassDef);
    });

    it("throw error when parameter does not exist", () => {
        function loadServiceWithoutClassDef() {
            this.container.getParameter("mock2");
        }

        unit.exception(loadServiceWithoutClassDef);
    });

    it("inject service into service", () => {
        unit.object(this.container.get("mock")).isNot(null);
        unit.object(this.container.get("other")).isNot(null);
        unit.object(this.container.get("other").service).isNot(null);
        unit.object(this.container.get("mock")).isInstanceOf(MockService);
        unit.object(this.container.get("other")).isInstanceOf(OtherService);
        unit
            .object(this.container.get("other").service)
            .isInstanceOf(MockService);
    });

    it("inject parameter into service", () => {
        unit.object(this.container.get("mock")).isNot(null);
        unit.object(this.container.get("other")).isNot(null);
        unit.object(this.container.get("other").service).isNot(null);

        unit.object(this.container.get("mock")).isInstanceOf(MockService);
        unit.object(this.container.get("other")).isInstanceOf(OtherService);
        unit
            .object(this.container.get("other").service)
            .isInstanceOf(MockService);

        unit.string(this.container.get("mock").data).is("bar");
        unit.string(this.container.getParameter("foo")).is("bar");
    });

    it("access objects", () => {
        unit.object(this.container.get("object")).isNot(null);
        unit.string(this.container.get("object").foo).is("bar");
    });

    it("get services by tag", () => {
        unit.array(this.container.getServicesByTag("mock")).hasLength(2);
    });

    it("get scaffolded parameter", () => {
        unit.string(this.container.getParameter("test.name")).is("world");
    });

    it("get parameter with reference", () => {
        unit.string(this.container.getParameter("ref")).is("bar bar");
    });

    it("create with additional parameters", () => {
        ServiceContainer.destroy();
        this.container = ServiceContainer.create(
            __dirname + "/Mock/Services.json",
            { "myProp": "myValue" }
        );
        unit
            .string(this.container.getParameter("myProp"))
            .is("myValue");
    });
});

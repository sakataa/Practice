define(['common/querystring'], function (QueryString) {
    describe("QueryString", function () {
        describe("getQueryString(url)", function () {
            it("return the query string part from an url", function () {
                var result = QueryString.getQueryString("localhost?a=1");
                expect(result).toBe("a=1");
            });

            it("return empty string if the url does not contain '?' character", function () {
                var result = QueryString.getQueryString("localhosta=1");
                expect(result).toBe("");
            });

            it("throw exception if the url param is not passed", function () {
                expect(function () { QueryString.getQueryString(); }).toThrow();
            });

            it("throw exception if the url param is not a string", function () {
                expect(function () { QueryString.getQueryString(1); }).toThrow();
            });
        });

        describe("getRawUrl(url)", function () {
            it("return the raw url from an url", function () {
                var result = QueryString.getRawUrl("http://localhost?a=1");
                expect(result).toBe("http://localhost");
            });

            it("return the url param if it does not contain '?' character", function () {
                var result = QueryString.getRawUrl("test+string");
                expect(result).toBe("test+string");
            });
        });

        describe("setParam(url, name, value)", function () {
            it("add new value to a query string if it does not exist", function () {
                var result = QueryString.setParam("http://localhost", "a", 2);
                expect(result).toBe("http://localhost?a=2");
            });

            it("update value in a query string if it exists", function () {
                var result = QueryString.setParam("http://localhost?a=1", "a", 2);
                expect(result).toBe("http://localhost?a=2");
            });

            it("remove null value", function () {
                var result = QueryString.setParam("http://localhost?a=1", "a", null);
                expect(result).toBe("http://localhost?");
            });
        });

        describe("getParam(url, name)", function () {
            it("return a correct value if it exists", function () {
                var result = QueryString.getParam("http://localhost?a=1", "a");
                expect(result).toBe("1");
            });

            it("return a null if it does not exist", function () {
                var result = QueryString.getParam("http://localhost", "a");
                expect(result).toBe(null);
            });
        });
    });
});
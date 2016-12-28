define(['jquery', 'common/site'], function ($, Site) {
    describe("Site", function () {
        describe("getLicenseeId()", function () {
            it("return a value from input#LicenseeId", function () {
                setFixtures('<input id="LicenseeId" value="2" />');
                var result = Site.getLicenseeId();

                expect(result).toBe(2);
            });
        });

        describe("asNull(text)", function () {
            it("return null if the param 'text' is an empty string", function () {
                var result = Site.asNull("");
                expect(result).toBe(null);
            });
        });

        describe("blockUI()", function () {
            it("div.block-body and div.loading will be display", function () {
                setFixtures('<div class="block-body" style="display:none"></div>');
                appendSetFixtures('<div class="loading" style="display:none"></div>');
                Site.blockUI();
                var result = $('div.block-body').is(':visible') && $('div.loading').is(':visible');
                expect(result).toBe(true);
            });
        });

        describe("setLicenseeOptionParam(urlOrParams)", function () {
            beforeEach(function () {
                setFixtures('<input id="LicenseeType" value="1" />');
                appendSetFixtures('<select id="CurrencyId"><option value="1" /><option value="2" /></select>');
                appendSetFixtures('<input id="BaseCurrency" value="USD" />');
            });

            it("return an url with query string if 'urlOrParams' is a string", function () {
                var result = Site.setLicenseeOptionParam("localhost");
                expect(result).toBe("localhost?licenseetype=1&currencyid=1&currencyname=&basecurrency=USD");
            });

            it("return an object with query string if 'urlOrParams' is an object", function () {
                var result = Site.setLicenseeOptionParam({});
                expect(result).toEqual({ LicenseeType: '1', CurrencyId: '1', CurrencyName: '', BaseCurrency: 'USD' });
            });
        });

        describe("setLicenseeOptionOriginalParam(urlOrParams)", function () {
            it("build an url from 'data-original' attributes of html tags", function () {
                setFixtures('<input id="LicenseeType" data-original="1" />');
                appendSetFixtures('<select id="CurrencyId" data-original="2" />');
                appendSetFixtures('<input id="BaseCurrency" data-original="USD" />');

                var result = Site.setLicenseeOptionOriginalParam("localhost");
                expect(result).toBe("localhost?licenseetype=1&currencyid=2&currencyname=&basecurrency=USD");
            });
        });

        describe("updateOriginalLicenseeOption()", function () {
            it("update values of html tags to 'data-original' attributes", function () {
                setFixtures('<input id="LicenseeType" value="1">');
                appendSetFixtures('<input id="BaseCurrency" value="USD">');
                Site.updateOriginalLicenseeOption();
                var result = $("#LicenseeType").attr("data-original") === "1" && $("#BaseCurrency").attr("data-original") === "USD";
                expect(result).toBe(true);
            });
        });

        describe("setProductOptionParam(url, counter, productCode, status)", function () {
            it("build an url with production options", function () {
                var result = Site.setProductOptionParam("localhost", 1, "SB", true);
                expect(result).toBe("localhost?productoptions[1].code=SB&productoptions[1].name=SB&productoptions[1].status=true");
            });
        });

        describe("initBlockUI()", function () {
            it(".block-body should be display when clicking on .blockui element.", function () {
                setFixtures('<div class="blockui"></div>');
                appendSetFixtures('<div class="block-body" style="display:none"></div>');

                Site.initialize();
                $('.blockui').click();
                expect($('.block-body').is(':visible')).toBe(true);
            });
        });

        describe("asBool()", function () {
            it("convert a string 'TRUE' to true (boolean)", function () {
                var result = Site.asBool("TRUE");
                expect(result).toBe(true);
            });

            it("convert a string '123' to false (boolean)", function () {
                var result = Site.asBool("123");
                expect(result).toBe(false);
            });

            it("convert a number 123 to true (boolean)", function () {
                var result = Site.asBool(123);
                expect(result).toBe(true);
            });

            it("convert an object to true (boolean)", function () {
                var result = Site.asBool({});
                expect(result).toBe(true);
            });

            it("convert null to false (boolean)", function () {
                var result = Site.asBool(null);
                expect(result).toBe(false);
            });
        });

        describe("getSingleResource(enghlishName)", function () {
            beforeEach(function () {
                setFixtures('<input id="PageLanguage" value="_language_en_US" />');
                window["_language_en_US"] = { "Test": "en-Test" };
            });

            it("get correct value from resource", function () {
                Site.initialize();
                var result = Site.getSingleResource("Test");
                expect(result).toEqual("en-Test");
            });

            it("get key value when resource not contain", function () {
                Site.initialize();
                var result = Site.getSingleResource("NotContain");
                expect(result).toEqual("NotContain");
            });
        });

        describe("getResources(arrayText)", function () {
            it("return correct array text", function () {
                setFixtures('<input id="PageLanguage" value="_language_en_US" />');
                window["_language_en_US"] = { "Test1": "en-Test1", "Test2": "en-Test2", "Test3": "en-Test3" };
                Site.initialize();
                var arrayText = ["Test1", "Test2", "Test3", "Test4"];
                var result = Site.getResources(arrayText);
                expect(result).toEqual(["en-Test1", "en-Test2", "en-Test3", "Test4"]);
            });
        });

        describe("isNumber(text)", function () {
            it("return true when pass text is integer", function () {
                var result = Site.isNumber(16);
                expect(result).toBe(true);
            });

            it("return true when pass text is digit string", function () {
                var result = Site.isNumber("20");
                expect(result).toBe(true);
            });

            it("return true when pass text is float", function () {
                var result = Site.isNumber(16.002);
                expect(result).toBe(true);
            });

            it("return false when pass text is not digit", function () {
                var result = Site.isNumber("ABC");
                expect(result).toBe(false);
            });

            it("return false when we don't pass text value", function () {
                var result = Site.isNumber();
                expect(result).toBe(false);
            });
        });
    });
});
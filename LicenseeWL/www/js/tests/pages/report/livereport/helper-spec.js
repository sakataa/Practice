define(['pages/report/livereport/helper'], function (Helper) {
    describe("helper.js", function () {
        describe("setSumParams(url, totalValue)", function () {
            it("setSumParams(url, totalValue) should return correct value", function () {
                var totalValue = {
                    BetCount: 100,
                    CustomerWinLoss: 200,
                    CustomerComm: 300,
                    LicenseeWinLoss: 400,
                    LicenseeComm: 500,
                    TurnOver: 600,
                    AmountDue: 700
                };

                var expected = "localhost-test?totalrows=100&sumwinlost=200&sumplayercomm=300&sumlicenseewl=400&sumcomm=500&sumturnover=600&sumamtdueto3rd=700";

                var result = Helper.setSumParams("localhost-test", totalValue);

                expect(result).toBe(expected);
            });
        });

        describe("getMatchListProductOption(sportId, productCode)", function () {
            describe("sportId greater than 0", function () {
                it("Result should return with ['VS'] when sportType equal 180 or 186", function () {
                    var expected = ["VS"];

                    var result = Helper.getMatchListProductOption(180, "ALL");
                    expect(result).toEqual(expected);

                    result = Helper.getMatchListProductOption(180, "ALL");
                    expect(result).toEqual(expected);
                });

                it("Result should return with ['LC'] when sportType equal 162", function () {
                    var expected = ["LC"];

                    var result = Helper.getMatchListProductOption(162, "ALL");
                    expect(result).toEqual(expected);
                });

                it("Result should return with ['SB', 'BA'] when sportType not in 180,186,162", function () {
                    var expected = ["SB", "BA"];

                    var result = Helper.getMatchListProductOption(100, "ALL");
                    expect(result).toEqual(expected);
                });
            });

            describe("sportId less than or equal 0", function () {
                it("Result should return with ['SB', 'BA', 'NG', 'RB', 'LC', 'VS', 'CS', 'BG'] when productCode equal ALL", function () {
                    var expected = ['SB', 'BA', 'NG', 'RB', 'LC', 'VS', 'CS', 'BG'];

                    var result = Helper.getMatchListProductOption(0, "ALL");
                    expect(result).toEqual(expected);
                });

                it("Result should return with ['RB'] when productCode not equal ALL", function () {
                    var expected = ['RB'];

                    var result = Helper.getMatchListProductOption(0, "RB");
                    expect(result).toEqual(expected);
                });
            });
        });

    });
});
define(['jquery', 'common/site', 'pages/report/licenseewinloss/licenseewinloss.option'],
    function ($, Site, LicenseeWinLossOption) {
        describe("LicenseeWinLossOption", function () {
            beforeAll(function () {
                spyOn(Site, "getResources").and.callFake(function (text) {
                    return text;
                });
            });

            describe("LicenseeWinLossOption", function () {
                it("rowNum should be correct.", function () {
                    expect(LicenseeWinLossOption.rowNum).toBe(50);
                });

                it("totalColspan should be a correct array.", function () {
                    expect(LicenseeWinLossOption.totalColspan).toEqual([2, 2, 3]);
                });

                it("rowList should be a correct array.", function () {
                    expect(LicenseeWinLossOption.rowList).toEqual([50, 100, 200, 300, 400, 500, 1000, 2000]);
                });

                it("urlData should be a correct url.", function () {
                    expect(LicenseeWinLossOption.urlData).toBe('api/LicenseeWinLossReport/Index');
                });

                it("nonePagingSize should be correct.", function () {
                    expect(LicenseeWinLossOption.nonePagingSize).toBe(2000);
                });
            });

            describe("getColName(productOptions)", function () {
                it("gridOption.colNames should be correct.", function () {
                    LicenseeWinLossOption.hasCustomerComm = true;
                    var columnNames = LicenseeWinLossOption.getColName([]);

                    expect(columnNames).toEqual(['#', 'Date', 'ExternalId', 'SystemId', 'Currency', 'Total', 'Turnover', 'ActualStake', 'BuyBackAmount',
                        'TotalTransaction', '@[Win]/@[Loss]', 'Comm', 'Total', 'Total', 'LicenseeW_L', '@[BetTrade]<br/>@[Commission]', 'BA<br/>@[Commission]',
                        '@[RacingRevenue]', '@[AmtDueToBetTrade]', '@[AmtDueToBA]', '@[AmtDueToRacing]', 'CurrencyId', 'CustomerId']);
                });
            });

            describe("getColModel(level, reportBy, productOptions)", function () {
                it("columnModels.length should equal with columnNames.length.", function () {
                    var columnNames = LicenseeWinLossOption.getColName([]);
                    var columnModels = LicenseeWinLossOption.getColModel(1, 2, []);

                    expect(columnModels.length).toBe(columnNames.length);
                });
            });

            describe("getTotalColModel(level, productOptions)", function () {
                it("totalColumnModels.length should equal with columnNames.length.", function () {
                    var columnNames = LicenseeWinLossOption.getColName([]);
                    var totalColumnModels = LicenseeWinLossOption.getTotalColModel(1, []);

                    expect(totalColumnModels.length).toBe(columnNames.length);
                });
            });
        });
    });
define(['jquery', 'pages/betlist/betlist.option'], function ($, BetListOption) {
	describe("BetListOption", function () {
		describe("gridOption", function () {
			it("gridOption.rowNum should be 50", function () {
				expect(BetListOption.gridOption.rowNum).toBe(50);
			});

			it("gridOption.rowList should be a correct array", function () {
				expect(JSON.stringify(BetListOption.gridOption.rowList)).toBe(JSON.stringify([50, 100, 200, 300, 400, 500, 1000, 2000]));
			});
		});

		describe("columnModel", function () {
			it("columnModel.length should be 11", function () {
				expect(BetListOption.columnModel.length).toBe(11);
			});

			it("first column name should be 'Index'", function () {
				expect(BetListOption.columnModel[0].name).toBe('Index');
			});

			it("last column name should be 'Status'", function () {
				expect(BetListOption.columnModel[10].name).toBe('Status');
			});
		});

		it("columnNames should be a correct array", function () {
			expect(BetListOption.columnNames).toEqual(['#', 'ExternalId', 'SystemId', 'TransTime', 'Choice', 'Odds', 'Stake',
						'WinLoss', 'EffectiveBettingValue', '@[LicenseeWL]/@[Comm]', 'Status']);
		});

		it("maxHeight should be 720", function () {
			expect(BetListOption.maxHeight).toBe(720);
		});
	});
});
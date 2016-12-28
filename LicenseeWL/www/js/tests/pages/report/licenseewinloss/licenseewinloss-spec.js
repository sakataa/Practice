define(['jquery', 'common/site', 'common/pluginhelper', "pages/report/licenseewinloss/licenseewinloss.option", 'pages/report/licenseewinloss/licenseewinloss'],
    function ($, Site, PluginHelper, LicenseeWinLossOption, LicenseeWinLoss) {
        describe("LicenseeWinLoss", function () {
            beforeAll(function () {
                spyOn(Site, "getSingleResource").and.callFake(function (text) {
                    return text;
                });
                spyOn(Site, "resolveClientUrl").and.callFake(function (url) {
                    return url;
                });
                spyOn(Site, "setMultiSelectForDropDownList");
                spyOn(PluginHelper, "initDateRangePicker");
                spyOn(PluginHelper, "initMonthPicker");
            });

            describe("initialize()", function () {
                it("LicenseeWinLossOption.licenseeId should be assigned data from #drillDownLicenseeId.", function () {
                    var $input = setFixtures('<input id="drillDownLicenseeId" value="1">');

                    LicenseeWinLoss.initialize();

                    expect(LicenseeWinLossOption.licenseeId).toBe(1);
                });

                it("initEvent() should be call when initialize() is called", function () {
                    spyOn(LicenseeWinLoss, 'initEvent');

                    LicenseeWinLoss.initialize();

                    expect(LicenseeWinLoss.initEvent).toHaveBeenCalled();
                });

                it("Site.addUserGuide() should be call when initialize() is called with correct params.", function () {
                    spyOn(Site, 'addUserGuide');

                    LicenseeWinLoss.initialize();

                    expect(Site.addUserGuide).toHaveBeenCalledWith({
                        resourceName: "LicenseeWL",
                        title: Site.getSingleResource("LicenseeWinLoss")
                    });
                });
            });

            describe("initEvent()", function () {
                beforeEach(function () {
                    $("body").off("click", "**");
                });

                it("#IsExportExcel should have value 'false' when #SubmitButton is clicked.", function () {
                    setFixtures('<div id="SubmitButton"></div>');
                    appendSetFixtures('<div id="IsExportExcel"></div>');
                    spyOn(LicenseeWinLoss, "submit");

                    LicenseeWinLoss.initEvent();

                    $('#SubmitButton').click();
                    expect($('#IsExportExcel').val()).toBe(false);
                });

                it("#LicenseeWinLossForm.submit() should be called if #ExportToExcel is clicked.", function () {
                    setFixtures('<div id="ExportToExcel"></div>');
                    appendSetFixtures('<div id="licenseewinloss"></div>');

                    var spyEvent = spyOnEvent('#licenseewinloss', 'submit');

                    LicenseeWinLoss.initEvent();
                    $('#ExportToExcel').click();
                    expect(spyEvent).toHaveBeenTriggered();
                });

                it("#LicenseeWinLoss.goBack() should be called with correct param when .level-link is clicked.", function () {
                    setFixtures('<div id="level-link-container"><div class="level-link" data-level="3"></div></div>');

                    spyOn(LicenseeWinLoss, 'goBack');

                    LicenseeWinLoss.initEvent();
                    $('.level-link').click();

                    expect(LicenseeWinLoss.goBack).toHaveBeenCalledWith(3);
                });

                it("LicenseeWinLoss.openBetlistPopUp(datadrilldown) should be called if .bet-list-link is clicked.", function () {
                    setFixtures('<div class="bet-list-link"></div>');

                    spyOn(LicenseeWinLoss, "openBetlistPopUp");
                    LicenseeWinLoss.initEvent();
                    $('.bet-list-link').click();
                    expect(LicenseeWinLoss.openBetlistPopUp).toHaveBeenCalled();
                });
            });

            describe("setExcelUrl(level, currencyId, custId, fdate, tdate, currencyName)", function () {
                it("All input fields should have correct value.", function () {
                    LicenseeWinLoss.setExcelUrl(1, 2, 3, new Date(2001, 1, 1), new Date(2001, 1, 1), 'UUS');

                    expect(LicenseeWinLossOption.urlExcelData).toBe('api/LicenseeWinLossReport/Index?level=1&currencyId=2&custId=3&fdate=02/01/2001&tdate=02/01/2001&currencyName=UUS');
                });
            });

            describe("renderBreadCrumb(level)", function () {
                it(".breadCrumbHolder should be hide if param level is 0.", function () {
                    setFixtures('<div class="breadCrumbHolder"></div>');

                    LicenseeWinLoss.renderBreadCrumb(0);

                    expect($('.breadCrumbHolder').is(':visible')).toBe(false);
                });

                it(".level0 should show if param level > 0.", function () {
                    setFixtures('<div id="level-link-container"><div class="level0"></div></div>');

                    LicenseeWinLoss.renderBreadCrumb(1);

                    expect($('.level0').is(':visible')).toBe(true);
                });

                it(".level2 should be hide if param level = 1.", function () {
                    setFixtures('<div id="level-link-container"><div class="level2"></div></div>');

                    LicenseeWinLoss.renderBreadCrumb(1);

                    expect($('.level2').is(':visible')).toBe(false);
                });

                it(".level2 should show if param level = 2.", function () {
                    setFixtures('<div id="level-link-container"><div class="level2"></div></div>');

                    LicenseeWinLoss.renderBreadCrumb(2);

                    expect($('.level2').is(':visible')).toBe(true);
                });
            });

            describe("setReportTitle(currencyId, fromdate, todate)", function () {
                it("setReportTitle() should assign correct content to .report-title.", function () {
                    setFixtures('<div class="report-title"></div>');
                    var date = new Date(2001, 1, 1);

                    LicenseeWinLoss.setReportTitle('-1', date, date);

                    expect($('.report-title').html()).toBe('LicenseeWinLoss, 02/01/2001 → 02/01/2001 - Viewin');
                });
            });

            describe("goBack(level)", function () {
                it("LicenseeWinLossOption.urlExcelData should be updated to correct value.", function () {
                    expect(LicenseeWinLossOption.urlExcelData).toBe('api/LicenseeWinLossReport/Index?level=1&currencyId=2&custId=3&fdate=02/01/2001&tdate=02/01/2001&currencyName=UUS');
                });
            });
        });
    });
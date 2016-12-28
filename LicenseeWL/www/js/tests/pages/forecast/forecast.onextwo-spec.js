define(['jquery', 'test-helper', 'common/site', 'components/refreshcountdown', 'common/popup', 'pages/forecast/forecast.onextwo'],
    function ($, TestHelper, Site, RefreshCountDown, Popup, ForecastOneXTwo) {
        describe("ForecastOneXTwo", function () {
            beforeAll(function () {
                //   TestHelper.initGlobalSetting();
                spyOn(Site, "initialize");
                spyOn(ForecastOneXTwo, "resizePopup");
                spyOn(RefreshCountDown, "initialize");
                spyOn(RefreshCountDown, "initEvent");
                spyOn(Site, "resolveClientUrl").and.callFake(function (text) {
                    return text;
                });
                spyOn(Site, "getSingleResource").and.callFake(function (text) {
                    return text;
                });
            });

            describe("initialize()", function () {
                it("Relevant methods should be called.", function () {
                    spyOn(ForecastOneXTwo, "initEvent");
                    spyOn(Site, "addUserGuide");

                    ForecastOneXTwo.initialize();

                    expect(ForecastOneXTwo.initEvent).toHaveBeenCalled();
                    expect(Site.addUserGuide).toHaveBeenCalledWith({
                        resourceName: "Forecast1x2",
                        title: "Forecast - OneXTwo"
                    });
                    expect(RefreshCountDown.initialize).toHaveBeenCalled();
                    expect(RefreshCountDown.initEvent).toHaveBeenCalled();

                });
            });

            describe("initEvent()", function () {
                it("submit() should be called with correct params when .league-list raises event change.", function () {
                    setFixtures('<input type="text" class="league-list" value="999" />');
                    spyOn(ForecastOneXTwo, "submit");

                    ForecastOneXTwo.initEvent();
                    $(".league-list").change();

                    expect(ForecastOneXTwo.submit).toHaveBeenCalled();
                });

                it("openForecast() should be called with correct params when .button-add is clicked.", function () {
                    setFixtures('<div id="reportContent"><span class="button-add" data-match-id="123" data-bettype="456"></span></div>');
                    spyOn(ForecastOneXTwo, "openForecast");

                    ForecastOneXTwo.initEvent();
                    $(".button-add").click();

                    expect(ForecastOneXTwo.openForecast).toHaveBeenCalledWith('123', 456);
                });

                it("submit() should be called when #SubmitButton is clicked.", function () {
                    setFixtures('<input id="SubmitButton" type="button" />');
                    spyOn(ForecastOneXTwo, "submit");

                    ForecastOneXTwo.initEvent();
                    $("#SubmitButton").click();

                    expect(ForecastOneXTwo.submit).toHaveBeenCalled();
                });
            });

            describe("openForecast(matchId, betType)", function () {
                it("Popup.updateCurrentPopup() should be called with correct params if it is a popup.", function () {
                    setFixtures('<input type="text" id="IsPopUp" value="true" />');
                    spyOn(Popup, "updateCurrentPopup");

                    ForecastOneXTwo.initialize();

                    ForecastOneXTwo.openForecast(123, 456);

                    expect(Popup.updateCurrentPopup).toHaveBeenCalledWith("RunningMatchBetList/Index?matchid=123&bettype=456",
                        { width: 900, height: 200, title: 'BetList' });
                });

                it("Site.redirect() should be called with correct params if it is not a popup.", function () {
                    spyOn(Site, "redirect");

                    ForecastOneXTwo.initialize();

                    ForecastOneXTwo.openForecast(123, 456);

                    expect(Site.redirect).toHaveBeenCalledWith("RunningMatchBetList/Index?licenseetype=&currencyname=&matchid=123&bettype=456");
                });
            });

            describe("getBetListUrl(url, matchId, betType)", function () {
                it("Popup.updateCurrentPopup() should be called with correct params if it is a popup.", function () {
                    setFixtures('<input type="text" id="LicenseeType-Hidden" value="1" />');
                    appendSetFixtures('<input type="text" id="CurrencyId-Hidden" value="2" />');
                    appendSetFixtures('<input type="text" id="BaseCurrency-Hidden" value="3" />');

                    var url = ForecastOneXTwo.getBetListUrl("localhost", 123, 456);

                    expect(url).toBe("localhost?licenseetype=1&currencyid=2&basecurrency=3&matchid=123&bettype=456");
                });
            });

            describe("submit()", function () {
                it("Form #ForecastOneXTwoForm should be summitted.", function () {
                    setFixtures('<form id="ForecastOneXTwoForm"></form>');
                    $('#ForecastOneXTwoForm').submit(function () { return false; });
                    var spyEvent = spyOnEvent($('#ForecastOneXTwoForm'), 'submit');

                    ForecastOneXTwo.submit();

                    expect(spyEvent).toHaveBeenTriggered();
                });
            });
        });
    });
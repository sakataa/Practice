define(['jquery', 'common/site', 'components/refreshcountdown', 'common/popup', 'pages/forecast/forecast.ah'],
    function ($, Site, RefreshCountDown, Popup, ForecastAh) {
        describe("ForecastAh", function () {
            beforeAll(function () {
                spyOn(Site, "initialize");
                spyOn(ForecastAh, "resizePopup");
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
                it("initEvent() should be called.", function () {
                    spyOn(ForecastAh, "initEvent");
                    ForecastAh.initialize();

                    expect(ForecastAh.initEvent).toHaveBeenCalled();
                });
            });

            describe("initEvent()", function () {
                it("loadForecast() should be called with correct params when .forecast-link is clicked.", function () {
                    setFixtures('<div id="reportContent"><span class="forecast-link" data-bettype="123" data-current-score="456"></span></div>');
                    spyOn(ForecastAh, "loadForecast");

                    ForecastAh.initEvent();
                    $(".forecast-link").click();

                    expect(ForecastAh.loadForecast).toHaveBeenCalledWith(456, 123);
                });

                it("loadForecast() should be called with correct params when .view-forecast-link is clicked.", function () {
                    setFixtures('<div id="reportContent"><span class="view-forecast-link" data-bettype="123"></span></div>');
                    spyOn(ForecastAh, "loadForecast");

                    ForecastAh.initEvent();
                    $(".view-forecast-link").click();

                    expect(ForecastAh.loadForecast).toHaveBeenCalledWith(null, 123);
                });

                it("viewBetlist() should be called with correct params when .view-betlist is clicked.", function () {
                    setFixtures('<div id="reportContent"><span class="view-betlist" data-bettype="123"></span></div>');
                    spyOn(ForecastAh, "viewBetlist");

                    ForecastAh.initEvent();
                    $(".view-betlist").click();

                    expect(ForecastAh.viewBetlist).toHaveBeenCalledWith(123);
                });

                it("viewBetlist() should be called when #txtCurrentscore raises event keyup with keyCode = 13.", function () {
                    setFixtures('<div id="reportContent"><input id="txtCurrentscore"></input></div>');
                    appendSetFixtures('<input id="btnCurrentscore" />');

                    var spyEvent = spyOnEvent($('#btnCurrentscore'), 'click');

                    ForecastAh.initEvent();
                    var e = $.Event('keyup');
                    e.keyCode = 13;
                    $("#txtCurrentscore").trigger(e);

                    expect(spyEvent).toHaveBeenTriggered();
                });

                it("setCurrentScore() should be called when #btnCurrentscore is clicked.", function () {
                    setFixtures('<div id="reportContent"><input id="btnCurrentscore"></input></div>');
                    spyOn(ForecastAh, "setCurrentScore");

                    ForecastAh.initEvent();
                    $("#btnCurrentscore").click();

                    expect(ForecastAh.setCurrentScore).toHaveBeenCalled();
                });
            });

            describe("loadForecast(selectedScore, bettype)", function () {
                var SELECTED_SCORE = 1;
                var BETTYPE = 2;
                
                beforeEach(function (done) {
                    setFixtures('<div id="reportContent"></div>');
                    jasmine.Ajax.install();
                    jasmine.Ajax
                        .stubRequest("AhForecast/Index?matchid=undefined&bettype=2&currentscore=1")
                        .andReturn({
                            'status': 200,
                            'dataType': 'html',
                            'responseText': 'Hello World'
                        });
                    ForecastAh.loadForecast(SELECTED_SCORE, BETTYPE);

                    setTimeout(done, 10);
                });

                afterEach(function () {
                    jasmine.Ajax.uninstall();
                });

                it("#reportContent should have html value returned from ajax.", function () {
                    expect($('#reportContent').html()).toBe("Hello World");
                });
            });

            describe("viewBetlist(bettype)", function () {
                beforeAll(function () {
                    setFixtures('<div id="forecast-table" data-match-id="1" data-basecurrency="USD" data-licenseetype="2" data-currencyid="20" data-currencyname="UUS"></div>');
                    spyOn(ForecastAh, "initEvent");
                    ForecastAh.initialize();
                });
                it("Popup.updateCurrentPopup() should be called with correct params.", function () {
                    spyOn(Popup, "updateCurrentPopup");

                    ForecastAh.viewBetlist(123);

                    expect(Popup.updateCurrentPopup).toHaveBeenCalledWith("RunningMatchBetList/Index?matchid=1&bettype=123&basecurrency=USD&currencyid=20&currencyname=UUS&licenseetype=2",
                        ({ width: 960, height: 200, title: 'BetList' }));
                });
            });

            describe("setCurrentScore()", function () {
                it("loadForecast() should be called with correct params.", function () {
                    setFixtures('<input id="txtCurrentscore" value="1" />');
                    appendSetFixtures('<div id="reportContent"><a class="view-betlist" data-bettype="123" /></div>');
                    spyOn(ForecastAh, "loadForecast");

                    ForecastAh.setCurrentScore();

                    expect(ForecastAh.loadForecast).toHaveBeenCalledWith('1', '123');
                });
            });
        });
    });
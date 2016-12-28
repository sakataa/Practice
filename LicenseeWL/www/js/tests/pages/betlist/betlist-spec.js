define(
    ['jquery', 'common/site', 'common/querystring', 'lib/jqgrid/jquery.jqgrid.additional', 'pages/betlist/betlist.option', 'common/popup', 'pages/betlist/betlist', 'test-helper'],
    function ($, Site, QueryString, jqGridAdditional, BetListOption, Popup, BetList, TestHelper) {
        describe("BetList", function () {
            beforeEach(function () {
                TestHelper.initGlobalSetting();
                appendSetFixtures('<input id="SortBy" value="Foo" />');
                appendSetFixtures('<input id="SortOrder" value="asc" />');
                BetList.initialize();
            });

            afterEach(function () {
                $("#SortBy").remove();
                $("#SortOrder").remove();
            });

            describe("getSortParams()", function () {
                it("should return sorting data stored in inputs", function () {
                    var result = BetList.getSortParams();

                    expect(result).toEqual({ SortBy: 'Foo', SortOrder: 'asc' });
                });
            });

            describe("loadData(params, url)", function () {
                var request;

                beforeEach(function (done) {
                    appendSetFixtures('<input id="HiddenColumnList" value="1">');
                    jasmine.Ajax.install();

                    jasmine.Ajax
                        .stubRequest('localhost-test')
                        .andReturn({
                            'status': 200,
                            'contentType': 'application/json',
                            'responseText': '{ "Main": {}, "Total": {}, "IsShowTotal": true, "LeagueName": "Test league" }'
                        });

                    spyOn(BetList, 'bindData');
                    spyOn(BetList, 'setLeagueTitle');

                    BetList.loadData({}, 'localhost-test');
                    request = jasmine.Ajax.requests.mostRecent();

                    setTimeout(done, 10);
                });

                afterEach(function () {
                    jasmine.Ajax.uninstall();
                    $("#HiddenColumnList").remove();
                });

                it("should return sorting data stored in inputs", function () {
                    expect(request.url).toBe('localhost-test');
                });

                it("BetList.bindData() should be called with expected param", function () {
                    expect(BetList.bindData).toHaveBeenCalledWith({ Main: {}, Total: {}, IsShowTotal: true, LeagueName: "Test league" });
                });

                it("BetList.setLeagueTitle() should be called with expected param", function () {
                    expect(BetList.setLeagueTitle).toHaveBeenCalledWith('Test league');
                });
            });

            describe("loadDataPaging(url)", function () {
                beforeEach(function () {
                    appendSetFixtures('<div id="HiddenColumnList"></div>');
                    spyOn($.fn, 'jqGrid');
                    BetList.loadDataPaging('');
                });

                afterEach(function () {
                    $("#HiddenColumnList").remove();
                });

                it("should call .jqGrid('GridUnload')", function () {
                    expect($.fn.jqGrid).toHaveBeenCalledWith('GridUnload');
                });

                it("should call .jqGrid() with a selector '#BetListGrid'", function () {
                    expect($.fn.jqGrid.calls.mostRecent().object.selector).toBe('#BetListGrid');
                });
            });

            describe("bindData(url)", function () {
                it("gridOption.colNames should be a valid array", function () {
                    var gridOption;
                    appendSetFixtures('<div id="HiddenColumnList"></div>');
                    spyOn($.fn, 'jqGrid').and.callFake(function (param) { gridOption = param; });
                    BetList.bindData({ Main: {}, Total: {}, IsShowTotal: true, LeagueName: "Test league" });
                    expect(gridOption.colNames).toEqual(["#", "ExternalId", "SystemId", "TransTime", "Choice", "Odds", "Stake", "WinLoss", "EffectiveBettingValue", "LicenseeWL/Comm", "Status"]);
                });
            });

            describe("getMixParlayResultUrl(refno, winlostdate, bettype)", function () {
                it("should return an url with correct parameters", function () {
                    var result = BetList.getMixParlayResultUrl(1, 2, 3);
                    expect(result).toBe('ResultReport/ResultPopup?refno=1&winlossdate=2&bettype=3&matchid=1');
                });
            });

            describe("getSportBookResultUrl(matchid, bettype, raceNo, sporttype, league, isOutright, betid)", function () {
                it("should return an url with correct parameters", function () {
                    var result = BetList.getSportBookResultUrl(1, 2, 3, 4, 5, 6, 7);
                    expect(result).toBe('ResultReport/ResultPopup?matchid=1&bettype=2&raceno=3&sporttype=4&isoutright=6&betid=7');
                });
            });

            describe("getMicrogamingResultUrl(gameid, custid)", function () {
                it("should return an url with correct parameters", function () {
                    var result = BetList.getMicrogamingResultUrl(1, 2);
                    expect(result).toBe('ResultReport/MicrogamingResultPopup?gameid=1&custid=2');
                });
            });

            describe("setLeagueTitle(leagueName)", function () {
                beforeEach(function () {
                    appendSetFixtures('<div class="league-name-title"></div>');
                });

                it("'.league-name-title' should contain resource 'BetList' as default", function () {
                    BetList.setLeagueTitle();
                    var result = BetList.getMicrogamingResultUrl(1, 2);
                    expect($('.league-name-title').html()).toBe('BetList - ');
                });

                it("'.league-name-title' should contain the text passed as paramter", function () {
                    BetList.setLeagueTitle('Hello');
                    var result = BetList.getMicrogamingResultUrl(1, 2);
                    expect($('.league-name-title').html()).toBe('Hello - ');
                });
            });

            describe("showMicrogamingResultPopup(title, gameid, custid)", function () {
                it(".dialog() should be called with correct parameters", function () {
                    spyOn(Popup, 'openPopupWithIframe');
                    BetList.showMicrogamingResultPopup('Hello', 1, 2);
                    var url = "ResultReport/MicrogamingResultPopup?gameid=1&custid=2";
                    expect(Popup.openPopupWithIframe).toHaveBeenCalledWith(url, { width: 750, height: 400, title: 'Hello', id: 'betlist-popup-result' });
                });
            });

            describe("viewResult(matchid, raceNo, bettype, sporttype, refno, username, winlostdate, refnoMixParlay, league, isOutright, betid, betcheck, custid)", function () {
                beforeEach(function () {
                    spyOn(Popup, 'openPopupWithIframe');
                });

                it("BetList.showMicrogamingResultPopup() should be called if sporttype is Microgaming", function () {
                    var SPORT_MICROGAMMING = 203;
                    spyOn(BetList, 'showMicrogamingResultPopup');
                    BetList.viewResult(null, null, null, SPORT_MICROGAMMING);

                    expect(BetList.showMicrogamingResultPopup).toHaveBeenCalled();
                });

                it("BetList.getMixParlayResultUrl() should be called if bettype is MixParlay", function () {
                    var BETTYPE_MIXPARLAY = 9;
                    spyOn(BetList, 'getMixParlayResultUrl');
                    BetList.viewResult(null, null, BETTYPE_MIXPARLAY);

                    expect(BetList.getMixParlayResultUrl).toHaveBeenCalled();
                });

                it("BetList.getSportBookResultUrl() should be called if bettype is NOT MixParlay", function () {
                    spyOn(BetList, 'getSportBookResultUrl');
                    BetList.viewResult(null, null);

                    expect(BetList.getSportBookResultUrl).toHaveBeenCalled();
                });

                it("$.fn.dialog() should be called if sporttype is NOT Microgaming", function () {
                    spyOn(BetList, 'getSportBookResultUrl');
                    BetList.viewResult(null, null);

                    expect(Popup.openPopupWithIframe).toHaveBeenCalled();
                });
            });

            describe("showMixParlayDetail(transId, divEvent)", function () {
                describe("'divEvent' element is visible", function () {
                    var $div;
                    beforeEach(function () {
                        $div = $('<div><div></div></div>');
                        setFixtures($div);
                        BetList.showMixParlayDetail(0, $div);
                    });

                    afterEach(function () {
                        $div.remove();
                    });

                    it("'divEvent' element should be hide", function () {
                        expect($div.is(':visible')).toBe(false);
                    });

                    it("'divEvent' element shoult not contain any child.", function () {
                        expect($div.html()).toBe('');
                    });
                });

                describe("'divEvent' element is hidden", function () {
                    var $div, request;
                    beforeEach(function (done) {
                        $div = $('<div style="display:none; width: 10px; height: 20px"></div>');
                        setFixtures($div);
                        jasmine.Ajax.install();

                        jasmine.Ajax
                        .stubRequest(/api\/MixParlayBetList\/Detail\?transId=0/)
                        .andReturn({
                            'status': 200,
                            'contentType': 'application/json',
                            'responseText': '[{ "Choice": 1 }, { "Choice": 2 }, { "Choice": 3 }]'
                        });

                        BetList.showMixParlayDetail(0, $div);
                        request = jasmine.Ajax.requests.mostRecent();

                        setTimeout(function () {
                            done();
                        }, 100);
                    });

                    afterEach(function () {
                        jasmine.Ajax.uninstall();
                        $div.remove();
                    });

                    it("request url should be correct", function () {
                        expect(request.url).toMatch(/api\/MixParlayBetList\/Detail\?transId=0/);
                    });

                    it("'divEvent' element should be visible", function () {
                        expect($div.is(':visible')).toBe(true);
                    });

                    it("'divEvent' element should contain correct html", function () {
                        expect($div.html()).toBe('1<div class="line"></div>2<div class="line"></div>3');
                    });
                });
            });

            describe("showSystemParlayDetail(transId, refNo, betId, custId, betTeam, baseCurrency)", function () {
                it("Popup.openPopupWithIframe(url, options) should be called with correct parameters", function () {
                    spyOn(Popup, 'openPopupWithIframe');
                    BetList.showSystemParlayDetail(1, 0, 0, 0, 2, "eur");
                    var url = 'SystemParlayBetList/Detail?refno=0&betteam=2&basecurrency=eur';
                    expect(Popup.openPopupWithIframe).toHaveBeenCalledWith(url, { width: 775, height: 500, title: 2, id: 'betlist-popup-detail' });
                });
            });

            describe("showMicroGamingRnGBetsDetails(transId, winlostDate, custId, transType)", function () {
                it("Popup.openPopupWithIframe(url, options) should be called with correct parameters", function () {
                    spyOn(Popup, 'openPopupWithIframe');
                    spyOn($.fn, 'height').and.returnValue(300);
                    BetList.showMicroGamingRnGBetsDetails(0, new Date('2015/2/1'), 0, 0);
                    var url = 'MicroGamingRngBetList/Detail?transid=0&custid=0&transtype=0';
                    var title = 'Microgaming - DetailedBetlist - 02/01/2015';
                    
                    expect(Popup.openPopupWithIframe).toHaveBeenCalledWith(url, { width: 870, height: 250, title: title, id: 'betlist-popup-detail' });
                });
            });

            describe("showAGCasinoDetails(transId, winlostDate, custId, transType)", function () {
                it("Popup.openPopupWithIframe(url, options) should be called with correct parameters", function () {
                    spyOn(Popup, 'openPopupWithIframe');
                    spyOn($.fn, 'height').and.returnValue(300);
                    BetList.showAGCasinoDetails(0, new Date('2015/2/1'), 0, 0);
                    var url = 'AGCasinoBetList/Detail?transid=0&custid=0&transtype=0';
                    var title = 'AGCasino - DetailedBetlist - 02/01/2015';

                    expect(Popup.openPopupWithIframe).toHaveBeenCalledWith(url, { width: 870, height: 250, title: title, id: 'betlist-popup-detail' });
                });
            });

            describe("ValidProducts()", function () {
                beforeEach(function () {
                    appendSetFixtures('<div id="ProductList"></div>');
                    spyOn(Popup, 'openPopup');
                });

                afterEach(function () {
                    $("#ProductList").remove();
                });

                it("should return false if #ProductList does not contain checked input", function () {
                    expect(BetList.ValidProducts()).toBe(false);
                });

                it("Popup.openPopupWithIframe(url, options) should be called if #ProductList does not contain checked input", function () {
                    BetList.ValidProducts();
                    var dialogForm = '<div title="LrfNotification">AlertChooseProductMsg</div>';

                    expect(Popup.openPopup).toHaveBeenCalledWith(dialogForm, { width: 350, height: 200, title: 'LrfNotification' });
                });

                it("should return true if #ProductList contain a checked input", function () {
                    $('#ProductList').append('<input type="checkbox" checked=true />');

                    expect(BetList.ValidProducts()).toBe(true);
                });
            });
        });
    });
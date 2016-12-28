﻿define(['jquery', 'common/site', 'pages/betlist/betlist', 'pages/betlist/betlistrunning'],
    function ($, Site, BetList, BetListRunning) {
        describe("BetListRunning", function () {
            beforeAll(function () {
                spyOn(BetList, "initialize");
                spyOn(BetList, "loadData");
                spyOn(Site, "getSingleResource").and.callFake(function (text) {
                    return text;
                });
            });

            describe("initialize()", function () {
                it("initEvent() should be called.", function () {
                    spyOn(BetListRunning, "initEvent");
                    BetListRunning.initialize();
                    
                    expect(BetListRunning.initEvent).toHaveBeenCalled();
                });

                it("submit() should be called.", function () {
                    spyOn(BetListRunning, "submit");
                    BetListRunning.initialize();

                    expect(BetListRunning.submit).toHaveBeenCalled();
                });

                it("Site.addUserGuide() should be called with correct parameters.", function () {
                    setFixtures('<input id="userGuideName" value="BetListRunningUserGuide"></input>');
                    appendSetFixtures('<input id="title" value="BetListRunningTitle"></input>');
                    spyOn(Site, "addUserGuide");
                    BetListRunning.initialize();

                    expect(Site.addUserGuide).toHaveBeenCalledWith({
                        resourceName: "BetListRunningUserGuide",
                        title: "TotalBets - BetListRunningTitle"
                    });
                });
            });

            describe("initEvent()", function () {
                it("submit() should be called when #SubmitButton is clicked.", function () {
                    setFixtures('<input id="SubmitButton" type="button" />');
                    spyOn(BetListRunning, "submit");

                    BetListRunning.initEvent();
                    $("#SubmitButton").click();

                    expect(BetListRunning.submit).toHaveBeenCalled();
                });

                it("Site.redirect() should be called with correct url when #ExportToExcel is clicked.", function () {
                    setFixtures('<input id="ExportToExcel" type="button" />');
                    spyOn(Site, "redirect");
                    spyOn(Site, "getCurrentUrl").and.callFake(function () {
                        return "localhost";
                    });
                    spyOn(BetList, "getSortParams").and.callFake(function () {
                        return {
                            SortBy: "Column1",
                            SortOrder: "abc"
                        };
                    });

                    BetListRunning.initEvent();
                    $("#ExportToExcel").click();

                    expect(Site.redirect).toHaveBeenCalledWith("localhost?licenseetype=&currencyname=&isexportexcel=true&sortby=Column1&sortorder=abc");
                });
            });

            describe("submit()", function () {
                beforeAll(function () {
                    spyOn(Site, 'getLocation').and.callFake(function () {
                        return {
                            pathname: "/HelloPede"
                        };
                    });

                });

                it("BetList.initialize() should be called.", function () {
                    BetListRunning.submit();

                    expect(BetList.initialize).toHaveBeenCalled();
                });

                it("BetList.loadData() should be called with correct parameter.", function () {
                    spyOn(Site, "resolveClientUrl").and.callFake(function (text) {
                        return text;
                    });

                    BetListRunning.submit();

                    expect(BetList.loadData).toHaveBeenCalledWith(jasmine.any(Object), 'api/RunningBetList/HelloPede');
                });
            });
        });
});
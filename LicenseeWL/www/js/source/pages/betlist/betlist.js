define(
    ['jquery', 'common/site', 'common/querystring', 'lib/jqgrid/jquery.jqgrid.additional', './betlist.option', 'moment', 'common/popup',
        'lib/jqgrid/jquery.jqGrid.en', 'lib/jqgrid/jquery.jqGrid.min', "vendor-materialize"],
    function ($, Site, QueryString, jqGridAdditional, BetListOption, moment, Popup) {
        "use strict";
        var BETTYPE_MIXPARLAY = 9, BETTYPE_SYSTEMPARLAY = 29;
        var MIN_BETTYPE_FASTMARKET = 221;
        var MAX_BETTYPE_FASTMARKET = 225;
        var SPORT_MICROGAMMING_LC = 203;
        var SPORT_MICROGAMMING_RNG = 205;
        var SPORT_RNG_GAME = 208;
        var SPORT_RNG_MINIGAME = 209;
        var SPORT_RNG_MOBILE = 210;
        var SPORT_ALLBET = 211;
        var SPORT_VOIDBRIDGE = 212;
        var SPORT_GLOBALGAMING = 219;

        var _sortColumnName, _sortOrder;
        var _params, _url;
        var _isShowSumStake;

        function showDetailPopUp(url, option) {
            option.id = "betlist-popup-detail";
            Popup.openPopupWithIframe(url, option);
        }

        function showResultPopUp(url, option) {
            option.id = "betlist-popup-result";
            Popup.openPopupWithIframe(url, option);
        }

        function isFastMarket(bettype) {
            return bettype >= MIN_BETTYPE_FASTMARKET && bettype <= MAX_BETTYPE_FASTMARKET;
        }

        var _me = {
            getSortParams: function () {
                if (!_sortColumnName) {
                    return null;
                }

                return {
                    SortBy: _sortColumnName,
                    SortOrder: _sortOrder
                };
            },
            submiting: true,
            initialize: function () {
                Site.initialize();

                if (_me.isMatchWLBetList() === true) {
                    _me.updateSortColumn();
                }

                _isShowSumStake = $("#IsShowSumStake").val() === "1";

                _sortColumnName = _sortColumnName || $("#SortBy").val();
                _sortOrder = _sortOrder || $("#SortOrder").val();

                _me.registerBetListGlobalFunctions();
            },

            updateSortColumn: function () {
                BetListOption.columnModel[1].sortable = true; // externalId
                BetListOption.columnModel[2].sortable = true; // systemId
            },

            isMatchWLBetList: function () {
                var regex = /MatchWinLossBetList/i;
                return regex.test($("#ApiUrl").val());
            },

            gridComplete: function (grid) {
                // add sort icon
                var sortCol = _sortColumnName === "Winlost" ? "WinLoss" : _sortColumnName;
                sortCol = _sortColumnName === "nickname" ? "ExternalId" : sortCol;
                sortCol = _sortColumnName === "UserName" ? "SystemId" : sortCol;
                if (sortCol) {
                    $(grid).closest(".ui-jqgrid-view")
                        .find(".ui-jqgrid-sortable")
                        .each(function (index, element) {
                            var $this = $(element);
                            $this.find(".s-ico").remove();

                            if (element.id.indexOf(sortCol) > -1) {
                                var sortClass = "sort-" + _sortOrder;
                                var sortSpan = $("<span style='display: inline; margin: 2px 0px 0px 2px'></span");
                                sortSpan.addClass(sortClass);
                                $this.append(sortSpan);
                                $this.addClass("sorted-heading");
                            }
                        });
                }
                // Resize
                jqGridAdditional.gridComplete();
                // Remove unnecessary item
                if (_isShowSumStake) {
                    $(".ui-jqgrid-ftable td[aria-describedby=BetListGrid_Odds]").html(Site.getSingleResource("GrandTotal")).removeAttr("title");
                } else {
                    $(".ui-jqgrid-ftable td[aria-describedby=BetListGrid_Stake]").html(Site.getSingleResource("GrandTotal")).removeAttr("title");
                }

                $("#pager2").show();

                // fix cursor on non-sortable columns
                var cm = $(grid)[0].p.colModel;
                $.each($(grid)[0].grid.headers, function (index, value) {
                    var cmi = cm[index];
                    if (cmi.sortable) {
                        $('.ui-jqgrid-sortable', value.el).css({ cursor: "pointer" });
                    }
                });

                $(".ui-jqgrid-bdiv").css({ "height": "auto" });
                jqGridAdditional.updateGridHeight();
                Site.unBlockUI();
            },

            getGridOption: function () {
                var gridOption = $.extend(true, {}, BetListOption.gridOption);

                gridOption.onSortCol = function (index) {
                    if (window.disableBetListSorting) {
                        return 'stop';
                    }
                    Site.blockUI();
                    index = index === "WinLoss" ? "Winlost" : index;
                    index = index === "ExternalId" ? "nickname" : index;
                    if (_sortColumnName === index) {
                        _sortOrder = _sortOrder === "asc" ? "desc" : "asc";
                    } else {
                        _sortOrder = "desc";
                        _sortColumnName = index;
                    }
                    if (window.CorrectScoreBetList || window.CancelledBetsBetList) {
                        $("#SortBy").val(_sortColumnName);
                        $("#SortOrder").val(_sortOrder);
                    }

                    if (window.serverPaging || $("#IsServerPaging").val() === "1") {
                        _me.loadDataPaging(_url);
                    }
                    else {
                        _me.loadData(_params, _url);
                    }

                    return 'stop';
                };

                // Specify the hidden column
                var hiddenColumnList = $("#HiddenColumnList").val();
                var hiddenColumnTokens = hiddenColumnList.split(",");
                var showSummary = $("#ShowSummary").val() === "0" ? false : hiddenColumnList.indexOf("licenseewl") < 0;

                $.each(hiddenColumnTokens, function (index, value) {
                    jqGridAdditional.setColumnVisible(BetListOption.columnModel, value, true);
                });
                if ($("#HasBetEffectiveColumn").val() !== "1") {
                    jqGridAdditional.setColumnVisible(BetListOption.columnModel, "BetEffective", true);
                }
                gridOption.colNames = BetListOption.columnNames;
                gridOption.colModel = BetListOption.columnModel;
                gridOption.footerrow = showSummary;
                var hasCustComm = $('#HasCustComm').val();
                if (hasCustComm === '1') {
                    gridOption.colNames = $.map(gridOption.colNames, function (val) {
                        if (val === 'WinLoss') {
                            return '@[WinLoss]/@[Comm]';
                        }
                        return val;
                    });
                }
                gridOption.colNames = Site.getResources(gridOption.colNames);
                return gridOption;
            },

            loadData: function (params, url) {
                if (typeof params === "string") {
                    params = JSON.parse(params);
                }

                _params = params;
                _url = url;

                if (params && _sortColumnName) {
                    params.SortBy = _sortColumnName;
                    params.SortOrder = _sortOrder;
                }

                var paramString = typeof (params) === "object" ? JSON.stringify(params) : params;

                $.ajax({
                    type: "POST",
                    data: paramString,
                    contentType: 'application/json',
                    dataType: "json",
                    cache: false,
                    url: url,
                    success: function (response) {
                        if (response !== null) {
                            _me.bindData(response);
                            _me.setLeagueTitle(response.LeagueName);
                        }
                    },
                    beforeSend: function () {
                        Site.blockUI();
                    },
                    complete: function () {
                        Site.unBlockUI();
                    }
                });
            },

            loadDataPaging: function (url) {
                _url = url;
                Site.blockUI();
                if (url && _sortColumnName) {
                    url = QueryString.setParam(url, "IsServerPaging", true);
                    url = QueryString.setParam(url, "SortBy", _sortColumnName);
                    url = QueryString.setParam(url, "SortOrder", _sortOrder);
                }

                _me.submiting = true;

                var gridOption = _me.getGridOption();
                var rows = Number($("#BetListGrid").getGridParam("rowNum")) || gridOption.rowNum;
                gridOption.url = url;
                gridOption.rowNum = rows;
                gridOption.height = 0;
                gridOption.loadonce = false;
                gridOption.datatype = "json";
                gridOption.gridComplete = function () {
                    _me.gridComplete(this);
                    if (_me.submiting) {
                        $(".ui-pg-selbox").val(rows);
                    }
                    _me.submiting = false;
                };

                // Show the grid
                $("#BetListGrid").jqGrid('GridUnload');
                $("#BetListGrid").jqGrid(gridOption);
            },

            bindData: function (response) {
                $("#BetListGrid").jqGrid('GridUnload');

                if (response === null || response.Main.length === 0) {
                    jqGridAdditional.setNoInfo();
                    return;
                }

                var rawData = response.Main;
                var summary = response.Total;
                var sumWinLoss = jqGridAdditional.formatDecimal(summary.SumWinLoss);
                var sumLicenseeWl = jqGridAdditional.formatLicenseeWl(summary.SumLicenseeWl);
                var sumBetEffective = jqGridAdditional.formatDecimal(summary.SumBetEffective);
                var gridOption = _me.getGridOption();

                var rowNum = Number($("#BetListGrid").getGridParam("rowNum")) || gridOption.rowNum;
                if (rowNum < gridOption.rowList[0]) {
                    rowNum = gridOption.rowList[0];
                }
                // Show the grid
                gridOption.rowNum = rowNum;
                gridOption.data = rawData;
                gridOption.userData = { WinLoss: sumWinLoss, LicenseeWL: sumLicenseeWl, BetEffective: sumBetEffective };

                if (_isShowSumStake) {
                    gridOption.userData.Stake = jqGridAdditional.formatDecimal(summary.SumStake);
                    gridOption.userDataOnFooter = true;
                    gridOption.footerrow = true;
                }
                else if (response.IsShowTotal === undefined || response.IsShowTotal) {
                    gridOption.userDataOnFooter = true;
                }
                else {
                    gridOption.userDataOnFooter = false;
                    gridOption.footerrow = false;
                }
                gridOption.gridComplete = function () {
                    _me.gridComplete(this);
                };

                $("#BetListGrid").jqGrid(gridOption);
            },

            getMixParlayResultUrl: function (refno, winlostdate, bettype) {
                var url = Site.resolveClientUrl('ResultReport/ResultPopup');
                url = QueryString.setParam(url, "refno", refno);
                url = QueryString.setParam(url, "winlossdate", winlostdate);
                url = QueryString.setParam(url, "bettype", bettype);
                url = QueryString.setParam(url, "matchid", 1);

                return url;
            },

            getSportBookResultUrl: function (matchid, bettype, raceNo, sporttype, league, isOutright, betid) {
                var url = Site.resolveClientUrl('ResultReport/ResultPopup');
                url = QueryString.setParam(url, "matchid", matchid);
                url = QueryString.setParam(url, "bettype", bettype);
                url = QueryString.setParam(url, "raceno", raceNo);
                url = QueryString.setParam(url, "sporttype", sporttype);
                url = QueryString.setParam(url, "isoutright", isOutright);
                url = QueryString.setParam(url, "betid", betid);

                return url;
            },

            getMicrogamingResultUrl: function (gameid, custid) {
                var url = Site.resolveClientUrl('ResultReport/MicrogamingResultPopup');
                url = QueryString.setParam(url, "gameid", gameid);
                url = QueryString.setParam(url, "custid", custid);

                return url;
            },

            viewRngCasinoResult: function (title, refno) {
                var url = Site.resolveClientUrl('ResultReport/ShowRngCasinoSingleWalletResult');

                var params = { "refNo": refno };
                $.ajax({
                    type: "POST",
                    contentType: 'application/json',
                    dataType: "json",
                    data: JSON.stringify(params),
                    cache: false,
                    url: url,
                    success: function (response) {
                        var result = response.Result;
                        if (response.Success) {
                            if (result === "") {
                                return;
                            }

                            showResultPopUp(result, { width: 800, height: 380, title: title });
                        }
                        else {
                            alert(Site.getSingleResource("ErrorProcessingMsg"));
                        }
                    },
                    beforeSend: function () {
                        Site.blockUI();
                    },
                    complete: function () {
                        Site.unBlockUI();
                    }
                });
            },

            viewVoidbridgeResult: function (custId, gamePlayId, title) {
                var url = Site.resolveClientUrl('ResultReport/VoidbridgeResult');
                Site.blockUI();
                $.get(url + '?custid=' + custId + '&gamePlayId=' + gamePlayId, function (result) {
                    if (result !== '') {
                        showResultPopUp(result, { width: 800, height: 380, title: title });
                        Site.unBlockUI();
                    }
                });
            },

            viewAllBetResult: function (trasdesc, betcheck, bettype, title) {
                var url = Site.resolveClientUrl('ResultReport/AllBetResult?transdesc=' +
                    encodeURIComponent(trasdesc) + '&betcheck=' + betcheck + '&bettype=' + bettype);

                Site.blockUI();
                showResultPopUp(url, { width: 800, height: 380, title: title });
                Site.unBlockUI();
            },

            setLeagueTitle: function (leagueName) {
                var leagueNameText = leagueName === '' || leagueName === undefined ? Site.getSingleResource('BetList') : leagueName;
                $(".league-name-title").html(leagueNameText + " - ");
            },
            showMicrogamingResultPopup: function (title, gameid, custid) {
                var url = _me.getMicrogamingResultUrl(gameid, custid);

                showResultPopUp(url, { width: 750, height: 400, title: title });
            },
            viewGlobalGamingResult: function (custId, gameId, title) {
                var url = Site.resolveClientUrl('ResultReport/GlobalGamingResult');
                Site.blockUI();
                $.get(url + '?custid=' + custId + '&gameId=' + gameId, function (result) {
                    if (result !== '') {
                        showResultPopUp(result, { width: 800, height: 380, title: title });
                        Site.unBlockUI();
                    }
                });
            },
            viewResult: function (matchid, raceNo, bettype, sporttype, refno,
                username, winlostdate, refnoMixParlay, league, isOutright, betid, betcheck, custid, transdecs) {
                var title = Site.getSingleResource("Result");
                if (sporttype === SPORT_MICROGAMMING_RNG || sporttype === SPORT_MICROGAMMING_LC) {
                    _me.showMicrogamingResultPopup(title, betcheck, custid);
                }
                else if (sporttype === SPORT_RNG_GAME || sporttype === SPORT_RNG_MINIGAME || sporttype === SPORT_RNG_MOBILE) {
                    _me.viewRngCasinoResult(title, refno);
                }
                else if (sporttype === SPORT_VOIDBRIDGE) {
                    _me.viewVoidbridgeResult(custid, betcheck, title);
                }
                else if (sporttype === SPORT_ALLBET) {
                    _me.viewAllBetResult(transdecs, betcheck, bettype, title);
                }
                else if (sporttype === SPORT_GLOBALGAMING) {
                    _me.viewGlobalGamingResult(custid, betcheck, title);
                }
                else {
                    bettype = Number(bettype);
                    var isParlay = bettype === BETTYPE_MIXPARLAY || bettype === BETTYPE_SYSTEMPARLAY;
                    var url = isParlay
                        ? _me.getMixParlayResultUrl(refnoMixParlay, winlostdate, bettype)
                        : _me.getSportBookResultUrl(matchid, bettype, raceNo, sporttype, league, isOutright, betid, betcheck, custid);

                    var height = isParlay ? 450 : (isFastMarket(bettype) ? 250 : 150);
                    var width = 750;

                    showResultPopUp(url, { width: width + 25, height: height + 70, title: title });
                }
            },

            showMixParlayDetail: function (transId, divEvent) {
                var url = Site.resolveClientUrl('api/MixParlayBetList/Detail?transId=' + transId);
                if (divEvent.css("display") === 'none') {
                    $.ajax({
                        type: "GET",
                        contentType: 'application/json',
                        dataType: "json",
                        cache: false,
                        url: url,
                        success: function (response) {
                            var choice = "";
                            var len = response.length;
                            $.each(response, function (index, item) {
                                if (index === len - 1) {
                                    choice += item.Choice;
                                }
                                else {
                                    choice += item.Choice + "<div class='line'></div>";
                                }
                            });
                            divEvent.html(choice);
                            divEvent.css("display", "");
                        },
                        beforeSend: function () {
                            Site.blockUI();
                        },
                        complete: function () {
                            Site.unBlockUI();
                        }
                    });
                }
                else {
                    divEvent.css("display", "none");
                    divEvent.html("");
                }
            },

            showNewParlayDetail: function (transId, transIndex, refNo, handicap1, handicap2, betcheck, betteam) {
                var $divEvent = $('#divEvent_' + transId + "" + transIndex);
                var $nameDiv = $('#combinationOfferName_' + transId + transIndex);
                $divEvent.addClass("mx-parlay"); //to make line-through for void-parlay-ticket

                if ($divEvent.is(":hidden")) {
                    var url = Site.resolveClientUrl('api/MixParlayBetList/NewParlayDetail');
                    url = QueryString.setParam(url, "transId", transId);
                    url = QueryString.setParam(url, "refNo", refNo);
                    url = QueryString.setParam(url, "handicap1", handicap1);
                    url = QueryString.setParam(url, "handicap2", handicap2);
                    url = QueryString.setParam(url, "betcheck", betcheck);
                    url = QueryString.setParam(url, "betteam", betteam);

                    $.ajax({
                        type: "GET",
                        contentType: 'application/json',
                        dataType: "json",
                        cache: false,
                        url: url,
                        success: function (response) {
                            var length = response.Data.length;
                            if (length > 0) {
                                var choice = "";
                                $.each(response.Texts, function (index, item) {
                                    choice += item;
                                });

                                $.each(response.Data, function (index, item) {
                                    if (index === length - 1) {
                                        choice += item.Choice;
                                    }
                                    else {
                                        choice += item.Choice + "<div class='line'></div>";
                                    }
                                });
                                $divEvent.html(choice).show();
                                $nameDiv.hide();
                            }
                        },
                        beforeSend: Site.blockUI,
                        complete: Site.unBlockUI
                    });
                }
                else {
                    $divEvent.hide().html("");
                    $nameDiv.show();
                    $(".ui-jqgrid-bdiv").css("height", "auto");
                }
            },

            showSystemParlayDetail: function (transId, refNo, betId, custId, betTeam, baseCurrency) {
                if (Number(transId) === 0) { return; }

                var url = Site.resolveClientUrl('SystemParlayBetList/Detail');
                url = QueryString.setParam(url, "refno", refNo);
                url = QueryString.setParam(url, "betteam", betTeam);
                url = QueryString.setParam(url, "basecurrency", baseCurrency);

                showDetailPopUp(url, { width: 775, height: 500, title: betTeam });
            },

            showMicroGamingRnGBetsDetails: function (transId, winlostDate, custId, transType) {
                var url = Site.resolveClientUrl('MicroGamingRngBetList/Detail');
                url = QueryString.setParam(url, "transid", transId);
                url = QueryString.setParam(url, "custid", custId);
                url = QueryString.setParam(url, "transType", transType);

                var popH = Math.min($(window).height() - 100, 550);
                var title = Site.getSingleResource("Microgaming") + " - " +
                    Site.getSingleResource("DetailedBetlist") + " - " + moment(new Date(winlostDate)).format("MM/DD/YYYY");

                showDetailPopUp(url, { width: 870, height: popH + 50, title: title });
            },

            showAGCasinoDetails: function (transId, winlostDate, custId, transType) {
                var url = Site.resolveClientUrl('AGCasinoBetList/Detail');
                url = QueryString.setParam(url, "transid", transId);
                url = QueryString.setParam(url, "custid", custId);
                url = QueryString.setParam(url, "transType", transType);

                var popH = Math.min($(window).height() - 100, 550);
                var title = Site.getSingleResource("AGCasino") + " - " +
                    Site.getSingleResource("DetailedBetlist") + " - " + moment(new Date(winlostDate)).format("MM/DD/YYYY");

                showDetailPopUp(url, { width: 870, height: popH + 50, title: title });
            },

            showRnGCasinoDetails: function (transId, winlostDate, custId, transType) {
                var url = Site.resolveClientUrl('RnGCasinoBetList/Detail');
                url = QueryString.setParam(url, "transId", transId);
                url = QueryString.setParam(url, "winlostDate", winlostDate);
                url = QueryString.setParam(url, "custId", custId);
                url = QueryString.setParam(url, "transType", transType);

                var popH = Math.min($(window).height() - 100, 550);
                var title = Site.getSingleResource("ProductCS") + " - " +
                    Site.getSingleResource("DetailedBetlist") + " - " + moment(new Date(winlostDate)).format("MM/DD/YYYY");

                showDetailPopUp(url, { width: 890, height: popH + 50, title: title });
            },

            showVoidBridgeDetails: function (transId, winlostDate, custId, transType) {
                var url = Site.resolveClientUrl('VoidbridgeBetList/Detail');
                url = QueryString.setParam(url, "transId", transId);
                url = QueryString.setParam(url, "winlostDate", winlostDate);
                url = QueryString.setParam(url, "custId", custId);
                url = QueryString.setParam(url, "transType", transType);

                var popH = Math.min($(window).height() - 100, 550);
                var title = Site.getSingleResource("ProductVB") + " - " +
                    Site.getSingleResource("DetailedBetlist") + " - " + moment(new Date(winlostDate)).format("MM/DD/YYYY");

                showDetailPopUp(url, { width: 890, height: popH + 50, title: title });
            },
            showAllBetDetails: function (transId, winlostDate, custId, transType) {
                var url = Site.resolveClientUrl('AllBetBetList/Detail');
                url = QueryString.setParam(url, "transid", transId);
                url = QueryString.setParam(url, "custid", custId);
                url = QueryString.setParam(url, "transType", transType);
                url = QueryString.setParam(url, "date", winlostDate);

                var popH = Math.min($(window).height() - 100, 550);
                var title = Site.getSingleResource("ProductAB") + " - " +
                    Site.getSingleResource("DetailedBetlist") + " - " + moment(new Date(winlostDate)).format("MM/DD/YYYY");

                showDetailPopUp(url, { width: 870, height: popH + 50, title: title });
            },
            showColossusBetsDetails: function (refNo, winlostDate, transId, custId, betCheck) {
                var params = $.parseJSON($("#BetListMetaModel").val());
                var url = Site.resolveClientUrl('ColossusBetBetList/Detail');
                url = QueryString.setParam(url, "refNo", refNo);
                url = QueryString.setParam(url, "date", winlostDate);
                url = QueryString.setParam(url, "transid", transId);
                url = QueryString.setParam(url, "custid", custId);
                url = QueryString.setParam(url, "betCheck", betCheck);
                url = QueryString.setParam(url, "BaseCurrency", params.BaseCurrency);

                var popH = Math.min($(window).height() - 100, 550);
                var title = Site.getSingleResource("TicketDetailOf").replace("{0}", refNo);

                showDetailPopUp(url, { width: 890, height: popH + 50, title: title });
            },
            showGlobalGamingDetails: function (transId, winlostDate, custId, transType) {
                var params = $.parseJSON($("#BetListMetaModel").val());
                var url = Site.resolveClientUrl('GlobalGamingBetList/Detail');
                url = QueryString.setParam(url, "transId", transId);
                url = QueryString.setParam(url, "winlostDate", winlostDate);
                url = QueryString.setParam(url, "custId", custId);
                url = QueryString.setParam(url, "transType", transType);
                url = QueryString.setParam(url, "BaseCurrency", params.BaseCurrency);

                var popH = Math.min($(window).height() - 100, 550), popW = 840;
                var title = Site.getSingleResource("ProductFW") + " - " +
                    Site.getSingleResource("DetailedBetlist") + " - " + moment(new Date(winlostDate)).format("MM/DD/YYYY");

                showDetailPopUp(url, { width: 890, height: popH + 50, title: title });
            },
            ValidProducts: function () {
                var temp = true;
                if ($("#ProductList input:checked").length === 0) {
                    temp = false;
                    var title = Site.getSingleResource("LrfNotification");
                    var dialogForm = '<div title="' + title + '">' + Site.getSingleResource("AlertChooseProductMsg") + '</div>';

                    Popup.openPopup(dialogForm, { width: 350, height: 200, title: title });
                }

                return temp;
            },

            ViewCasinoHandHistory: function (refNo) {
                var url = Site.resolveClientUrl('HandHistory/RNGCasino');
                var urlParam = $("#casino-hand-history-" + refNo).attr('url-param');

                url += urlParam;
                window.location = url;
            },

            registerBetListGlobalFunctions: function () {
                window.ViewResult = _me.viewResult;

                window.showMP = function (transId) {
                    var divEvent = $('#divEvent_' + transId);
                    divEvent.addClass("mx-parlay"); //to make line-through for void-parlay-ticket
                    _me.showMixParlayDetail(transId, divEvent);
                };

                window.showCombMP = function (transId, index) {
                    var divEvent = $('#divEvent_' + transId + "" + index);
                    divEvent.addClass("mx-parlay"); //to make line-through for void-parlay-ticket
                    _me.showMixParlayDetail(transId, divEvent);
                };

                window.showNewCombMP = _me.showNewParlayDetail;
                window.showCombMPDetail = _me.showSystemParlayDetail;
                window.showMicroGamingRnGBetsDetails = _me.showMicroGamingRnGBetsDetails;
                window.showAGCasinoDetails = _me.showAGCasinoDetails;
                window.showRnGCasinoDetails = _me.showRnGCasinoDetails;
                window.showVoidBridgeDetails = _me.showVoidBridgeDetails;
                window.showVoidbridgeResult = _me.viewVoidbridgeResult;
                window.showTodayRunningBetsDetails = _me.showAllBetDetails;
                window.showColossusBetsDetails = _me.showColossusBetsDetails;
                window.showGlobalGaming = _me.showGlobalGamingDetails;

                var betList = {
                    ViewCasinoHandHistory: _me.ViewCasinoHandHistory
                };
                window.BetList = betList;
            }
        };

        return _me;
    });
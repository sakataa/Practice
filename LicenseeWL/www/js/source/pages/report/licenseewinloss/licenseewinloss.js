define(
    ["jquery", "common/querystring", "common/site", "../report", "./licenseewinloss.option",
        "lib/jqgrid/jquery.jqgrid.additional", "common/pluginhelper", "moment", "common/popup",
        "lib/jqgrid/jquery.jqGrid.en", "lib/jqgrid/jquery.jqGrid.min", "vendor-materialize", "extensions/jquery.extension", "lib/linq"],
    function ($, QueryString, Site, Report, LicenseeWinLossOption, jqGridAdditional, PluginHelper, moment, Popup) {
        "use strict";
        var REPORT_BY_MONTHLY = 2;

        var cacheData = {};
        var ajaxRequest = null;
        var totalRowCount = 0;
        var _sortColumnName = null;
        var _sortOrder = "desc";
        var _level = 0;
        var _removeSorting = false;
        var _reportBy = null;
        var _submitData; // cache submit data of level 0.

        function sortData(arrayData) {
            var data = _sortOrder === "asc" ?
                 Enumerable.From(arrayData).OrderBy(function (x) { return x[_sortColumnName]; }).ToArray()
                 : Enumerable.From(arrayData).OrderByDescending(function (x) { return x[_sortColumnName]; }).ToArray();
            for (var i = 0; i < data.length; i++) {
                data[i].Index = i + 1;
            }

            return data;
        }

        var _me = {
            getTotalRowCount: function () {
                return totalRowCount;
            },
            initialize: function () {
                Site.initialize();
                _me.initEvent();
                _me.initSetting();
                LicenseeWinLossOption.gridOption.onSortCol = function (index) {
                    Site.blockUI();
                    window.setTimeout(function () {
                        _removeSorting = false;
                        if (_sortColumnName === index) {
                            _sortOrder = _sortOrder === "asc" ? "desc" : "asc";
                        } else {
                            _sortOrder = "asc";
                            _sortColumnName = index;
                        }

                        cacheData[_level].Data = sortData(cacheData[_level].Data);

                        _me.bindData(_level, _reportBy, cacheData[_level]);

                        Site.unBlockUI();
                    }, 100);
                    return 'stop';
                };

                Site.addUserGuide({
                    resourceName: "LicenseeWL",
                    title: Site.getSingleResource("LicenseeWinLoss")
                });
                Site.setMultiSelectForDropDownList('grid-products-multiselect', $("#productsData").val(), 'Code', 'Name', 'Status');
                PluginHelper.initDateRangePicker();
            },

            initSetting: function () {
                LicenseeWinLossOption.hasCustomerComm = Site.asBool($("#IsAllowedCustomerCommission").val());
                LicenseeWinLossOption.licenseeId = parseInt($("#drillDownLicenseeId").val());
            },

            initEvent: function () {
                $("body").on("click", ".bet-list-link", function () {
                    var dataDrillDown = $(this).attr("data-drill-down");
                    _me.openBetlistPopUp(dataDrillDown);
                });

                $('#SubmitButton').click(function () {
                    $('#IsExportExcel').val(false);
                    _level = 0;
                    _me.submit();
                });

                $('#ExportToExcel').click(function () {
                    $('#IsExportExcel').val(true);
                    var mainForm = $("#licenseewinloss");
                    var url = Site.resolveClientUrl(LicenseeWinLossOption.urlExcelData);
                    mainForm.attr("action", url);
                    mainForm.submit();
                    $('#IsExportExcel').val(false);
                    return false;
                });

                $("#level-link-container").on("click", ".level-link", function () {
                    var level = Number($(this).attr("data-level"));
                    _level = level;
                    return _me.goBack(level);
                });
            },

            //#region Layout
            setExcelUrl: function (level, currencyId, custId, fdate, tdate, currencyName) {
                var temp = 'api/LicenseeWinLossReport/Index';
                if (level > 0) {
                    temp += "?level=" + level + "&currencyId="
                    + currencyId + "&custId=" + custId + "&fdate=" + moment(fdate).format("MM/DD/YYYY")
                     + "&tdate=" + moment(tdate).format("MM/DD/YYYY") + "&currencyName=" + currencyName;
                }
                LicenseeWinLossOption.urlExcelData = temp;
            },

            renderBreadCrumb: function (level) {
                level = Number(level);
                if (level === 0) {
                    $(".breadCrumbHolder").hide();
                }
                else {
                    $(".breadCrumbHolder").show();
                    $("#level-link-container .level0").show();

                    var showLevel2 = level === 2;
                    $("#level-link-container .level2").toggle(showLevel2).toggleClass("active", showLevel2);
                    $("#level-link-container .level1").toggle(Number(LicenseeWinLossOption.licenseeId) === 1).toggleClass("active", !showLevel2);
                }
            },

            setReportTitle: function (currencyId, fromdate, todate, currencyName) {
                var titlePattern = Site.getSingleResource('LicenseeWinLoss') + ', {0} → {1} - {2}';
                var viewinKey = Site.getSingleResource("Viewin");
                //get currencyName
                var currencyTextList =
                {
                    "-3": viewinKey.replace("{0}", "GBP"),
                    "-2": viewinKey.replace("{0}", "USD"),
                    "-1": viewinKey.replace("{0}", "EUR"),
                    "0": Site.getSingleResource('AllCurrencies')
                };

                var currencyStr = currencyTextList[currencyId] === undefined
                    ? viewinKey.replace("{0}", currencyName || Site.getCurrencyName(currencyId))
                    : currencyTextList[currencyId];

                var title = $.format(titlePattern, moment(fromdate, "MM/DD/YYYY").format("MM/DD/YYYY"), moment(todate, "MM/DD/YYYY").format("MM/DD/YYYY"), currencyStr); // jshint ignore:line
                $(".report-title").html(title);
                // Show title
                $(".panel-heading").removeClass("hide");
            },
            //#end

            //#Get Data
            ajaxComplete: function (level, response) {
                level = Number(level);
                if (response !== null) {
                    var reportBy = $("input[name='ReportBy']:checked").val();
                    _reportBy = reportBy;
                    cacheData[level] = response;
                    //reset layout
                    if (level === 0) {
                        _me.setReportTitle($("#CurrencyId").val(), $("#FromDate").val(), $("#ToDate").val());
                    }

                    _me.renderBreadCrumb(level);
                    _me.bindData(level, reportBy, response);
                }
            },

            submit: function () {
                Report.setOriginalProduct();
                Site.updateOriginalLicenseeOption();

                var validProduct = Report.ValidProducts();
                if (!validProduct) {
                    return false;
                }

                var mainForm = $("#licenseewinloss");
                var data = mainForm.serializeObject();
                var option = {
                    type: "POST",
                    data: mainForm.serialize() +
                        (_sortColumnName ?
                            "&sortby=" + encodeURI(_sortColumnName) + "&sortOrder=" + _sortOrder : ""),
                    dataType: "json",
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    cache: false,
                    url: Site.resolveClientUrl(LicenseeWinLossOption.urlData),
                    success: function (response) {
                        _submitData = {
                            ProductOptions: response.ProductOptions,
                            DrawFilter: data.DrawFilter,
                            CurrencyId: data.CurrencyId,
                            ReportBy: Number(data.ReportBy),
                            FromDate: new Date(data.FromDate),
                            ToDate: new Date(data.ToDate),
                            CurrencyName: data.CurrencyName,
                            IsExcludedTestData: data.IsExcludedTestData
                        };

                        _me.setExcelUrl(0, 0, 0, "", "", "");
                        _me.ajaxComplete(0, response);
                    },
                    beforeSend: function () {
                        Site.blockUI();
                    },
                    complete: function () {
                        Site.unBlockUI();
                    }
                };
                if (ajaxRequest !== null) {
                    ajaxRequest.abort();
                }
                ajaxRequest = $.ajax(option);

                return true;
            },

            lastDateOfMonth: function (year, month) {
                return new Date(year, month + 1, 0);
            },

            drillDown: function (level, currencyId, customerId, datetime, currencyName, keepSorting) {
                level = Number(level);
                if (!keepSorting) {
                    _removeSorting = true;
                }

                if (_level !== level) {
                    _level = level;
                }
                var param =
                {
                    ProductOptions: $.parseJSON(_submitData.ProductOptions),
                    DrawFilter: _submitData.DrawFilter,
                    IsExcludedTestData: _submitData.IsExcludedTestData,
                    CurrencyId: _submitData.CurrencyId,
                    ReportBy: _submitData.ReportBy,
                    FromDate: _submitData.FromDate,
                    ToDate: _submitData.ToDate,
                    BaseCurrency: $("#BaseCurrency").attr("data-original")
                };

                var momentDate = moment(datetime);
                var fdate = momentDate.clone();
                var tdate = momentDate.clone();

                if (Number(param.ReportBy) === 2) {
                    var fday = 1;
                    var month = fdate.month();
                    var year = fdate.year();
                    var orignalFDate = moment(param.FromDate);
                    if (month === orignalFDate.month()) {
                        fday = orignalFDate.date();
                    }
                    fdate = moment([year, month, fday, 0, 0, 0, 0]);

                    var originalTDate = moment(param.ToDate);
                    if (month === originalTDate.month()) {
                        var tday = originalTDate.date();
                        tdate = moment([year, month, tday, 0, 0, 0, 0]);
                    }
                    else {
                        tdate = moment(_me.lastDateOfMonth(year, month));
                    }
                }
                if (keepSorting && _sortColumnName) {
                    param.SortBy = _sortColumnName;
                    param.SortOrder = _sortOrder;
                }

                var postData = JSON.stringify(param);

                var option = {
                    type: "POST",
                    data: postData,
                    dataType: "json",
                    contentType: "application/json",
                    cache: false,

                    url: Site.resolveClientUrl(LicenseeWinLossOption.urlData +
                        "?level=" + level + "&currencyId=" + currencyId + "&custId=" + customerId + "&fdate=" +
                        fdate.format("MM/DD/YYYY") + "&tdate=" + tdate.format("MM/DD/YYYY")),
                    success: function (response) {
                        _me.ajaxComplete(level, response);
                        if (response !== null && response.Data.length > 0) {
                            if (level > 0 && Number(param.CurrencyId) === 0) {
                                _me.setReportTitle(currencyId, fdate, tdate, currencyName);
                            } else {
                                _me.setReportTitle(param.CurrencyId, fdate, tdate, currencyName);
                            }
                            //update excel ULR
                            _me.setExcelUrl(level, currencyId, customerId, fdate, tdate, currencyName);
                        }
                    },
                    beforeSend: function () {
                        Site.blockUI();
                    },
                    complete: function () {
                        Site.unBlockUI();
                    }
                };
                if (ajaxRequest !== null) {
                    ajaxRequest.abort();
                }
                ajaxRequest = $.ajax(option);
            },

            goBack: function (level) {
                var reportBy = _submitData.ReportBy;

                if (level === 0) {
                    _me.renderBreadCrumb(level);
                    _me.bindData(0, reportBy, cacheData[level]);
                    //reset excel Link
                    _me.setExcelUrl(0, 0, 0, "", "", "");
                    _me.setReportTitle(_submitData.CurrencyId, _submitData.FromDate, _submitData.ToDate);
                }
                else if (level === 1) {
                    _me.bindData(1, reportBy, cacheData[level]);
                    LicenseeWinLossOption.urlExcelData = LicenseeWinLossOption.urlExcelData.replace("level=2", "level=1");
                    _me.renderBreadCrumb(level);
                }
            },

            //#BindReport

            bindTotal: function (level, totalData, summaryTotal) {
                var productOptions = $.parseJSON(_submitData.ProductOptions);
                productOptions = productOptions.reverse(); //make orders of product columns like excel file
                var columnModel = LicenseeWinLossOption.getTotalColModel(level, productOptions);
                var colspan = LicenseeWinLossOption.totalColspan[level];
                var summaryColspan = colspan + 1;

                jqGridAdditional.assignTotal(totalData, columnModel);
                var summaryRowCount = Report.bindSummaryTotal(columnModel, summaryTotal);
                jqGridAdditional.setGroupFooters(colspan, summaryColspan, summaryRowCount);
            },

            bindData: function (level, reportBy, response) {
                jqGridAdditional.clearGrid("ReportGrid");
                var numOfRow = response.Data.length;
                if (response === null || numOfRow === 0) {
                    jqGridAdditional.setNoInfo();
                    return;
                }

                level = Number(level);
                var reportGrid = $("#ReportGrid");
                var productOptions = $.parseJSON(_submitData.ProductOptions);
                productOptions = productOptions.reverse(); //make orders of product columns like excel file
                
                var numOfTotalRow = response.Total.length;
                totalRowCount = numOfTotalRow;

                var onPaging = false;

                var gridOption = LicenseeWinLossOption.getGridOption(level, reportBy, productOptions);
                gridOption.rownumbers = true;
                gridOption.data = response.Data;
                gridOption.userData = {};
                gridOption.rowNum = level === 2 ? LicenseeWinLossOption.pageSize : LicenseeWinLossOption.nonePagingSize;
                gridOption.rowList = LicenseeWinLossOption.rowList;
                gridOption.rowTotal = numOfRow;
                gridOption.pager = '#ppdata';
                gridOption.onPaging = function (pgButton) {
                    if (level === 2 && numOfRow > LicenseeWinLossOption.pageSize) {
                        if ($("#" + pgButton).hasClass("ui-state-disabled") === false) {
                            Site.blockUI();
                        }
                        onPaging = true;
                    }
                    else {
                        return 'stop';
                    }
                };
                gridOption.gridComplete = function () {
                    level = Number(level);
                    jqGridAdditional.gridComplete();
                    if (level === 2 && numOfRow > LicenseeWinLossOption.pageSize) {
                        $("#pg_ppdata").show();
                    }
                    else {
                        $("#pg_ppdata").hide();
                    }

                    if (onPaging && level === 2) {
                        $(".ui-jqgrid-ftable").html($("#footer").html());
                    }
                    else {
                        _me.bindTotal(level, response.Total, response.SummaryTotal);
                        $("#footer").html($(".ui-jqgrid-ftable").html());
                    }

                    onPaging = false;
                    _me.resizeGrid();

                    /*group header*/
                    if (numOfTotalRow > 0) {
                        LicenseeWinLossOption.addProductButton(reportGrid, "jqgh_ReportGrid", "ReportGrid", productOptions);
                    }

                    Site.unBlockUI();
                };

                // Show the grid
                reportGrid.jqGrid(gridOption);

                if (!_removeSorting) {
                    reportGrid.closest("div.ui-jqgrid-view")
                        .find("div.ui-jqgrid-hdiv table.ui-jqgrid-htable tr.ui-jqgrid-labels > th.ui-th-column > div.ui-jqgrid-sortable")
                        .each(function (index, element) {
                            var $this = $(element);
                            $this.find("span.s-ico").remove();

                            if (element.id.indexOf(_sortColumnName) > -1) {
                                var sortClass = "sort-" + _sortOrder;
                                var sortSpan = $("<span style='display: inline; margin: 2px 0px 0px 2px'></span");
                                sortSpan.addClass(sortClass);
                                $this.append(sortSpan);
                                $this.addClass("sorted-heading");
                            }
                        });
                }

                LicenseeWinLossOption.setGroupHeaderColumns(reportGrid, productOptions);

                LicenseeWinLossOption.restoreExpanse();
            },

            //#end

            openBetlistPopUp: function (dataDrillDown) {
                dataDrillDown = $.parseJSON(dataDrillDown);
                dataDrillDown.DrawFilter = _submitData.DrawFilter;
                dataDrillDown.IsExcludedTestData = _submitData.IsExcludedTestData;
                dataDrillDown.CurrencyId = _submitData.CurrencyId;
                dataDrillDown.CurrencyName = _submitData.CurrencyName;
                dataDrillDown.BaseCurrency = $("#BaseCurrency").attr("data-original");

                if (typeof dataDrillDown.DrillDownFromDate === 'string') {
                    dataDrillDown.DrillDownFromDate = new Date(dataDrillDown.DrillDownFromDate);
                    dataDrillDown.DrillDownToDate = new Date(dataDrillDown.DrillDownToDate);
                }

                if (_submitData.ReportBy === REPORT_BY_MONTHLY) {
                    var fday = 1;
                    var month = dataDrillDown.DrillDownFromDate.getMonth();
                    var year = dataDrillDown.DrillDownFromDate.getFullYear();

                    var orignalFDate = _submitData.FromDate;
                    var originalTDate = _submitData.ToDate;

                    if (month === orignalFDate.getMonth()) {
                        fday = orignalFDate.getDate();
                    }
                    dataDrillDown.DrillDownFromDate = new Date(year, month, fday, 0, 0, 0, 0);
                    if (month === originalTDate.getMonth()) {
                        var tday = originalTDate.getDate();
                        dataDrillDown.DrillDownToDate = new Date(year, month, tday, 0, 0, 0, 0);
                    }
                    else {
                        dataDrillDown.DrillDownToDate = _me.lastDateOfMonth(year, month);
                    }
                }

                var url = Site.resolveClientUrl("LicenseeWinLossBetList/Index");
                url = QueryString.setParam(url, "fromdate", moment(dataDrillDown.DrillDownFromDate).format("MM/DD/YYYY"));
                url = QueryString.setParam(url, "todate", moment(dataDrillDown.DrillDownToDate).format("MM/DD/YYYY"));
                url = QueryString.setParam(url, "excludetest", dataDrillDown.IsExcludedTestData);
                url = QueryString.setParam(url, "CurrencyId", dataDrillDown.DrillDownCurrencyId);
                url = QueryString.setParam(url, "CurrencyName", dataDrillDown.DrillDownCurrencyName);
                url = QueryString.setParam(url, "drawfilter", dataDrillDown.DrawFilter);
                url = QueryString.setParam(url, "custid", dataDrillDown.CustomerId);
                url = QueryString.setParam(url, "systemId", dataDrillDown.SystemId);
                url = QueryString.setParam(url, "externalId", dataDrillDown.ExternalId);
                url = QueryString.setParam(url, "BaseCurrency", dataDrillDown.BaseCurrency);
                url = QueryString.setParam(url, "OriginalCurrenceId", dataDrillDown.CurrencyId);
                url = QueryString.setParam(url, "OriginalCurrencyName", dataDrillDown.CurrencyName);

                url = Site.setProductOptionOriginalParamList(url);

                var popH = Math.min($(window).height() - 100, 650), popW = 920;
                var popupOption = { id: "betlist-popup", width: popW + 50, height: popH + 50, title: "Customer Bet List" };
                Popup.openPopupWithIframe(url, popupOption);
            },

            resizeGrid: function () {
                var reportGrid = $("#ReportGrid");
                jqGridAdditional.updateGridHeight();
                jqGridAdditional.updateGridWidth(reportGrid);
            }
        };

        return _me;
    });
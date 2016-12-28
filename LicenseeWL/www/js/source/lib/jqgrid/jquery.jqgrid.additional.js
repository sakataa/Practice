/// <reference path="/@JSense.js" />
///
define(['jquery', 'common/site', 'lib/bignumber'], function ($, Site, BigNumber) {
    "use strict";
    var jqGridAdditional = (function () {
        return {
            DECIMAL_FORMAT_OPTIONS: {
                decimalSeparator: ".",
                thousandsSeparator: ",",
                decimalPlaces: 2
            },
            updateGridHeight: function () {
                var $bdiv = $(".ui-jqgrid-bdiv");
                if ($bdiv.length === 0) {
                    return;
                }

                var gridTop = $bdiv.offset().top;
                var pagingHeight = $(".paging:visible").length ? $(".paging:visible").height() : 0;
                var footerHeight = $(".ui-jqgrid-sdiv:visible").length ? $(".ui-jqgrid-sdiv:visible").height() : 0;

                var gridHeight = window.innerHeight - gridTop - footerHeight - $(".ui-jqgrid-pager:visible").outerHeight(true) - pagingHeight - 30;
                gridHeight = Math.max(120, gridHeight);

                $bdiv.css("max-height", gridHeight);
            },
            updateGridWidth: function (grid) {
                if ($("div.ui-jqgrid-hbox").length === 0) {
                    return;
                }

                grid.setGridParam({
                    shrinkToFit: false
                });

                var parentWidth = grid.closest(".theme_jqGrid").width();
                grid.jqGrid('setGridWidth', parentWidth);

                var tableWidth = parentWidth - 20;
                grid.css("width", tableWidth + "px");
                $(".theme_jqGrid .ui-jqgrid-hdiv table.ui-jqgrid-htable").css("width", tableWidth + "px");
                $(".theme_jqGrid .ui-jqgrid-sdiv table.ui-jqgrid-ftable").css("width", tableWidth + "px");

                jqGridAdditional.updateFooterWidth(parentWidth);
            },

            updateFooterWidth: function () {
                $(".footer-firstrow").remove();
                var settingWidthRow = $(".ui-jqgrid-bdiv table.ui-jqgrid-btable tr.jqgfirstrow").clone();
                settingWidthRow.addClass("footer-firstrow").removeClass("jqgfirstrow")
                                .prependTo($("tbody", "table.ui-jqgrid-ftable"));
            },

            formatInteger: function (value) {
                /// <summary>
                ///
                /// </summary>
                /// <param name="value"></param>
                /// <returns type=""></returns>
                if (value !== undefined && value !== null) {
                    if (value === "NaN") {
                        return "NaN";
                    }

                    var sRegExp = new RegExp('(-?[0-9]+)([0-9]{3})');
                    var resultValue = value + '';

                    while (sRegExp.test(resultValue)) {
                        resultValue = resultValue.replace(sRegExp, '$1,$2');
                    }

                    return resultValue;
                }
                return value;
            },

            formatDecimal: function (value) {
                if (value !== undefined && value !== null) {
                    if (isNaN(value)) {
                        return "NaN";
                    }

                    return new BigNumber(value.toString()).toFormat(2);
                }

                return value;
            },

            formatLicenseeWl: function (value) {
                var decimalValue = jqGridAdditional.formatDecimal(value);
                return value < 0 ? "<span class='negative-number'>" + decimalValue + "</span>" : decimalValue;
            },

            excludeCol: function (colName, colModel, excludedCol) {
                /// <summary>
                ///
                /// </summary>
                /// <param name="colName"></param>
                /// <param name="colModel"></param>
                /// <param name="excludedCol"></param>
                /// <returns type=""></returns>
                var result =
                {
                    colName: [],
                    colModel: []
                };
                for (var i = 0; i < colModel.length; i++) {
                    if ($.inArray(colModel[i].name, excludedCol) < 0) {
                        result.colName.push(colName[i]);
                        result.colModel.push(colModel[i]);
                    }
                }
                return result;
            },

            setColumnVisible: function (models, colName, visible) {
                for (var i = 0, l = models.length; i < l; i++) {
                    if (models[i].name.toLowerCase() === colName.toLowerCase()) {
                        models[i].hidden = visible;
                        break;
                    }
                }
            },

            setGroupCustomerWLColumns: function (grid) {
                grid.jqGrid('setGroupHeaders',
                {
                    useColSpanStyle: true,
                    groupHeaders: [{
                        startColumnName: 'CustomerWinLoss',
                        numberOfColumns: 3,
                        titleText: Site.getSingleResource('CustomerW_L')
                    }]
                });
                $(".ui-jqgrid-htable>thead>tr.ui-jqgrid-labels > th.ui-th-column div").addClass("header-one-line");
                $(".ui-jqgrid-htable>thead>tr.ui-jqgrid-labels > th.ui-th-column span").css("height", "45px !important");
            },

            resetHeaderHeight: function () {
                $(".ui-jqgrid-htable>thead>tr.ui-jqgrid-labels > th.ui-th-column div").addClass("header-two-line");
            },

            getLicenseeWLNote: function (productOptionJson, caption) {
                var productOptions = $.parseJSON(productOptionJson);
                var temp = caption || Site.getSingleResource("LicenseeW_L");
                var productTemp = "";
                var productAds = ["SB", "LC", "NG", "VS", "CS", "BG", "KN", "BT", "MGCLC", "MGCRNG", "VB"];
                for (var i = 0; i < productOptions.length; i++) {
                    if ($.inArray(productOptions[i].Code, productAds) > -1 && Site.asBool(productOptions[i].Status)) {
                        productTemp += productTemp.length === 0 ? productOptions[i].Code : ", " + productOptions[i].Code;
                    }
                }
                if (productTemp.length > 0) {
                    temp += "(" + productTemp + ")";
                }
                else {
                    return caption || "";
                }

                return temp;
            },

            gridComplete: function () {
                $(".ui-jqgrid-titlebar").hide();
                $(".ui-jqgrid-hdiv").css("clear", "both");

                $('#noInfoRow').remove();
            },

            clearGrid: function (reportId) {
                /// <summary>
                /// clear grid
                /// </summary>
                /// <param name="grid">ReportGrid</param>
                /// <param name="pagingElement">ex:ppdata</param>
                $('#' + reportId).jqGrid('GridUnload');
                //clear all width attribute
                $("div.theme_jqGrid > div").css('width', '');
            },

            rowSpanSetting: function (rowId, val, rawObject) {
                var rowSpan = rawObject.RowSpan, result;
                if (rowSpan > 1) {
                    result = ' rowspan=' + '"' + rowSpan + '"';
                }
                else if (rowSpan < 0) {
                    result = ' style="display:none;" ';
                }
                else {
                    result = '';
                }

                return result;
            },

            rowSpanSetting2: function (rowId, val, rawObject) {
                var rowSpan = rawObject.RowSpan2, result;
                if (rowSpan > 1) {
                    result = ' rowspan=' + '"' + rowSpan + '"';
                }
                else if (rowSpan < 0) {
                    result = ' style="display:none;" ';
                }
                else {
                    result = '';
                }

                return result;
            },

            assignTotal: function (totalData, columnModel) {
                /// <summary>
                /// assing total rows
                /// </summary>
                /// <param name="totalData">total row</param>
                /// <param name="columnModel">the model</param>
                var mainFooter = $(".ui-jqgrid-ftable tr:last-child");

                if (mainFooter.length >= 0) {
                    //add grand total
                    $(totalData).each(function (totalIndex, totalElement) {
                        var row = mainFooter.clone();
                        row.addClass("grandTotal");
                        var cellList = $("td", row);
                        $(columnModel).each(function (cellIndex, modelElement) {
                            var cell = cellList.get(cellIndex);
                            var isCustomFormater = typeof (modelElement.formatter) === "function";
                            var rawValue = totalElement[modelElement.name];
                            var value;
                            if (isCustomFormater) {
                                value = modelElement.formatter(rawValue, modelElement.formatoptions, row);
                            } else {
                                var formatOptions = {};
                                formatOptions[modelElement.formatter] = modelElement.formatoptions;
                                value = $.fn.fmatter(modelElement.formatter, rawValue, formatOptions);
                            }

                            var titleValue = value;
                            if ($.isNumeric(rawValue) && rawValue < 0) {
                                var wrapper = document.createElement('div');
                                wrapper.innerHTML = value;
                                titleValue = wrapper.outerHtml;
                            }
                            $(cell).html(value).attr("title", titleValue);
                        });
                        row.insertBefore(mainFooter);
                    });
                }
            },

            setFooterColumns: function (param, columnNames) {
                /// <summary>
                /// 1.Show/Hide
                /// 2......
                /// </summary>
                /// <param name="param"></param>
                /// <param name="columnNames"></param>
                //#region Show-Hide
                var isShow = "showCol" === param;
                var footers = $("table.ui-jqgrid-ftable tr");
                if (isShow) {
                    $.each(columnNames, function (index, value) {
                        $('td[aria-describedby="' + value + '"]', footers).show();
                    });
                }
                else {
                    $.each(columnNames, function (index, value) {
                        $('td[aria-describedby="' + value + '"]', footers).hide();
                    });
                }
                //#endregion
            },

            setNoInfo: function (message) {
                var noInfoText = message || Site.getSingleResource("NoInfo");
                var htmlNoInfor = '<p id="noInfoRow" class="no-info-row">' + noInfoText + '</p>';
                $('#noInfoRow').remove();
                $('.theme_jqGrid').append(htmlNoInfor);
                $("div.ui-jqgrid-sdiv").hide();
            },

            setNoInfoWithColspan: function (colspan) {
                var mainFooter = $(".ui-jqgrid-ftable");
                var info = Site.getSingleResource("NoInfo");

                if (mainFooter.length > 0) {
                    mainFooter.remove();
                }
                var contentTable = $("table.ui-jqgrid-htable");
                if (contentTable.find(".no-info-row").length === 0) {
                    var temps = '<tr role="row" class="no-info-row  ui-widget-content jqgrow ui-row-ltr" style="height:auto;">' +
                        ' <td style="text-align:center;" role="role="gridcell" colspan="' + colspan + '">' + info + '</td></tr>';
                    contentTable.append(temps);
                }

                $("div.ui-jqgrid-sdiv").hide();
            },

            setGroupFooters: function (colspan, summaryColspan, summaryRowCount, allowScrolling) {
                /// <summary>
                /// set colspan for footer rows
                /// </summary>
                /// <param name="colspan"></param>
                /// <param name="summaryColspan"></param>
                /// <param name="summaryRowCount"></param>

                summaryRowCount = summaryRowCount === undefined ? 0 : summaryRowCount;
                var footerTable = $("table.ui-jqgrid-ftable");
                var footerRowList = $("tr", footerTable);
                var rowCount = footerRowList.length;
                var columnIndex = 0;
                if (rowCount > 0) {
                    // Hide other columns to match the colspan & rowspan
                    var processFooter = function ($td, colspan) {
                        $td.each(function (j, cell) {
                            if (columnIndex < colspan) {
                                if ($(cell).is(":visible")) {
                                    $(cell).hide();
                                    columnIndex++;
                                }
                            }
                        });
                    };

                    for (var i = 0; i < rowCount - summaryRowCount; i++) {
                        columnIndex = 0;
                        processFooter($("td ", footerRowList[i]), colspan);
                    }

                    //#region Render total eur section
                    columnIndex = 0;
                    // Hide other eur columns to match the colspan & rowspan
                    for (var j = rowCount - summaryRowCount; j < rowCount; j++) {
                        columnIndex = 0;
                        processFooter($("td ", footerRowList[j]), summaryColspan);
                    }
                    var totalInText = Site.getSingleResource("Totalin");
                    //#region Render total eur section

                    var totalText = Site.getSingleResource("Total");
                    // Set colspan for total section
                    if (rowCount > 1) {
                        // Show total text
                        $("td:first-child", footerRowList[0]).attr("colspan", colspan)
                                .attr("rowspan", rowCount - summaryRowCount).css("display", "")
                                .css("width", "").html(totalText);
                    }
                    else {
                        $("td:first-child", footerRowList[0]).css("display", "").attr("colspan", summaryColspan)
                            .css("width", "").html(totalInText + " EUR");
                        //remove border style
                        $(".ui-jqgrid-sdiv .ui-jqgrid-hbox").css("border-top", "none");
                    }

                    // If there are many total rows such as total eur, total usd, ...
                    var currencyListString = footerTable.attr("data-total-currency-list");
                    if (currencyListString) {
                        var currencyList = currencyListString.split(",");
                        $(currencyList).each(function (i, currency) {
                            $("td.group-" + currency + ":first-child", footerTable).attr("colspan", colspan)
                                    .attr("rowspan", summaryRowCount / currencyList.length).css("display", "")
                                    .attr("colspan", summaryColspan).html(totalInText + " " + currency);
                            $("td.group-" + currency + ":gt(0)", footerTable).hide();
                            $("td.group-" + currency + ":first-child", footerTable).parent().addClass("total-eur");
                        });
                    } else {
                        if (footerRowList.length > 1) {
                            $(footerRowList[footerRowList.length = 1]).hide();
                        }
                    }
                    /*set scrolling*/
                    if (allowScrolling) {
                        footerTable.parent().css("position", "relative");
                        footerTable.parent().parent().addClass("jqgrid-footer-scroll-hacking");
                    }
                }
            }
        };
    })();

    return jqGridAdditional;
});
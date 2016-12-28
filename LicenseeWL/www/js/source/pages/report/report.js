/*global Site*/
define(["jquery"], function ($) {
    "use strict";
    var Report = (function () {
        return {
            ValidProducts: function () {
                var temp = true;
                if ($(".childCheckbox:checked").length === 0) {
                    temp = false;
                    var title = Site.getSingleResource("LrfNotification");
                    $('<div title="' + title + '">' + Site.getSingleResource("AlertChooseProductMsg") + '</div>').dialog({
                        open: function () {
                            $('#SubmitButton').prop('disabled', true);
                        },
                        close: function () {
                            $('#SubmitButton').removeAttr('disabled');
                        }
                    });
                }

                return temp;
            },
            setOriginalProduct: function () {
                $(".childCheckbox[type='checkbox']", "#ProductList").each(function (index, element) {
                    var isCheck = $(this).is(":checked");
                    $(element).attr({ 'data-original': isCheck });
                });
            },
            bindSummaryTotal: function (columnModel, summaryTotal) {
                /// <summary>
                /// Bind summary total data to footer rows
                /// </summary>
                /// <param name="columnModel"></param>
                /// <param name="summaryTotal"></param>
                /// <returns type="int">Number of iserted row</returns>
                var mainFooter = $(".ui-jqgrid-ftable tr:last-child");
                if (summaryTotal === undefined || summaryTotal == null || summaryTotal.length === 0) {
                    return;
                }

                function processColumnModel(columnModel) {
                    var firstCell = null;
                    $(columnModel).each(function (cellIndex, modelElement) {
                        var cell = cellList.get(cellIndex);
                        var isCustomFormater = typeof (modelElement.formatter) === "function";
                        var rawValue = summaryData[modelElement.name];
                        var value = isCustomFormater ? modelElement.formatter(rawValue, modelElement.formatoptions, row) :
                                    $.fn.fmatter(modelElement.formatter, rawValue, modelElement.formatoptions);
                        var titleValue = value;
                        if ($.isNumeric(rawValue) && rawValue < 0) {
                            var wrapper = document.createElement('div');
                            wrapper.innerHTML = value;
                            titleValue = wrapper.outerHtml;
                        }

                        $(cell).html(value).attr("title", titleValue);
                        firstCell = !firstCell ? $(cell) : firstCell;
                    });

                    return firstCell;
                }

                var rowCount = 0;
                var currencyList = [];
                for (var currency in summaryTotal) {
                    currencyList.push(currency);
                    var summaryData = summaryTotal[currency];

                    var row = mainFooter.clone();
                    row.addClass("total-eur total-eur-none-top-se");
                    var cellList = $("td", row);
                    var firstCell = processColumnModel(columnModel);
                    firstCell.html("Total in " + currency);
                    firstCell.addClass("group-" + currency);
                    row.insertAfter(mainFooter);
                    rowCount++;
                }

                $(".ui-jqgrid-ftable").attr("data-total-currency-list", currencyList.join());
                mainFooter.remove();

                return rowCount;
            }
        };
    })();

    return Report;
});
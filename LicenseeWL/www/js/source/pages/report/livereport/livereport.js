define(
    ["jquery", "common/querystring", "common/site", "common/pluginhelper", "./helper"],
    function ($, QueryString, Site, PluginHelper, Helper) {
        "use strict";

        function initialize() {
            Site.initialize();
            initEvent();
            PluginHelper.initDateRangePicker();
            PluginHelper.initMonthPicker();
            Site.addUserGuide({
                resourceName: "LiveReport",
                title: Site.getSingleResource("LiveReport")
            });
        }

        function initEvent() {
            $("#switchreport").click(function () {
                var mod = $(this).attr("data-history-mode");
                if (mod === "False") {
                    Site.redirect(Site.resolveClientUrl("LiveReport?isViewedHistory=True"));
                }
                else {
                    Site.redirect(Site.resolveClientUrl("LiveReport?isViewedHistory=False"));
                }
            });

            /*back button*/
            /*-affect the action excel*/
            window.onbeforeunload = function () {
                $("ProductCode").val("");
            };
            /**************/
            /*date-range*/

            /*drill down*/
            /* sumary detail*/
            $("body").on("click", ".product-detail-link", function () {
                viewProductDetail(this);
            });
            /* sumary detail*/
            /* detail*/
            $("body").on("click", ".sport-detailt-link", function () {
                viewSportDetail(this);
            });

            $('#exporttoexcel').click(function () {
                $('#IsExportExcel').val(true);
                $('#livereport').submit();
                $('#IsExportExcel').val(false);
            });

            $('#btnSubmit').click(function () {
                Site.blockUI();
                $('#livereport').submit();
            });
        }

        function viewProductDetail(target) {
            var productCode = $(target).attr("data-product-code");
            var data = {
                productCode: productCode,
                FromDate: $("#FromDate").attr('data-original-from').toString("MM/dd/yyyy"),
                ToDate: $("#ToDate").attr('data-original-to').toString("MM/dd/yyyy"),
                BaseCurrency: $("#BaseCurrency").attr('data-original'),
                LiveIndicator: $("#LiveIndicator").attr('data-original')
            };
            data = Site.setLicenseeOptionOriginalParam(data);
            var isSelected = $(target).parent().hasClass("selected");
            if (isSelected) { return; }

            $("a.product-detail-link").parent().removeClass("selected");
            $(target).parent().addClass("selected");

            $.ajax({
                type: "POST",
                data: data,
                dataType: "json",
                url: Site.resolveClientUrl("LiveReport/Detail"),
                success: function () {
                },
                beforeSend: Site.blockUI(),
                complete: function (jqXHR) {
                    if (jqXHR.readyState === 4) {
                        $("#ProductCode").val(data.productCode);
                        $("#detail-content").html(jqXHR.responseText);
                    }
                    Site.unBlockUI();
                }
            });
        }

        function viewBetList(url, totalValue, productOptions) {
            url = Site.setLicenseeOptionOriginalParam(url);
            url = QueryString.setParam(url, "fromdate", $("#FromDate").attr('data-original-from'));
            url = QueryString.setParam(url, "todate", $("#ToDate").attr('data-original-to'));
            url = QueryString.setParam(url, "LiveIndicator", $("#LiveIndicator").attr('data-original'));
            url = Helper.setSumParams(url, totalValue);
            // [Jacob] Cheat for live report mix parlay, must send
            url = QueryString.setParam(url, "showsb", false);
            url = QueryString.setParam(url, "showba", false);
            $(productOptions).each(function (index, element) {
                url = Site.setProductOptionParam(url, index, element.toUpperCase(), true);
                url = QueryString.setParam(url, "show" + element, true);
            });

            Site.blockUI();
            Site.redirect(url);
        }

        function viewSportDetail(target) {
            var data = $(target).attr("data-drill-down");
            var jsonData = $.parseJSON(data);
            var productCode = $("#ProductCode").val();
            var productOptions = Helper.getMatchListProductOption(jsonData.SportId, productCode);
            var urlMap = {
                Key101: "LiveReportBetList/MixParlay?bettype=9",
                Key102: "LiveReportBetList/MixParlay?bettype=29",
                Key103: "LiveReportBetList/Outright",
                Key161: "LiveReportBetList/NumberGame",
                Key151: "LiveReportBetList/Racing?SportType=151",
                Key152: "LiveReportBetList/Racing?SportType=152",
                Key153: "LiveReportBetList/Racing?SportType=153",
                Key181: "LiveReportBetList/Racing?SportType=181",
                Key182: "LiveReportBetList/Racing?SportType=182",
                Key183: "LiveReportBetList/Racing?SportType=183",
                Key184: "LiveReportBetList/Racing?SportType=184",
                Key185: "LiveReportBetList/Racing?SportType=185"
            };

            var url = urlMap["Key" + jsonData.SportId];
            var showBetList = url !== null && url !== undefined;
            url = url === null || url === undefined
                    ? Site.resolveClientUrl("LiveReport/MatchList")
                    : Site.resolveClientUrl(url);
            if (showBetList) {
                viewBetList(url, jsonData.TotalValue, productOptions);
            }
            else {
                // Match List
                url = Site.setLicenseeOptionOriginalParam(url);
                url = QueryString.setParam(url, "SportId", jsonData.SportId);
                url = QueryString.setParam(url, "ProductCode", productCode);
                url = QueryString.setParam(url, "FromDate", $("#FromDate").attr('data-original-from'));
                url = QueryString.setParam(url, "ToDate", $("#ToDate").attr('data-original-to'));
                url = QueryString.setParam(url, "showsb", true);
                url = QueryString.setParam(url, "showba", false);
                url = QueryString.setParam(url, "LiveIndicator", $("#LiveIndicator").attr('data-original'));

                $(productOptions).each(function (index, element) {
                    url = Site.setProductOptionParam(url, index, element, true);
                    url = QueryString.setParam(url, "show" + element, true);
                });

                Site.blockUI();
                Site.redirect(url);
            }
        }

        return {
            initialize: initialize
        };
    }
);
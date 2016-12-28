define(['jquery', 'common/site', 'common/querystring', './betlist'], function ($, Site, QueryString, BetList) {
    "use strict";

    var MAXIMUM_EXCEL_ROWS = 65535;

    var _me = {
        initialize: function () {
            Site.initialize();
            BetList.initialize();
            $(".content-filter").remove();

            var apiUrl = $("#ApiUrl").val();

            apiUrl = Site.resolveClientUrl(apiUrl);
            var serverPaging = $("#IsServerPaging").val();
            if (serverPaging === "1") {
                var paramString = QueryString.getQueryString(Site.getCurrentUrl());
                BetList.loadDataPaging(apiUrl + "?" + paramString);
            }
            else {
                var params = $.parseJSON($("#BetListMetaModel").val());

                // Update datetime because js-engine parser jsonDatetime wrongly
                params.FromDate = params.FromDateString;
                params.ToDate = params.ToDateString;
                params.Date = params.DateString;
                BetList.loadData(params, apiUrl);
            }

            $("#ExportToExcel").click(_me.exportToExcel);
        },
        exportToExcel: function () {
            var $grid = $('#BetListGrid');
            if ($("#IsExportAll").val() === "1") {
                var totalRows = $grid.jqGrid('getGridParam', 'records');
                if (totalRows > MAXIMUM_EXCEL_ROWS) {
                    alert(Site.getSingleResource('ExcelExceedRowsMsg'));
                    return;
                }
            }

            var url = Site.getCurrentUrl();
            var page = $grid.getGridParam('page');
            var size = $grid.getGridParam('rowNum');

            var serverPaging = $("#IsServerPaging").val();
            if (serverPaging === "1") {
                url = QueryString.setParam(url, "PageIndex", page);
                url = QueryString.setParam(url, "PageSize", size);
                url = QueryString.setParam(url, "IsServerPaging", true);
            }

            var sortParams = BetList.getSortParams();
            if (sortParams) {
                url = QueryString.setParam(url, "SortBy", sortParams.SortBy);
                url = QueryString.setParam(url, "SortOrder", sortParams.SortOrder);
            }

            url = QueryString.setParam(url, "IsExportExcel", true);
            Site.redirect(url);
        }
    };

    return _me;
});

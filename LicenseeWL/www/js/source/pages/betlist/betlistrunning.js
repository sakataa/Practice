"use strict";
define(
    ['jquery', 'common/site', 'common/querystring', './betlist'],
    function ($, Site, QueryString, BetList) {

        var _me = {
            initialize: function () {
                _me.initEvent();
                _me.submit();
                Site.addUserGuide({
                    resourceName: $('#userGuideName').val(),
                    title: Site.getSingleResource("TotalBets") + " - " + $('#title').val()
                });
            },

            initEvent: function () {
                $('#SubmitButton').click(function () {
                    _me.submit();
                });
                $("#ExportToExcel").click(function () {
                    var url = Site.getCurrentUrl();
                    url = Site.setLicenseeOptionParam(url);
                    url = QueryString.setParam(url, "IsExportExcel", true);
                    var sortParams = BetList.getSortParams();
                    if (sortParams) {
                        url = QueryString.setParam(url, "SortBy", sortParams.SortBy);
                        url = QueryString.setParam(url, "SortOrder", sortParams.SortOrder);
                    }
                    Site.redirect(url);
                });
            },

            submit: function () {
                BetList.initialize();
                var actionName = Site.getLocation().pathname.split('/').pop();
                var url = Site.resolveClientUrl('api/RunningBetList/' + actionName);
                var params = Site.setLicenseeOptionParam();

                BetList.loadData(params, url);
            }
        };

        return _me;
    });
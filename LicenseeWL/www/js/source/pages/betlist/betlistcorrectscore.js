"use strict";
define(
    ['jquery', 'common/site', 'common/querystring', './betlist'],
    function ($, Site, QueryString, BetList) {
        var _me = {
            initialize: function () {
                _me.initEvent();
                _me.submit();
                Site.addUserGuide({
                    resourceName: "TotalBetsCorrectScore",
                    title: Site.getSingleResource("TotalBets") + " - " + Site.getSingleResource("CorrectScore")
                });
            },

            initEvent: function () {
                $('#SubmitButton').click(function () {
                    _me.submit();
                });

                $('#ExportToExcel').click(function () {
                    $('#CorrectScoreBetListForm').submit();
                });
            },

            submit: function () {
                // Site.blockUI();
                BetList.initialize();
                var params = {};
                params = Site.setLicenseeOptionParam(params);
                var url = Site.resolveClientUrl('api/CorrectScoreBetList/Index');
                BetList.loadData(params, url);
            }
        };

        return _me;
    });
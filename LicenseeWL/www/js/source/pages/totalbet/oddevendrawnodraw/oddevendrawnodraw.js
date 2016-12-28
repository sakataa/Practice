﻿define(['jquery', 'common/site', '../totalbetsbase', 'common/popup', 'components/refreshcountdown'], function ($, Site, Totalbets, Popup, RefreshCountDown) {
    "use strict";

    var _me = {
        initialize: function () {
            Site.initialize();
            Totalbets.initialize();
            _me.initEvent();
            Site.addUserGuide({
                resourceName: "TotalBetsOddEven",
                title: Site.getSingleResource("TotalBets") + " - " + Site.getSingleResource("OddEvenDND")
            });

            RefreshCountDown.initEvent();
        },
        initEvent: function () {
            $("#SubmitButton").on("click", function () {
                _me.submit();
            });

            $("#reportContent").on("click", '.button-add', function () {
                var matchId = $(this).attr("data-match-id");
                var betType = $(this).attr("data-bet-type");
                _me.viewForecast1X2(matchId, betType);
            });
        },
        viewForecast1X2: function (matchId, betType) {
            var url = Site.resolveClientUrl("OneXTwoForecast/Popup?matchid=" + matchId + '&bettype=' + betType + '&ispopup=true');
            url = Site.setLicenseeOptionOriginalParam(url);

            var popH = Math.min(window.innerHeight - 100, 600), popW = 700;
            var title = Site.getSingleResource("Forecast") + " - " + Site.getSingleResource("OneXTwo");

            Popup.openPopupWithIframe(url, { width: popW, height: popH, title: title, id: "forecast-dialog" });
        },
        submit: function () {
            Site.blockUI();
            $("#OddEvenDrawNoDrawForm").submit();
        }
    };

    return _me;
});
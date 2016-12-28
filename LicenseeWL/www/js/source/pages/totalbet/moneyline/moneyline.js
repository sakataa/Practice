define(['jquery', 'common/site', '../totalbetsbase', 'components/refreshcountdown'], function ($, Site, Totalbets, RefreshCountDown) {
    "use strict";

    var _me = {
        initialize: function () {
            Site.initialize();
            Totalbets.initialize();
            _me.initEvent();
            Site.addUserGuide({
                resourceName: "TotalBetsMoneyLine",
                title: Site.getSingleResource("TotalBets") + " - " + Site.getSingleResource("MoneyLine")
            });

            RefreshCountDown.initEvent();
        },
        initEvent: function () {
            $("#SubmitButton").on("click", function () {
                _me.submit();
            });
        },
        submit: function () {
            Site.blockUI();
            $("#MoneyLineForm").submit();
        }
    };

    return _me;
});
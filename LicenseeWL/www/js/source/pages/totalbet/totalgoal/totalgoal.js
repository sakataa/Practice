define(['jquery', 'common/site', '../totalbetsbase', 'components/refreshcountdown'], function ($, Site, Totalbets, RefreshCountDown) {
    "use strict";

    var _me = {
        initialize: function () {
            Site.initialize();
            Totalbets.initialize();
            _me.initEvent();
            Site.addUserGuide({
                resourceName: "TotalBetsTotalGoal",
                title: Site.getSingleResource("TotalBets") + " - " + Site.getSingleResource("TotalGoal")
            });

            RefreshCountDown.initEvent();
        },
        initEvent: function () {
            var totalGoalBettype = 6, firstHalfTotalGoal = 126;
            var bettypeParameter = totalGoalBettype + "," + firstHalfTotalGoal;

            $("#SubmitButton").on("click", function () {
                _me.submit();
            });

            $('#reportContent').on('click', '.team', function () {
                var matchId = $(this).attr("data-match-id");
                Totalbets.viewRunningBetListMultiBettype(matchId, bettypeParameter);
            });
        },
        submit: function () {
            Site.blockUI();
            $("#TotalGoalForm").submit();
        }
    };

    return _me;
});
﻿define(['jquery', 'common/site', '../totalbetsbase', 'components/refreshcountdown'], function ($, Site, Totalbets, RefreshCountDown) {
    "use strict";

    var _me = {
        initialize: function () {
            Site.initialize();
            Totalbets.initialize();
            _me.initEvent();
            Site.addUserGuide({
                resourceName: "TotalBetsFGLG",
                title: Site.getSingleResource("TotalBets") + " - " + Site.getSingleResource("FGLG")
            });

            RefreshCountDown.initEvent();
        },
        initEvent: function () {
            var firstGoalLastGoal = 14, firstHalfFirsGoalLastGoal = 127;
            var bettypeParameter = firstGoalLastGoal + "," + firstHalfFirsGoalLastGoal;

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
            $("#FirstGoalLastGoalForm").submit();
        }
    };

    return _me;
});
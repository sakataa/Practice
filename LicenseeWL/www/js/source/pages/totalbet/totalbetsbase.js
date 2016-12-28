define(['jquery', 'common/site', 'common/querystring', 'components/refreshcountdown', 'extensions/jquery.extension'], function ($, Site, QueryString, RefreshCountDown) {
    var _me = {
        resizeGrid: function () {
            var $grid = $(".body-content");
            if ($grid.length === 0) {
                return;
            }

            var gridTop = $grid.offset().top;

            var gridHeight = window.innerHeight - gridTop - $(".footer-content").height() - 25;
            gridHeight = Math.max(150, gridHeight);
            $grid.css("max-height", gridHeight);

            if (!$grid.hasVerticalScrollBar()) {
                $grid.addClass("hasScroll");
            }
            else {
                $grid.find("table").width($grid.width() - 17);
            }
        },
        initEvent: function () {
            RefreshCountDown.initialize();

            $("#reportContent").on("click", '.forcast-number', function () {
                var matchId = $(this).attr("data-match-id");
                var betType = $(this).attr("data-bet-type");
                _me.viewRunningBetListMatch(matchId, betType);
            });

            $(document).ajaxComplete(function () {
                _me.resizeGrid();
            });

            $(window).on("resize", function () {
                _me.resizeGrid();
            });

            $(window).on("unload", function () {
                $(window).off("resize");
            });
        },
        viewRunningBetListMatch: function (matchId, betType) {
            var url = Site.resolveClientUrl("RunningMatchBetList/Index");
            url = Site.setLicenseeOptionOriginalParam(url);
            url = QueryString.setParam(url, "matchid", matchId);
            url = QueryString.setParam(url, "bettype", betType);
            url = QueryString.setParam(url, "isShowSumStake", true);

            Site.redirect(url);
        },
        viewRunningBetListMultiBettype: function (matchId, betType) {
            var url = Site.resolveClientUrl("RunningBettypesOfMatchBetList/Index");
            url = Site.setLicenseeOptionOriginalParam(url);
            url = QueryString.setParam(url, "matchid", matchId);
            url = QueryString.setParam(url, "multiplebettype", betType);
            url = QueryString.setParam(url, "isShowSumStake", true);

            Site.redirect(url);
        },

        initialize: function () {
            _me.initEvent();
            _me.resizeGrid();
            Site.unBlockUI();
        }
    };

    return _me;
});
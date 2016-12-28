define(['jquery', 'common/site', 'common/querystring', 'lib/jquery.cookie'], function ($, Site, QueryString) {
    var curCountDown = 0;
    var countDownTimer = null;
    var cookieName = null;
    var countDownId = null;
    var defaultCountDown = 0;

    var _me = {
        initialize: function () {
            $('.menu-item').on('click', function () {
                var selectedCountDown = parseInt($(this).attr('data-count-down'));
                _me.setCountDown(selectedCountDown, true);
            });

            $('.button-refresh').on('click', function () {
                _me.refresh();
            });

            var $hiddenCountdown = $('#count-down-of');
            countDownId = $hiddenCountdown.attr('name');

            // Get default count down
            defaultCountDown = parseInt($hiddenCountdown.attr('data-default-value'));
        },
        initEvent: function () {
            cookieName = "RefeshCountDown" + countDownId;
            //read countdown from cookie
            var countDownFromCookie = $.cookie(cookieName);
            if (countDownFromCookie && Number(countDownFromCookie) !== 0) {
                _me.setCountDown(countDownFromCookie, false);
            } else {
                _me.setCountDown(defaultCountDown, true);
            }
        },
        setCountDown: function (countDown, isSetToCookie) {
            var countDownInt = parseInt(countDown);
            if (isSetToCookie) {
                $.cookie(cookieName, countDownInt);
            }
            curCountDown = countDownInt;
            _me.setMenuStatus();
            _me.tick();
        },
        setMenuStatus: function () {
            var index = curCountDown;
            $('#countdown-menu .menu-item').removeClass('menu-selected');
            $('#option-' + index).addClass('menu-selected');
        },
        tick: function () {
            document.getElementById('count').innerHTML = curCountDown;
            curCountDown--;
            if (countDownTimer !== null) {
                clearTimeout(countDownTimer);
            }
            countDownTimer = setTimeout(_me.tick, 1000);
            if (curCountDown < -1) {
                _me.refresh();
            }
        },
        refresh: function () {
            var oldScrollTop;
            if ($(".body-content").length) {
                oldScrollTop = $(".body-content").scrollTop();
            }

            if (countDownTimer !== null) {
                clearTimeout(countDownTimer);
            }
            document.getElementById('count').innerHTML = "...";

            // Get param before load data
            var url = _me.calculateUrl();

            // Set up ajax no cache
            $.ajaxSetup({ cache: false });

            Site.blockUI();
            $('#reportContent').load(url, {
                noncache: new Date().getTime()
            }, function () {
                Site.unBlockUI();
                _me.initEvent();
                
                // Currency constraint
                Site.currencyConstraint();

                $(window).resize();

                // Scrollbar still kept current position
                if ($(".body-content").length) {
                    $(".body-content").scrollTop(oldScrollTop);
                }
            });

            return true;
        },
        calculateUrl: function () {
            var leagueId = $('#LeagueId').val();
            var matchId = $('#MatchId').val();
            var betType = $("#BetType").val();
            var currentScore = $("#CurrentScore").val();
            var isShowFt = $("#IsShowFt").val();
            var isShowFh = $("#IsShowFh").val();
            var homeName = $("#HomeTeamId").val();
            var awayName = $("#AwayTeamId").val();

            var url = Site.getCurrentUrl();
            url = Site.setLicenseeOptionOriginalParam(url);
            url = QueryString.setParam(url, "LeagueId", leagueId);
            url = QueryString.setParam(url, "MatchId", matchId);
            url = QueryString.setParam(url, "BetType", betType);
            url = QueryString.setParam(url, "CurrentScore", currentScore);
            url = QueryString.setParam(url, "IsShowFt", isShowFt);
            url = QueryString.setParam(url, "IsShowFh", isShowFh);

            url = QueryString.setParam(url, "HomeTeamId", homeName);
            url = QueryString.setParam(url, "AwayTeamId", awayName);

            return url;
        }
    };

    return _me;
});
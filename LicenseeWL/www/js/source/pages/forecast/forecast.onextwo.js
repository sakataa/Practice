define(['jquery', 'common/site', 'common/querystring', 'components/refreshcountdown', 'common/popup', 'extensions/jquery.extension'], function ($, Site, QueryString, RefreshCountDown, Popup) {
	"use strict";

	var _isPopup;

	var _me = {
		resizeGrid: function () {
			var $grid = $(".body-content");
			if ($grid.length === 0) {
				return;
			}

			var gridTop = $grid.offset().top;
			var gridHeight = window.innerHeight - gridTop - 25;
			gridHeight = Math.max(150, gridHeight);
			$grid.css("max-height", gridHeight);

			if (!$grid.hasVerticalScrollBar()) {
			    $grid.addClass("hasScroll");
			}
			else {
			    $grid.find("table").width($grid.width() - 17);
			}
		},
		initialize: function () {
		    Site.initialize();

		    _isPopup = $('#IsPopUp').val() === "true";
		    if (_isPopup) {
		        $("body").css("background", "#fff");
		        _me.resizePopup();
		    }

			_me.initEvent();
			_me.resizeGrid();
			Site.addUserGuide({
				resourceName: "Forecast1x2",
				title: Site.getSingleResource("Forecast") + " - " + Site.getSingleResource("OneXTwo")
			});

			RefreshCountDown.initialize();
			RefreshCountDown.initEvent();

			Site.unBlockUI();
		},
		initEvent: function () {
			$('.league-list').on('change', function () {
			    _me.submit();
			});

			$('#reportContent').on('click', '.button-add', function () {
				var matchId = $(this).attr('data-match-id');
				var betType = parseInt($(this).attr('data-bettype'));
				_me.openForecast(matchId, betType);
			});

			$('#SubmitButton').on('click', function () {
				_me.submit();
			});

			$(window).on("resize", function () {
			    _me.resizeGrid();
			});

			$(window).on("unload", function () {
			    $(window).off("resize");
			});
		},
		openForecast: function (matchId, betType) {
			var url = Site.resolveClientUrl("RunningMatchBetList/Index");

			if (_isPopup) {
			    url = _me.getBetListUrl(url, matchId, betType);
				var popH = Math.min(parent.innerHeight - 100, 650), popW = 900;
				Popup.updateCurrentPopup(url, { width: popW, height: popH, title: Site.getSingleResource("BetList") });
			} else {
			    url = Site.setLicenseeOptionOriginalParam(url);
			    url = QueryString.setParam(url, "matchid", matchId);
			    url = QueryString.setParam(url, "bettype", betType);
				Site.redirect(url);
			}
		},
		getBetListUrl: function (url, matchId, betType) {
		    var licenseeType = $("#LicenseeType-Hidden").val();
		    var currencyId = $("#CurrencyId-Hidden").val();
		    var baseCurrency = $("#BaseCurrency-Hidden").val();

		    url = QueryString.setParam(url, "LicenseeType", licenseeType);
		    url = QueryString.setParam(url, "CurrencyId", currencyId);
		    url = QueryString.setParam(url, "BaseCurrency", baseCurrency);
		    url = QueryString.setParam(url, "matchid", matchId);
		    url = QueryString.setParam(url, "bettype", betType);

		    return url;
		},
		submit: function () {
			Site.blockUI();
			$("#ForecastOneXTwoForm").submit();
		},
		resizePopup: function () {
		    var popH = Math.min(parent.innerHeight - 100, 600), popW = 700;
		    var title = Site.getSingleResource("Forecast") + " - " + Site.getSingleResource("OneXTwo");
		    Popup.updateCurrentPopup(null, { width: popW, height: popH, title: title });
		}
	};

	return _me;
});
define(["jquery", "common/site", "moment", "bootstrap-daterangepicker", "lib/jquery.monthpicker"],
    function ($, Site, moment) {
        "use strict";

    var _historyDate = new Date($("#HistoryDate").val());

    function initDateRangePicker() {
        var $dateRange = $('#DateRange');

        var $from = $('#FromDate');
        var $to = $('#ToDate');
        var start = moment($from.attr('data-original-from'), "MM/DD/YYYY");
        var end = moment($to.attr('data-original-to'), "MM/DD/YYYY");

        function setRangeDate(start, end) {
            $from.val(start.format('MM/DD/YYYY'));
            $to.val(end.format('MM/DD/YYYY'));
            $dateRange.val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
        }

        var now = moment($dateRange.attr('data-today'), "MM/DD/YYYY");

        var ranges = {};
        ranges[Site.getSingleResource('Today')] = [now, now];
        ranges[Site.getSingleResource('Yesterday')] = [now.clone().subtract(1, 'days'), now.clone().subtract(1, 'days')];
        ranges[Site.getSingleResource('Currentweek')] = [now.clone().startOf('week'), now];
        ranges[Site.getSingleResource('Lastweek')] = [now.clone().subtract(1, 'week').startOf('week'), now.clone().subtract(1, 'week').endOf('week')];
        ranges[Site.getSingleResource('Currentmonth')] = [now.clone().startOf('month'), now];
        ranges[Site.getSingleResource('Lastmonth')] = [now.clone().subtract(1, 'month').startOf('month'), now.clone().subtract(1, 'month').endOf('month')];
        ranges[Site.getSingleResource('Sincelastmonth')] = [now.clone().subtract(1, 'month').startOf('month'), now];

        var daysOfWeek = [
            Site.getSingleResource('Su'), Site.getSingleResource('Mo'), Site.getSingleResource('Tu'), Site.getSingleResource('We'),
            Site.getSingleResource('Th'), Site.getSingleResource('Fr'), Site.getSingleResource('Sa')
        ];

        var monthNames = [
            Site.getSingleResource('Jan'), Site.getSingleResource('Feb'), Site.getSingleResource('Mar'), Site.getSingleResource('Apr'),
            Site.getSingleResource('May'), Site.getSingleResource('Jun'), Site.getSingleResource('Jul'), Site.getSingleResource('Aug'),
            Site.getSingleResource('Sep'), Site.getSingleResource('Oct'), Site.getSingleResource('Nov'), Site.getSingleResource('Dec')
        ];

        var locale = {
            format: 'MM/DD/YYYY',
            applyLabel: Site.getSingleResource('OK'),
            cancelLabel: Site.getSingleResource('Cancel'),
            customRangeLabel: Site.getSingleResource('DateRange'),
            daysOfWeek: daysOfWeek,
            monthNames: monthNames
        };

        $dateRange.daterangepicker({
            startDate: start,
            endDate: end,
            minDate: moment($dateRange.attr('data-mindate'), "MM/DD/YYYY"),
            maxDate: moment($dateRange.attr('data-maxdate'), "MM/DD/YYYY"),
            ranges: ranges,
            locale: locale,
            showDropdowns: true,
            linkedCalendars: false,
            alwaysShowCalendars: true
        }, setRangeDate);

        $dateRange.on('apply.daterangepicker', function (ev, picker) {
            setRangeDate(picker.startDate, picker.endDate);
        });

        $('.date-range').on("click", ".icon-calendar", function () {
            $dateRange.data('daterangepicker').toggle();
        });

        setRangeDate(start, end);
    }

    function initMonthPicker() {
        var fromdate = new Date($('#FromDate').val());
        var todate = new Date($('#ToDate').val());

        $('#month-picker').monPickr({
            minDate: _historyDate,
            showDateRange: true,
            fromDayId: 'fDay',
            toDayId: 'tDay',
            format: 'MM/dd/yyyy',
            month: fromdate,
            fromDay: fromdate.getDate(),
            toDay: todate.getDate(),
            afterChangeMonth: function () {
                $('#FromDate').val($("#month-picker").monPickr("getFromDate", "MM/dd/yyyy"));
                $('#ToDate').val($("#month-picker").monPickr("getToDate", "MM/dd/yyyy"));
            },
            afterChangeDay: function () {
                $('#FromDate').val($("#month-picker").monPickr("getFromDate", "MM/dd/yyyy"));
                $('#ToDate').val($("#month-picker").monPickr("getToDate", "MM/dd/yyyy"));
            }
        });
    }

    return {
        initDateRangePicker: initDateRangePicker,
        initMonthPicker: initMonthPicker
    };
});
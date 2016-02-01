/* global Namespace, ONEbook */

'use strict';
$(document).ready(function () {
    var ipPage = new ONEbook.Site.IP();
    ipPage.Initialize();
});

Namespace.Register('ONEbook.Site.IP');
ONEbook.Site.IP = function () {
    var me = this;
    var cachedDOM = {
        gridIDWhiteList: null,
        iconStatus: null,
        listStatus: null,
        countryList: null
    };

    // Cache DOM elements for later uses.
    var cacheElements = function () {
        cachedDOM.gridIDWhiteList = $("#gridId");
        cachedDOM.iconStatus = $(".icon-status");
        cachedDOM.listStatus = $(".list-status");
        cachedDOM.countryList = $('#country-list');
    };

    // Initialize the date range.
    var initializeDataGridWhiteList = function () {

        var gridOptions =
        { customizeHeader: true,
            groupHeaderRows: [
                 {
                     Columns: [
                            { HeaderText: "Group Name", Name: "Text1", MergeRowNumber: 2 },
                            { HeaderText: "Group ID", Name: "No", MergeRowNumber: 2 },
                            { HeaderText: "Sites", Name: "Number1", MergeRowNumber: 2 },
                            { HeaderText: "Default Group", Name: "Text2", MergeRowNumber: 2 },
                            { HeaderText: "No. of Member", Name: "Number2", MergeRowNumber: 2 },
                            { HeaderText: "Group Color", Name: "Color", MergeRowNumber: 2 },
                            { HeaderText: "Commission (%)", Name: "Number3", MergeColNumber: 4 },
                            { HeaderText: "Delete", Name: "Del", MergeRowNumber: 2 },
                        ]
                 }
        ],
            columns: [
                { HeaderText: "Group Name", Width: 190, Name: "Text1", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "Group ID", Width: 70, Name: "No", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Sites", Width: 140, Name: "Number1", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Default Group", Width: 90, Name: "Text2", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "No. of Member", Width: 100, Name: "Number2", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Group Color", Width: 110, Name: "Color", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "SB", Width: 90, Name: "Number3", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "NG", Width: 90, Name: "Number4", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "LC", Width: 90, Name: "Number5", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "CS", Width: 90, Name: "Number6", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "CS", Width: 90, Name: "Del", HeaderAlign: "center", CellAlign: "center" },
            ],
            bodyRows: generateData(100),
            headerColumnHeight: 30,
            gridExpandHeight: 230,
            bodyRowHeight: 30,
            numberOfFrozenColumn: 3,
            showPager: true,
            customPager: true,
            marginRight: 0,
            pagerOption: {
                itemsPerPage: 50,
                currentPage: 0,
                totalItem: 1000,
                itemsPerPageArray: [50, 100, 500]
            }
        };

        cachedDOM.gridIDWhiteList.fanexGrid(gridOptions);
    };

    var generateData = function (numberRows) {
        var rows = [],
            listStatus = "<ul class='list-status dropdown-menu'> <li class='row_none'>0</li>"
                          + "<li class='row_1'>1</li>" + "<li class='row_2'>2</li>" + "<li class='row_3'>3</li>" + "<li class='row_4'>4</li>" + "<li class='row_5'>5</li>"
                          + "<li class='row_6'>6</li>" + "<li class='row_7'>7</li>" + "<li class='row_8'>8</li>" + "<li class='row_9'>9</li>" + "<li class='row_10'>10</li></ul>";
        rows.push({
            Columns: [
                        { Name: "Text1", Value: "Commission Smart Punter <a href='#' class='mdi-editor-border-color icon-edit' data-toggle='modal' data-target='#editComm'></a>" },
                        { Name: "No", Value: "1001" },
                        { Name: "Number1", Value: "<a href='#' class='link-site'>12Bet</a>" },
                        { Name: "Text2", Value: "<div class='check'>Check</div>" },
                        { Name: "Number2", Value: "<a href='#' class='number'>1000</a>" },
                        { Name: "Color", Value: "<div class='icon_color box-level4'>4</div> <a class='mdi-action-flip-to-front icon-status' data-toggle='dropdown' tabindex='0' href='#'></a>" + listStatus },
                        { Name: "Number3", Value: "14.95%" },
                        { Name: "Number4", Value: "2.20%" },
                        { Name: "Number5", Value: "1.05%" },
                        { Name: "Number6", Value: "0.10%" },
                        { Name: "Del", Value: "<a href='#' class='mdi-action-delete icon-delete' data-toggle='modal' data-target='#deleteComm'></a>" },
                    ],
            CssClass: '',
            CustomAttr: '',
            SubRows: ''
        });
      
        for (var index = 1; index < 10; index++) {
            rows.push(
                {
                    Columns: [
                        { Name: "Text1", Value: "Commission Group 2 <a href='#' class='mdi-editor-border-color icon-edit' data-toggle='modal' data-target='#editComm'></a>" },
                        { Name: "No", Value: "1001" },
                        { Name: "Number1", Value: "<a href='#' class='link-site'>12Bet</a>" },
                        { Name: "Text2", Value: "" },
                        { Name: "Number2", Value: "<a href='#' class='number'>1000</a>" },
                        { Name: "Color", Value: "<div class='icon_color box-level4'>4</div><a class='mdi-action-flip-to-front icon-status' data-toggle='dropdown' tabindex='0' href='#'></a>" + listStatus },
                        { Name: "Number3", Value: "10.95%" },
                        { Name: "Number4", Value: "2.08%" },
                        { Name: "Number5", Value: "1.01%" },
                        { Name: "Number6", Value: "0.19%" },
                        { Name: "Del", Value: "<a href='#' class='mdi-action-delete icon-delete' data-toggle='modal' data-target='#deleteComm'></a>" },
                    ],
                    CssClass: '',
                    CustomAttr: '',
                    SubRows: ''
                }
            );
        }
        rows.push({
            Columns: [
                    { Name: "Text1", Value: "Commission Group 3 <a href='#' class='mdi-editor-border-color icon-edit' data-toggle='modal' data-target='#editComm'></a>" },
                    { Name: "No", Value: "1001" },
                    { Name: "Number1", Value: "<a href='#' class='link-site'>12Bet</a>" },
                    { Name: "Text2", Value: "<div class='check'>Check</div>" },
                    { Name: "Number2", Value: "<a href='#' class='number'>1000</a>" },
                    { Name: "Color", Value: "<div class='icon_color box-level4'>4</div> <a class='mdi-action-flip-to-front icon-status' data-toggle='dropdown' tabindex='0' href='#'></a>" + listStatus },
                    { Name: "Number3", Value: "14.95%" },
                    { Name: "Number4", Value: "3.00%" },
                    { Name: "Number5", Value: "1.00%" },
                    { Name: "Number6", Value: "0.00%" },
                    { Name: "Del", Value: "<a href='#' class='mdi-action-delete icon-delete' data-toggle='modal' data-target='#deleteComm'></a>" },
                ],
            CssClass: '',
            CustomAttr: '',
            SubRows: ''
        });
        for (var index = 11; index < 20; index++) {
            rows.push(
                {
                    Columns: [
                        { Name: "Text1", Value: "Commission Group 4 <a href='#' class='mdi-editor-border-color icon-edit' data-toggle='modal' data-target='#editComm'></a>" },
                        { Name: "No", Value: "1001" },
                        { Name: "Number1", Value: "<a href='#' class='link-site'>12Bet12</a>" },
                        { Name: "Text2", Value: "" },
                        { Name: "Number2", Value: "<a href='#' class='number'>1000</a>" },
                        { Name: "Color", Value: "<div class='icon_color box-level4'>4</div> <a class='mdi-action-flip-to-front icon-status' data-toggle='dropdown' tabindex='0' href='#'></a>" + listStatus },
                        { Name: "Number3", Value: "14.95%" },
                        { Name: "Number4", Value: "3.00%" },
                        { Name: "Number5", Value: "1.00%" },
                        { Name: "Number6", Value: "0.00%" },
                        { Name: "Del", Value: "<a href='#' class='mdi-action-delete icon-delete' data-toggle='modal' data-target='#deleteComm'></a>" },
                    ],
                    CssClass: '',
                    CustomAttr: '',
                    SubRows: ''
                }
            );
        }
        return rows;
    }

    var showContextMenu = function () {
        $(".icon-context").on('click', function () {
            var $this = $(this);
            if ($this.hasClass('active')) {
                $this.removeClass('active');
                $this.find('.context-menu').slideToggle('fast');
            } else {
                $this.addClass('active');
                cachedDOM.listStatus.hide();
                $this.find('.context-menu').slideToggle('fast');
            }
        });
    };

    var loadScrollbar = function () {
        cachedDOM.countryList.slimScroll({
            height: '100px',
            width: '235px',
            size: '8px',
            position: 'right',
            color: '#ccc',
            railColor: '#f5f5f5',
            railOpacity: 0.2,
            wheelStep: 20
        });
    };

    me.Initialize = function () {
        cacheElements();
        initializeDataGridWhiteList();
        showContextMenu();
        loadScrollbar();
    };
};
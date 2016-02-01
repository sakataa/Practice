/* global Namespace, ONEbook */

'use strict';
$(document).ready(function () {
    var manageSitePage = new ONEbook.Site.ManageSite();
    manageSitePage.Initialize();
});

Namespace.Register('ONEbook.Site.ManageSite');
ONEbook.Site.ManageSite = function () {
    var me = this;
    var cachedDOM = {
        gridID: null,
        iconStatus: null,
        listStatus: null
    };

    // Cache DOM elements for later uses.
    var cacheElements = function () {
        cachedDOM.gridID = $("#gridId");
        cachedDOM.iconStatus = $(".icon-status");
        cachedDOM.listStatus = $(".list-status");
    };

    // Initialize the date range.
    var initializeDataGrid = function () {

        var gridOptions =
        {
            customizeHeader: true,
            groupHeaderRows: [
                {
                    Columns: [
                        { HeaderText: "Username", Name: "Username", MergeRowNumber: 2 },
                        { HeaderText: "System ID", Name: "SystemId", MergeRowNumber: 2 },
                        { HeaderText: "Site Name", Name: "SiteName", MergeRowNumber: 2 },
                        { HeaderText: "Currency", Name: "Currency", MergeRowNumber: 2 },
                        { HeaderText: "Status", Name: "Status", MergeRowNumber: 2 },
                        { HeaderText: "BA Status", Name: "BAStatus", MergeRowNumber: 2 },
                        { HeaderText: "Special Level", Name: "SpecialLevel", MergeRowNumber: 2 },
                        { HeaderText: "Odds Spread Group", Name: "OddGroup", MergeRowNumber: 2 },
                        { HeaderText: "Current Balance", Name: "CurrentBalance", MergeRowNumber: 2 },
                        { HeaderText: "Outstanding Stakes", Name: "OutstandingStakes", MergeRowNumber: 2 },
                        { HeaderText: "Comm Group", Name: "CommGroup", MergeRowNumber: 2 },
                        { HeaderText: "Commission (%)", Name: "Commission", MergeColNumber: 4 },
                        { HeaderText: "History", Name: "History", MergeRowNumber: 2 },
                    ]
                }
            ],
            columns: [
                { HeaderText: "Username", Width: 150, Name: "Username", HeaderAlign: "center", CellAlign: "left" },
                { HeaderText: "System ID", Width: 100, Name: "SystemId", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Site Name", Width: 100, Name: "SiteName", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Currency", Width: 100, Name: "Currency", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Status", Width: 80, Name: "Status", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "BA Status", Width: 80, Name: "BAStatus", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Special Level", Width: 80, Name: "SpecialLevel", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Odds Spread Group", Width: 100, Name: "OddGroup", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Current Balance", Width: 90, Name: "CurrentBalance", HeaderAlign: "center", CellAlign: "right" },
                { HeaderText: "Outstanding Stakes", Width: 100, Name: "OutstandingStakes", HeaderAlign: "center", CellAlign: "right" },
                { HeaderText: "Comm Group", Width: 50, Name: "CommGroup", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "SB", Width: 60, Name: "Commission", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "NG", Width: 60, Name: "NG", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "LC", Width: 60, Name: "LC", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "CS", Width: 60, Name: "CS", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "History", Width: 100, Name: "History", HeaderAlign: "center", CellAlign: "center" }
            ],
            bodyRows: generateData(20),
            headerColumnHeight: 24,
            gridExpandHeight: 300,
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

        cachedDOM.gridID.fanexGrid(gridOptions);
    };

    var generateData = function (numberRows) {
        var rows = [],
             listStatus = "<ul class='list-status dropdown-menu'>" +
                            "<li><a href='#' class='btn btn-link'>Open</a></li>" +
                            "<li><a href='#' class='btn btn-link'>Close</a></li>" +
                        "</ul>",
             listLevel = "<ul class='list-status dropdown-menu '> <li class='row_none'>0</li>"
                          + "<li class='row_1'>1</li>" + "<li class='row_2'>2</li>" + "<li class='row_3'>3</li>" + "<li class='row_4'>4</li>" + "<li class='row_5'>5</li>"
                          + "<li class='row_6'>6</li>" + "<li class='row_7'>7</li>" + "<li class='row_8'>8</li>" + "<li class='row_9'>9</li>" + "<li class='row_10'>10</li></ul>",
             listOdd = "<ul class='list-status dropdown-menu'> <li class='row_A'>A</li>"
                          + "<li class='row_B'>B</li>" + "<li class='row_none row_C'>C</li>" + "<li class='row_none row_D'>D</li></ul>";

        for (var index = 0; index < numberRows; index++) {
            rows.push(
                {
                    Columns: [
                        { Name: "Username", Value: "<span class='checkbox' style='float:left'><input id='username" + index + "' type='checkbox' /><label class='checkbox-label' for='username" + index + "'>000US001</label></span><a href='edit.html' class='mdi-editor-border-color icon-edit'></a>" },
                        { Name: "SystemId", Value: "AthenaUS01" },
                        { Name: "SiteName", Value: "12Bet" },
                        { Name: "Currency", Value: "US$" },
                        { Name: "Status", Value: "Open <a class='mdi-action-flip-to-front icon-status' data-toggle='dropdown' tabindex='0' href='#'></a>" + listStatus },
                        { Name: "BAStatus", Value: "<input type='checkbox' class='my-checkbox' data-off-color='primary' data-on-text='ON' data-size='mini' data-off-text='OFF' data-label-text='ON' />" },
                        { Name: "SpecialLevel", Value: "<div class='icon_color box-level4'>4</div> <a class='mdi-action-flip-to-front icon-status' data-toggle='dropdown' tabindex='0' href='#'></a>" + listLevel },
                        { Name: "OddGroup", Value: "<div class='icon_color box-groupA'>A</div> <a class='mdi-action-flip-to-front icon-status' data-toggle='dropdown' tabindex='0' href='#'></a>" + listOdd },
                        { Name: "CurrentBalance", Value: "5,000.00" },
                        { Name: "OutstandingStakes", Value: "1,000.00" },
                        { Name: "CommGroup", Value: "gA" },
                        { Name: "Commission", Value: "14.95" },
                        { Name: "NG", Value: "3.00" },
                        { Name: "LC", Value: "1.00" },
                        { Name: "CS", Value: "0.00" },
                        { Name: "History", Value: "<a href='javascript:;' data-toggle='modal' data-target='.view-history'>View</a>" }
                    ],
                    CssClass: '',
                    CustomAttr: '',
                    SubRows: ''
                }
            );
        }
        return rows;
    }

    var initializeSwitchToggle = function () {
        $('.my-checkbox').bootstrapSwitch({
            onSwitchChange: function () {
                if ($(this).bootstrapSwitch('state')) {
                    $(this).bootstrapSwitch('labelText', "OFF");
                } else {
                    $(this).bootstrapSwitch('labelText', "ON");
                }
            }
        });
    };

    /*var showContextMenu = function () {
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
    };*/

    me.Initialize = function () {
        cacheElements();
        initializeDataGrid();
        initializeSwitchToggle();
        showContextMenu();
    };
};
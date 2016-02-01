/* global Namespace, ONEbook */

'use strict';
$(document).ready(function () {
    var siteInfoPage = new ONEbook.Site.SiteInfo();
    siteInfoPage.Initialize();
});

Namespace.Register('ONEbook.Site.SiteInfo');
ONEbook.Site.SiteInfo = function () {
    var me = this;
    var cachedDOM = {
        messageType: {
            warning: 0,
            error: 1,
            info: 2
        },
        dpkDate: null,
        gridID: null
    };

    // Cache DOM elements for later uses.
    var cacheElements = function () {
        cachedDOM.dpkDate = $('.txt-date');
        cachedDOM.gridID = $("#gridId");
    };

    var initializeDateRange = function () {
        cachedDOM.dpkDate.datetimepicker({
            defaultDate: new Date(),
            pickTime: false,
            useCurrent: false
        });
    }

    var initializeDataGrid = function () {

        var gridOptions =
        {
            columns: [
                { HeaderText: "Date", Width: 150, Name: "Date", HeaderAlign: "center", CellAlign: "left" },
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
            bodyRows: generateData(100),
            headerColumnHeight: 24,
            gridExpandHeight: 250,
            bodyRowHeight: 30,
            numberOfFrozenColumn: 0,
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
        var rows = [];
        for (var index = 0; index < numberRows; index++) {
            rows.push(
                {
                    Columns: [
                        { Name: "Username", Value: "<span class='checkbox' style='float:left'><input id='username" + index + "' type='checkbox' /><label class='checkbox-label' for='username" + index + "'>000US001</label></span><a href='edit.html' class='mdi-editor-border-color icon-edit'></a>" },
                        { Name: "SystemId", Value: "AthenaUS01" },
                        { Name: "SiteName", Value: "12Bet" },
                        { Name: "Currency", Value: "US$" },
                        { Name: "Status", Value: "Open" },
                        { Name: "BAStatus", Value: "" },
                        { Name: "SpecialLevel", Value: "3" },
                        { Name: "OddGroup", Value: "A" },
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

    me.Initialize = function () {
        cacheElements();
        initializeDateRange();
        initializeDataGrid();
    };
};
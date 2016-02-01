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
                { HeaderText: "Transaction ID", Width: 100, Name: "TransactionId", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Date", Width: 150, Name: "Date", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Amount", Width: 120, Name: "Amount", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "From", Width: 150, Name: "From", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "To", Width: 150, Name: "To", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Status", Width: 120, Name: "Status", HeaderAlign: "center", CellAlign: "center" }
            ],
            bodyRows: generateData(5),
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
                        { Name: "TransactionId", Value: "1"},
                        { Name: "Date", Value: "3/4/2015" },
                        { Name: "Amount", Value: "100" },
                        { Name: "From", Value: "3/1/2015" },
                        { Name: "To", Value: "3/10/2015" },
                        { Name: "Status", Value: "Open" },
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
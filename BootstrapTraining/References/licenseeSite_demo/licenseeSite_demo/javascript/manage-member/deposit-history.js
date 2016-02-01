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
                { HeaderText: "Debit Amount", Width: 120, Name: "debitAmount", HeaderAlign: "center", CellAlign: "right" },
                { HeaderText: "Credit Amount", Width: 120, Name: "creditAmount", HeaderAlign: "center", CellAlign: "right" },
                { HeaderText: "Transaction Type", Width: 150, Name: "transactionType", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Transaction Mode", Width: 150, Name: "transactionMode", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Ref No.", Width: 120, Name: "refNo", HeaderAlign: "center", CellAlign: "center" },
                { HeaderText: "Status", Width: 120, Name: "status", HeaderAlign: "center", CellAlign: "center" }
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
                        { Name: "TransactionId", Value: "D126" },
                        { Name: "Date", Value: "3/4/2015 11:13:30 PM" },
                        { Name: "debitAmount", Value: "100" },
                        { Name: "creditAmount", Value: "100.00" },
                        { Name: "transactionType", Value: "Deposit" },
                        { Name: "transactionMode", Value: "Wire Transfers" },
                        { Name: "refNo", Value: "" },
                        { Name: "status", Value: "Pending" },
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
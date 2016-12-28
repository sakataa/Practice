define(["common/querystring"], function (QueryString) {
    "use strict";
    function setSumParams(url, totalValue) {
        url = QueryString.setParam(url, "totalrows", totalValue.BetCount);
        url = QueryString.setParam(url, "sumwinlost", totalValue.CustomerWinLoss);
        url = QueryString.setParam(url, "sumplayercomm", totalValue.CustomerComm);
        url = QueryString.setParam(url, "sumlicenseewl", totalValue.LicenseeWinLoss);
        url = QueryString.setParam(url, "sumcomm", totalValue.LicenseeComm);
        url = QueryString.setParam(url, "sumturnover", totalValue.TurnOver);
        url = QueryString.setParam(url, "sumamtdueto3rd", totalValue.AmountDue);

        return url;
    }

    function getMatchListProductOption(sportId, productCode) {
        sportId = Number(sportId);
        var productOptions = [];
        if (sportId > 0) {
            if (sportId === 180 || sportId === 186) {
                productOptions.push("VS");
            }
            else if (sportId === 162) {
                productOptions.push("LC");
            }
            else {
                if (productCode === "SB" || productCode === "ALL") {
                    productOptions.push("SB");
                }
                if (productCode === "BA" || productCode === "ALL") {
                    productOptions.push("BA");
                }
            }
        }
        else {
            if (productCode === "ALL") {
                productOptions = ["SB", "BA", "NG", "RB", "LC", "VS", "CS", "BG"];
            }
            else {
                productOptions.push(productCode);
            }
        }

        return productOptions;
    }

    return {
        setSumParams: setSumParams,
        getMatchListProductOption: getMatchListProductOption,
    };
});
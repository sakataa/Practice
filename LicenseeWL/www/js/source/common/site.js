/*global _language_en_US*/
define(["jquery", "common/querystring", "common/popup", "vendor-materialize", "lib/jquery.multiselect", "extensions/prototype"],
    function ($, QueryString, Popup) {// jshint ignore:line
        "use strict";
        var BASE_CURRENT_LIST = ["EUR", "USD", "GBP"];
        var REQUEST_VERIFICATION_TOKEN;
        var _historyDate = null;
        var _licenseeId = null;
        var _isLoadedNotificationPopup = false;
        var _rootUrl = null;
        var _pageLanguage = null;
        var _userCurrencies = null;

        function addNoticationPopup() {
            var $marquee = $("#notification-marquee");
            if ("marquee" in $marquee) {
                $marquee.marquee({ speed: 30 });
            }

            if (_isLoadedNotificationPopup === true) {
                return;
            }

            var $popup = $("#NotificationPopup");
            if ($popup.length > 0) {
                var options = {
                    height: 160,
                    title: getSingleResource("Notification")
                };
                var popup = $popup.flatPopup(options);
                popup.show();

                $popup.find(".popup-close").click(function () {
                    $.cookie("isClosedNotification", "1", { path: '/' });
                });
                _isLoadedNotificationPopup = true;
            }
        }

        function resolveClientUrl(relativeUrl) {
            return _rootUrl + relativeUrl;
        }

        function setLicenseeOption(urlOrParams, licenseeType, currencyId, currencyName, baseCurrency) {
            licenseeType = licenseeType === undefined ? "" : licenseeType;
            currencyName = $.trim(currencyName);
            // Set Url
            if (typeof (urlOrParams) === "string") {
                urlOrParams = QueryString.setParam(urlOrParams, "LicenseeType", licenseeType);
                urlOrParams = QueryString.setParam(urlOrParams, "CurrencyId", currencyId);
                urlOrParams = QueryString.setParam(urlOrParams, "CurrencyName", currencyName);
                urlOrParams = QueryString.setParam(urlOrParams, "BaseCurrency", baseCurrency);
            }
            else {
                urlOrParams.LicenseeType = licenseeType;
                urlOrParams.CurrencyId = currencyId;
                urlOrParams.CurrencyName = currencyName;
                urlOrParams.BaseCurrency = baseCurrency;
            }

            return urlOrParams;
        }

        function getDifferenceMonth(fromDate, toDate) {
            return toDate.getMonth() - fromDate.getMonth() + (12 * (toDate.getFullYear() - fromDate.getFullYear())) + 1;
        }

        function initMaterialSelect() {
            $('select.select').not('.disabled').material_select(function () { // jshint ignore:line
                $('input.select-dropdown').trigger('close');
            });

            /*Hack for IE*/
            var onMouseDown = function (e) {
                $('input.select-dropdown').not($(e.target).find('input.select-dropdown')).trigger('close');
                $('#grid-products-multiselect').multiSelect('hideMe');
                // preventing the default still allows the scroll, but blocks the blur.
                // We're inside the scrollbar if the clientX is >= the clientWidth.
                if (e.clientX >= e.target.clientWidth || e.clientY >= e.target.clientHeight) {
                    e.preventDefault();
                }
            };
            $('select.initialized').siblings('input.select-dropdown').on('mousedown', onMouseDown);
        }

        function initialize() {
            REQUEST_VERIFICATION_TOKEN = $("input[name=__RequestVerificationToken]").val();
            currencyConstraint();
            initEvent();
            _historyDate = new Date($("#HistoryDate").val());
            _rootUrl = $('#RootUrl').val();
            _pageLanguage = $('#PageLanguage').val();
            var userCurrencies = $('#UserCurrencies').val();
            if (userCurrencies) {
                _userCurrencies = JSON.parse(userCurrencies);
            }
            initBlockUI();
            addNoticationPopup();
            overrideInnerSize();
            initMaterialSelect();
        }
        function initEvent() {
            $(window).resize(overrideInnerSize);

            $("#CurrencyId").change(function () {
                currencyConstraint(true);
            });

            $.ajaxSetup({
                cache: false,
                headers: { '__RequestVerificationToken': REQUEST_VERIFICATION_TOKEN },
                statusCode: {
                    0: unBlockUI(),
                    401: function (/*jqXHR, textStatus, errorThrown*/) {
                        window.location.href = resolveClientUrl("Utility/LocationRestriction");
                    },
                    403: function () {
                        unBlockUI();
                        alert(getSingleResource("HttpError_403"));
                    },
                    500: function () {
                        unBlockUI();
                        alert(getSingleResource("ErrorProcessingMsg"));
                    }
                }
            });
        }

        function exportExcel(data, url, method) {
            var $form = $('<form id="ExportExcelForm">').attr({ action: url, method: method || 'post' })
                .appendTo('body');
            for (var property in data) {
                if (data.hasOwnProperty(property)) {
                    var value = data[property];
                    if (property === "ProductOptions") {
                        var products = typeof (value) === "object" ? value : JSON.parse(value);
                        for (var i = 0; i < products.length; i++) {
                            var product = products[i];
                            $('<input type="hidden">').attr({ name: 'ProductOptions[' + i + '].Code', value: product.Code }).appendTo($form);
                            $('<input type="hidden">').attr({ name: 'ProductOptions[' + i + '].Status', value: product.Status }).appendTo($form);
                        }
                    }
                    else {
                        $('<input type="hidden">').attr({ name: property, value: value }).appendTo($form);
                    }
                }
            }

            $('<input type="hidden">').attr({ name: '__RequestVerificationToken', value: REQUEST_VERIFICATION_TOKEN }).appendTo($form);
            $form.submit();
            $form.remove();
        }

        function setConstraintMonthRange(monthRange, url) {
            var errorMessage = getSingleResource("DateRangeExceedMsg").replace("{0}", monthRange);

            function isValidRange() {
                var fromDate = new Date($("#FromDate").val());
                var toDate = new Date($("#ToDate").val());

                return getDifferenceMonth(fromDate, toDate) <= monthRange;
            }

            if (url && typeof url === "string") {
                $(document).ajaxSend(function (event, jqxhr, settings) {
                    if (settings.url.search(new RegExp(url, "i")) > -1 && isValidRange() === false) {
                        showMessaegBox(errorMessage);
                        jqxhr.abort();
                    }
                });
            }

            $("form").submit(function () {
                if (isValidRange() === false) {
                    showMessaegBox(errorMessage);
                    return false;
                }

                return true;
            });
        }
        function showMessaegBox(message) {
            $('<div title="' + getSingleResource("LrfNotification") + '">' + message + '!</div>').dialog();
        }
        function getLicenseeId() {
            if (!_licenseeId) {
                _licenseeId = parseInt($("#LicenseeId").val());
            }

            return _licenseeId;
        }
        function getCurrencyName(currencyId) {
            return _userCurrencies[currencyId];
        }
        function getHistoryDate() {
            return _historyDate;
        }
        function isBaseCurrency(currencyName) {
            return $.inArray(currencyName.toUpperCase(), BASE_CURRENT_LIST) > -1;
        }
        function addUserGuide(options) {
            var defaultOptions = {
                buttonSelector: "#UserGuide",
                id: "UserGuidePopup"
            };
            options = $.extend(defaultOptions, options);
            options.title = options.title || "";
            var url = resolveClientUrl('UserGuide/Index?resourcename=' + options.resourceName) + "&_" + (new Date().getTime());
            var $popup;
            $(options.buttonSelector).click(function () {
                var $userGuidePopup = $('<div style="display: none" ></div>');
                if ($userGuidePopup.is(":visible")) {
                    return;
                }

                if (!$popup) {
                    $userGuidePopup.empty().attr('style', '').hide()
                        .load(url, function (response, status) {
                            if (status === "success") {
                                setTimeout(function () {
                                    Popup.openPopup($userGuidePopup, defaultOptions);
                                    $popup = $("#" + defaultOptions.id);
                                }, 50);
                            } else {
                                $userGuidePopup.hide();
                            }
                        });
                } else {
                    $popup.show();
                }
            });
        }
        function overrideInnerSize() {
            if (window.innerHeight === undefined) {
                parent.innerHeight = parent.document.documentElement.clientHeight;
                window.innerHeight = window.document.documentElement.clientHeight;
                parent.innerWidth = parent.document.documentElement.clientWidth;
                window.innerWidth = window.document.documentElement.clientWidth;
            }
        }
        function addFilterCollapseExpand(containerSelector) {
            if (!containerSelector) {
                containerSelector = ".content-filter:has(form)";
            }

            var $handler = $("<div class='filter-handle filter-handle-collapse'></div>");
            var $container = $(containerSelector);

            $container.append($handler);

            var originalHeight = $container.height();
            var originalTop = originalHeight - 15;
            var isCollapsed = false;
            $handler.css("top", originalTop);
            $handler.click(function () {
                isCollapsed = !isCollapsed;
                $container.find("*").toggle();
                $container.height(isCollapsed ? 5 : originalHeight + 5);
                $handler.css("top", isCollapsed ? -15 : originalTop);
                $(this).show().toggleClass("filter-handle-collapse filter-handle-expand");
                $(window).resize();
            });
        }
        function asNull(text) {
            if (text != null) {
                text = text.trim();
                if (text === '') {
                    return null;
                }
            }

            return text;
        }

        function gotoErrorPage(status) {
            if (status === undefined || status !== 0) {
                window.location.href = resolveClientUrl("Utility/Error");
            } else {
                unBlockUI();
            }
        }

        function unBlockUI() {
            $('div.block-body').hide();
            $('div.loading').hide();
        }
        function blockUI() {
            $('div.block-body').show();
            $('div.loading').show();
        }

        function setLicenseeOptionParam(urlOrParams) {
            var licenseeType = $("#LicenseeType").val();
            var currencyId = $("#CurrencyId").val();
            var baseCurrency = $("#BaseCurrency").val();
            var currencyName = $("#CurrencyId option[value=" + currencyId + "]").text();
            if (currencyName === undefined) {
                currencyName = $("#CurrencyName").val();
            }

            return setLicenseeOption(urlOrParams || {}, licenseeType, currencyId, currencyName, baseCurrency);
        }

        function setLicenseeOptionOriginalParam(urlOrParams) {
            var licenseeType = $("#LicenseeType").attr('data-original');
            var currencyId = $("#CurrencyId").attr('data-original');
            var baseCurrency = $("#BaseCurrency").attr('data-original');
            var currencyName = $("#CurrencyId option[value=" + currencyId + "]").text();
            if (currencyName === undefined) {
                currencyName = $("#CurrencyName").val();
            }
            return setLicenseeOption(urlOrParams, licenseeType, currencyId, currencyName, baseCurrency);
        }

        function updateOriginalLicenseeOption() {
            var objectIdList = ["#LicenseeType", "#CurrencyId", "#BaseCurrency", "#CurrencyName"];
            $(objectIdList).each(function (i, e) {
                $(e).attr("data-original", $(e).val());
            });
        }

        function setProductOptionParamList(urlOrParams) {
            // Set Url
            if (typeof (urlOrParams) === "string") {
                var counter = 0;
                $(".childCheckbox", "#ProductList").each(function (index, element) {
                    var productCode = $(element).attr('data-product-code');
                    if (productCode !== undefined && productCode.length > 0) {
                        urlOrParams = setProductOptionParam(urlOrParams, counter, productCode, $(element).prop("checked"));
                        counter++;
                    }
                });

                return urlOrParams;
            }
            else {
                urlOrParams.ProductOptions = [];
                $(".childCheckbox", "#ProductList").each(function (index, element) {
                    var productCode = $(element).attr('data-product-code');
                    if (productCode !== undefined && productCode.length > 0) {
                        urlOrParams.ProductOptions.push({ Code: productCode, Name: productCode, Status: $(element).prop("checked") });
                    }
                });

                return urlOrParams;
            }
        }

        function setProductOptionOriginalParamList(urlOrParams) {
            if (typeof (urlOrParams) === "string") {
                var counter = 0;
                $(".childCheckbox", "#ProductList").each(function (index, element) {
                    var productCode = $(element).attr('data-product-code');
                    if (productCode !== undefined && productCode.length > 0) {
                        urlOrParams = setProductOptionParam(urlOrParams, counter, productCode, $(element).attr("data-original"));
                        counter++;
                    }
                });

                return urlOrParams;
            }
            else {
                urlOrParams.ProductOptions = [];
                $(".childCheckbox']", "#ProductList").each(function (index, element) {
                    var productCode = $(element).attr('data-product-code');
                    if (productCode !== undefined && productCode.length > 0) {
                        urlOrParams.ProductOptions.push({ Code: productCode, Name: productCode, Status: $(element).attr("data-original") });
                    }
                });

                return urlOrParams;
            }
        }

        function setProductOptionParam(url, counter, productCode, status) {
            productCode = productCode == null || productCode === undefined ? undefined : productCode.toUpperCase();
            url = QueryString.setParam(url, "ProductOptions[" + counter + "].Code", productCode);
            url = QueryString.setParam(url, "ProductOptions[" + counter + "].Name", productCode);
            url = QueryString.setParam(url, "ProductOptions[" + counter + "].Status", status);

            return url;
        }

        function setDateRangeParam(url) {
            url = QueryString.setParam(url, "FromDate", $("#FromDate").val());
            url = QueryString.setParam(url, "ToDate", $("#ToDate").val());

            return url;
        }

        function setDateRangeOriginalParam(url) {
            url = QueryString.setParam(url, "FromDate", $("#FromDate").attr('data-original'));
            url = QueryString.setParam(url, "ToDate", $("#ToDate").attr('data-original'));

            return url;
        }

        function initBlockUI() {
            try {
                $(".blockui").click(function () {
                    blockUI();
                });

                unBlockUI();
            } catch (err) {
            }
        }

        function currencyConstraint(userChange) {
            var currency = Number($("#CurrencyId").val());
            var currencyName = $("#CurrencyId option:selected").text();
            currencyName = $.trim(currencyName);
            $("#CurrencyName").val(currencyName);

            // Handle outside based currency list in some reports (customer wl, balance)
            var $baseCurrency = $("#BaseCurrency");
            var noConvertOption = $("option[value='']", $baseCurrency);
            if (currency === 0 || isBaseCurrency(currencyName)) {
                noConvertOption.remove();
                if (userChange && currency !== 0) {
                    $("option[value='" + currencyName.toLowerCase() + "']", $baseCurrency).prop("selected", true);
                    $baseCurrency.val(currencyName.toLowerCase());
                }
            }
            else {
                if (noConvertOption.length === 0
                    && $baseCurrency.find('option').length > 0) { // make sure $baseCurrency is select object
                    $("<option value='' selected>" + currencyName + "</option>").appendTo($baseCurrency);
                } else {
                    $("option[value='']", $baseCurrency).text(currencyName);
                }
                if (userChange) {
                    $baseCurrency.val("");
                    $("option[value='']", $baseCurrency).text(currencyName);
                }
            }

            // Handle inside based currency list in some reports(licensee wl, wl by product)
            if ($("option[value=-1]", "#CurrencyId").length > 0) {
                var basedCurrencyMap = { "-1": "eur", "-2": "usd", "-3": "gbp" };
                var basedCurrency = basedCurrencyMap[currency.toString()];
                basedCurrency = basedCurrency === undefined ? "" : basedCurrency;
                $baseCurrency.val(basedCurrency);
            }
            $("select#BaseCurrency").material_select(function () { // jshint ignore:line
                $('input.select-dropdown').trigger('close');
            });
        }

        function sortReport(sortColumn) {
            var sortDirection = $("#SortColumn").val() === sortColumn ? $("#SortDirection").val() === "DESC" ? "ASC" : "DESC" : "ASC";

            $("#SortColumn").val(sortColumn);
            $("#SortDirection").val(sortDirection);

            var currencyName = $("#CurrencyId option:selected").text();
            currencyName = $.trim(currencyName);
            $("#CurrencyName").val(currencyName);
        }

        function createSortingIcon(sortHandler) {
            if ($("#RowCount").val() <= 1) {
                $("#header-content .sort-heading").removeClass("sort-heading");
            }
            else {
                $("#header-content .sort-heading").each(function (index, element) {
                    var headerDiv = $(element);
                    var sortColumn = headerDiv.attr("data-column-name");
                    if (sortColumn === $("#SortColumn").val()) {
                        headerDiv.addClass("sorted-heading");

                        var sortClass = $("#SortDirection").val() === "DESC" ? "sort-desc" : "sort-asc";
                        var sortSpan = $("<span></span");
                        sortSpan.addClass(sortClass);
                        var left = 0;
                        var top = 0;
                        if (headerDiv.hasClass("row2")) {
                            top = (headerDiv.height() - sortSpan.height()) / 2;
                            sortSpan.css({
                                top: top,
                                right: 0
                            });
                        }
                        else if ($(".grid-header-two-line", headerDiv).length > 0) {
                            left = (headerDiv.width() - sortSpan.width()) / 2;
                            sortSpan.css({
                                top: 19,
                                right: 0
                            });
                        }
                        else {
                            left = (headerDiv.width() - sortSpan.width()) / 2 + 35;
                            sortSpan.css({
                                top: 19,
                                right: 0
                            });
                        }

                        sortSpan.appendTo(headerDiv);
                    }

                    $(element).click(function () {
                        sortReport($(element).attr("data-column-name"));
                        sortHandler($(element).attr("data-column-name"));
                    });
                });
            }
        }

        function detectBrowser(userAgent) {
            if (userAgent === undefined) { userAgent = navigator.userAgent; }
            userAgent = userAgent.toLowerCase();
            var match = /(chrome)[ \/]([\w.]+)/.exec(userAgent) || /(webkit)[ \/]([\w.]+)/.exec(userAgent) ||
                    /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(userAgent) || /(msie) ([\w.]+)/.exec(userAgent) ||
                     userAgent.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(userAgent) || [];

            return {
                browser: match[1] || "",
                version: match[2] || "0"
            };
        }

        function getMaxHeight(element) {
            var height = 0;

            var title = 20;
            var footer = 20;
            var headerTitle = 26;
            var headerFilter = $("div.page-form").outerHeight();
            var exHeight = footer + headerTitle + headerFilter + title;

            var body = window.document.body;
            if (window.innerHeight) {
                height = window.innerHeight;
            } else if (body.parentElement.clientHeight) {
                height = body.parentElement.clientHeight;
            } else if (body && body.clientHeight) {
                height = body.clientHeight;
            }
            var offset = element.offset();
            return height - offset.top - exHeight;
        }

        function getMaxWidth() {
            var width = 0;
            var marginRight = 20;

            var body = window.document.body;
            if (window.innerWidth) {
                width = window.innerWidth;
            } else if (body.parentElement.clientWidth) {
                width = body.parentElement.clientWidth;
            } else if (body && body.clientWidth) {
                width = body.clientWidth;
            }

            return width - marginRight;
        }

        function clone(obj) {
            /// <summary>
            ///
            /// The below function will work adequatly for the six simple types I mentioned,
            /// as long as data in the objects and arrays form a tree structure.That is, there isn't
            /// more than one reference to the same data in the object.
            /// Handle the 3 simple types, and null or undefined
            /// </summary>
            /// <param name="obj"></param>
            /// <returns type=""></returns>

            if (null == obj || "object" !== typeof obj) {
                return obj;
            }
            // Handle Date
            if (obj instanceof Date) {
                var date = new Date();
                date.setTime(obj.getTime());
                return date;
            }

            // Handle Array
            if (obj instanceof Array) {
                var array = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    array[i] = clone(obj[i]);
                }
                return array;
            }

            // Handle Object
            if (obj instanceof Object) {
                var copy = {};
                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr)) {
                        copy[attr] = clone(obj[attr]);
                    }
                }
                return copy;
            }

            throw new Error("Unable to copy obj! Its type isn't supported.");
        }

        function asBool(input) {
            if (typeof input === 'string') {
                return input.toLowerCase() === 'true';
            }

            return !!input;
        }
        function getSingleResource(enghlishName) {
            if (enghlishName == null || enghlishName === undefined) {
                return enghlishName;
            }

            var keyName = "_language_" + _pageLanguage.replace("-", "_");

            var resources = window[keyName];
            if (!resources) {
                resources = _language_en_US; // jshint ignore:line
            }

            var mapResource = function (key) {
                var item = resources[key];
                if (item === undefined) {
                    item = _language_en_US[key]; // jshint ignore:line
                    return item !== undefined ? item : key;
                } else {
                    return item;
                }
            };
            if (enghlishName.indexOf("@") > -1) {
                var keys = enghlishName.match(/\@{1}\[{1}[a-zA-Z\d\_]+\]{1}/g);
                if (keys != null) {
                    var temp = enghlishName;
                    for (var i = 0; i < keys.length; i++) {
                        var realKey = keys[i].replace("@[", "").replace("]", "");
                        temp = temp.replace(keys[i], mapResource(realKey));
                    }
                    return temp;
                }
                return mapResource(enghlishName);
            }
            else {
                return mapResource(enghlishName);
            }
        }

        function getResources(arrayText) {
            if (arrayText == null) {
                return null;
            }
            if (arrayText.constructor !== Array) {
                return null;
            }

            var newArray = [];
            for (var i = 0; i < arrayText.length; i++) {
                newArray.push(getSingleResource(arrayText[i]));
            }
            return newArray;
        }
        function isNumber(text) {
            return !isNaN(parseFloat(text)) && isFinite(text);
        }
        function isInteger(text) {
            return typeof isNumber(text) && parseFloat(text) === parseInt(text, 10) && !isNaN(text);
        }

        function redirect(url) {
            window.location.href = url;
        }

        function getCurrentUrl() {
            return window.location.href;
        }

        function getLocation() {
            return window.location;
        }

        function setMultiSelectForDropDownList(dropDownListId, dataSource, valueField, textField, checkField) {
            var data = $.parseJSON(dataSource);
            var length = data.length;
            var dataUI = [];
            var checkedCount = 0;
            for (var i = 0; i < length; i++) {
                var item = data[i];
                var isChecked = asBool(item[checkField]);
                if (isChecked) {
                    checkedCount++;
                }

                dataUI.push({
                    Id: item[valueField],
                    Value: item[valueField],
                    Text: getSingleResource(item[textField]),
                    Checked: isChecked,
                    Enable: true
                });
            }

            var isCheckAll = checkedCount === length;
            $("#" + dropDownListId).multiSelect(
                {
                    minWidth: 200,
                    maxHeight: 400,
                    shadow: true,
                    showHeader: true,
                    isCheckAll: isCheckAll,
                    checkAllText: getSingleResource('All'),
                    showFooter: false,
                    listData: dataUI,
                    onCheck: function () {
                        var checkedItems = $("#" + dropDownListId).multiSelect("getCheckedItems");
                        $("#product-container input[type=checkbox]:checked").prop("checked", false);
                        var hasItemsChecked = checkedItems.length > 0;
                        if (hasItemsChecked) {
                            for (var i = 0; i < checkedItems.length; i++) {
                                $('#product-container #' + checkedItems[i]).prop("checked", true);
                            }
                        }

                        $("#SubmitButton").prop("disabled", !hasItemsChecked);
                        $(".error-img").toggleClass("hide", hasItemsChecked);
                    }
                });
        }

        return {
            initialize: initialize,
            resolveClientUrl: resolveClientUrl,
            exportExcel: exportExcel,
            setConstraintMonthRange: setConstraintMonthRange,
            showMessaegBox: showMessaegBox,
            getLicenseeId: getLicenseeId,
            getCurrencyName: getCurrencyName,
            getHistoryDate: getHistoryDate,
            isBaseCurrency: isBaseCurrency,
            addUserGuide: addUserGuide,
            overrideInnerSize: overrideInnerSize,
            addFilterCollapseExpand: addFilterCollapseExpand,
            asNull: asNull,
            gotoErrorPage: gotoErrorPage,
            unBlockUI: unBlockUI,
            blockUI: blockUI,
            setLicenseeOptionParam: setLicenseeOptionParam,
            setLicenseeOptionOriginalParam: setLicenseeOptionOriginalParam,
            updateOriginalLicenseeOption: updateOriginalLicenseeOption,
            setProductOptionParamList: setProductOptionParamList,
            setProductOptionOriginalParamList: setProductOptionOriginalParamList,
            setProductOptionParam: setProductOptionParam,
            setDateRangeParam: setDateRangeParam,
            setDateRangeOriginalParam: setDateRangeOriginalParam,
            currencyConstraint: currencyConstraint,
            sortReport: sortReport,
            createSortingIcon: createSortingIcon,
            detectBrowser: detectBrowser,
            getMaxHeight: getMaxHeight,
            getMaxWidth: getMaxWidth,
            clone: clone,
            asBool: asBool,
            getSingleResource: getSingleResource,
            getResources: getResources,
            isNumber: isNumber,
            isInteger: isInteger,
            redirect: redirect,
            getCurrentUrl: getCurrentUrl,
            getLocation: getLocation,
            setMultiSelectForDropDownList: setMultiSelectForDropDownList
        };
    });
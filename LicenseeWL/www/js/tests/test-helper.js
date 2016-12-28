define([], function () {
    return {
        initGlobalSetting: function () {
            appendSetFixtures('<input id="PageLanguage" value="en_US" />');
            appendSetFixtures('<input id="HistoryDate" value="1/1/2016" />');
            appendSetFixtures('<input id="RootUrl" value="" />');
            appendSetFixtures('<input id="UserCurrencies" value="" />');
            window._language_en_US = {};
        }
    };
});
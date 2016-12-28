define(['jquery', 'common/popup'], function ($, PopUp) {
    describe("PopUp", function () {
        describe("openPopup(element, option)", function () {
            it("flatpopup jquery plugin should be called with correct parameters", function () {
                spyOn($.fn, "flatPopup");

                var $element = setFixtures('<div id="popup"></div>');
                var option = {
                    width: 200, height: 300, title: "title"
                };

                PopUp.openPopup($element, option);

                expect($.fn.flatPopup).toHaveBeenCalledWith(option);
            });
        });

        describe("openPopupWithIframe(url, option)", function () {
            it("Bet List popup should be called with correct url", function () {
                spyOn($.fn, "flatPopup");

                var url = "/Test/Index?transid=1234&custId=5678";
                var option = { width: 500, height: 600, title: "Bet List", id: "BetListPopUp" };

                PopUp.openPopupWithIframe(url, option);

                expect($.fn.flatPopup).toHaveBeenCalledWith(option);
            });
        });
    });
});
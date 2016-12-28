define(['jquery', 'extensions/jquery.extension'], function ($) {
    describe("$.fn.hasVerticalScrollBar()", function () {
        beforeEach(function () {
            setFixtures('<div class="body-content"></div>');
        });

        it("value of hasVerticalScrollBar jquery function is 'true' when scrollHeight > height", function () {
            var $bodyContent = $(".body-content").width(20).height(300);
            var text = "hello world";
            for (var i = 0; i < 10; i++) {
                text += text;
            }
            $bodyContent.text(text);

            var result = $bodyContent.hasVerticalScrollBar();

            expect(result).toBe(true);
        });

        it("value is jquery function 'false' when scrollHeight < height", function () {
            var $bodyContent = $(".body-content").width(20).height(300);
            var text = "hello world";
            $bodyContent.text(text);

            var result = $bodyContent.hasVerticalScrollBar();

            expect(result).toBe(false);
        });
    });
});
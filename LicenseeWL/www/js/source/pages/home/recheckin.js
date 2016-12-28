/// <reference path="/@JSense.js" />
define(["common/site"], function (Site) {
    "use strict";
    var _handle;
    var _onUserId;

    function logout() {
        var index = window;
        while (index !== index.parent) {
            index = index.parent;
        }

        index.location = Site.resolveClientUrl('Authorization/SignOut');
    }

    function closeBrowser() {
        var index = window;
        while (index !== index.parent) {
            index = index.parent;
        }

        index.close();
    }

    function reCheckin() {
        var Success = 0;
        // var Unknown = -1;
        // var AccessDenied = 1;
        // var AccountClosed = 2;
        // var KickedOut = 3;
        // var UnderMaintenance = 4;
        var SessionOverride = 5;

        $.ajax({
            url: Site.resolveClientUrl("Authorization/ReCheckIn?onid=") + _onUserId,
            async: true,
            type: "GET",
            cache: false,
            success: function (result) {
                if (typeof result !== "object") {
                    return;
                }

                var errCode = result.ErrCode;
                if (errCode !== Success) {
                    clearInterval(_handle);
                    alert(result.ErrMsg, true);
                    var isInternal = $("#IsInternal").val() === "1";
                    if (isInternal || SessionOverride === errCode) {
                        var signOutUrl = Site.resolveClientUrl('Authorization/SignOut');
                        $.ajax({
                            url: signOutUrl,
                            complete: function () {
                                closeBrowser();
                            },
                            type: "GET",
                            async: true
                        });
                    }
                    else {
                        logout();
                    }
                }
            }
        });
    }

    return {
        init: function () {
            _onUserId = $("#OnUserId").val();
            reCheckin();
            _handle = setInterval(reCheckin, 30000);
        }
    };
});
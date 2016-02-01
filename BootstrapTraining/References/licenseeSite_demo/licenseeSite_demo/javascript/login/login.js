/* global Namespace, ONEbook */

'use strict';
$(document).ready(function () {
    var loginPage = new ONEbook.Site.Login();
    loginPage.Initialize();
});

Namespace.Register('ONEbook.Site.Login');
ONEbook.Site.Login = function () {
    var me = this;
    var cachedDOM = {
        btnLogin: null,
        txtPassword: null,
        txtUsername: null,
        txtNote: null,
        errorMessage: null,
        iconRefresh: null,
        iconCaptcha: null,
        txtCaptcha: null
    };

    // Cache DOM elements for later uses.
    var cacheElements = function () {
        cachedDOM.btnLogin = $('#btnLogin');
        cachedDOM.txtUsername = $('.username');
        cachedDOM.txtPassword = $('.password');
        cachedDOM.txtNote = $('.text-note');
        cachedDOM.errorMessage = $('.err-msg');
        cachedDOM.iconRefresh = $('.icon-refresh');
        cachedDOM.iconCaptcha = $('.img-box');
        cachedDOM.txtCaptcha = $('.txtCaptcha');        
    };

    // Initialize the date range.
    var registerEvent = function () {

        cachedDOM.btnLogin.on('click', function () {
            var valuepass = cachedDOM.txtPassword.val();
            var valueuser = cachedDOM.txtUsername.val();
            if (valuepass == "" && valueuser == "") {
                cachedDOM.txtNote.empty().append('Please input username and password!');
                cachedDOM.errorMessage.show();
                valueuser.focus();
            }
            else if (valuepass != "1234aa" || valueuser != "sa") {
                cachedDOM.iconCaptcha.css('display', 'inline-block');
                cachedDOM.iconRefresh.css('display', 'inline-block');
                cachedDOM.txtCaptcha.css('display', 'inline-block');
                cachedDOM.txtNote.empty().append('Invalid username or password. Please try again');
                cachedDOM.errorMessage.show();
            } else {
                window.location.replace('../../index.html');
            }
        });
    };

    me.Initialize = function () {
        cacheElements();
        registerEvent();
    };
};
var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/-spec\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/www/js/source',

    paths: {
        "test-helper": '../tests/test-helper',
        "jasmine-fixture": '/base/bower_components/jasmine-fixture/dist/jasmine-fixture.min',
        "squire": "/base/node_modules/squirejs/src/Squire",
        "hammerjs": "/base/node_modules/hammerjs/hammer",
        "bootstrap-daterangepicker": "/base/node_modules/bootstrap-daterangepicker/daterangepicker",
        "vendor-materialize": "vendors/materialize/materialize"
    },
    packages: [{
        name: 'moment',
        location: '/base/node_modules/moment',
        main: 'moment'
    },
    {
        name: 'malihu-custom-scrollbar-plugin',
        location: '/base/node_modules/malihu-custom-scrollbar-plugin',
        main: 'malihu-custom-scrollbar-plugin'
    }],
    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
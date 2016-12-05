(function() {
    var tableBody = document.getElementById("data");

    var count = 8002;
    var html = [];

    for (var i = 0; i < count; i++) {
        var row = "<tr><td>Data</td><td>Data</td><td>Data</td></tr>";
        html.push(row);
    }

    tableBody.innerHTML += html.join();
})();
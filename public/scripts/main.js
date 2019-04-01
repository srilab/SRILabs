

function displayLocation(latitude, longitude) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        var method = "GET";
        var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=AIzaSyAveDcU4evdxvYUjs4tF_ytueKr2w0zXGE";
        var async = true;
        request.open(method, url, async);
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    var data = JSON.parse(request.responseText);
                    var address = data.results[0];
                    resolve(address);
                }
                else {
                    reject(request.status);
                }
            }
        };
        request.send();
    });
};
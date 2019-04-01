var mysql = require('mysql');
var hooverData;

function connectDatabase() {
    if (!hooverData) {
        hooverData = mysql.createConnection({
            host: "particle.wirelessrewired.com",
            database: "hoover_data",
            user: "uaSTEM",
            password: "uaSTEM2019!"
        });
        
        hooverData.connect(function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("MySQL Database Connected");
            }
        });
    }
    return hooverData;
}

module.exports = connectDatabase();
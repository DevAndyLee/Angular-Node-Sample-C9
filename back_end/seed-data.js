var Db = require('mongodb').Db,
    Server = require('mongodb').Server;

var getDB = function getDB(callbackFn) {
    var db = new Db('spa', new Server(process.env.IP, 27017), { w: 0 });
    db.open(function (err, db) {
        if (err) throw err;

        callbackFn(db);
    });
};

var trans = function trans(date, amount, valuation) {
    return { "date": date + "T00:00:00", amount: amount, valuation: !!valuation };
};

var investments = [
    { "id": 1, "name": "Adept Incorporated", sector: "Technology", "transactions": [trans("2010-04-20", 1000), trans("2011-03-19", 500), trans("2012-12-30", -800), trans("2013-06-03", -1500)] },
    { "id": 2, "name": "Global Industries", sector: "Financial", "transactions": [trans("2011-02-06", 1200), trans("2011-08-14", 800), trans("2013-06-30", -1000), trans("2014-06-30", -2500, true)] },
    { "id": 3, "name": "Blue Chip Technology", sector: "Technology", "transactions": [trans("2012-08-10", 1000), trans("2013-02-13", 500), trans("2014-06-30", -1300, true)] },
    { "id": 4, "name": "Fast Foods UK", sector: "Produce", "transactions": [trans("2011-07-15", 300), trans("2014-02-09", -400)] },
    { "id": 5, "name": "Eurobank", sector: "Financial", "transactions": [trans("2010-03-10", 3000), trans("2012-04-27", 1000), trans("2013-12-31", -4140)] },
    { "id": 6, "name": "Tremendous Textiles", sector: "Manufacturing", "transactions": [trans("2011-01-28", 890), trans("2012-06-15", -700)] },
    { "id": 7, "name": "Roboto Robotics", sector: "Technology", "transactions": [trans("2013-02-12", 400), trans("2014-06-09", 200), trans("2014-06-30", -720, true)] },
    { "id": 8, "name": "Europe Pharmaceuticals", sector: "Pharmaceutical", "transactions": [trans("2012-11-01", 590), trans("2013-03-10", 200), trans("2013-06-15", 400), trans("2014-06-30", -1170, true)] },
    { "id": 9, "name": "Tornel Networks", sector: "Technology", "transactions": [trans("2011-12-10", 1470), trans("2014-06-30", -1598, true)] },
    { "id": 10, "name": "Minimeal", sector: "Produce", "transactions": [trans("2012-02-15", 2148), trans("2012-12-30", -500), trans("2013-04-20", -2496)] },
    { "id": 11, "name": "Focus", sector: "Technology", "transactions": [trans("2012-05-02", 798), trans("2014-01-19", -740)] },
    { "id": 12, "name": "Severn Sockets", sector: "Power", "transactions": [trans("2012-08-25", 310), trans("2014-11-01", -400), trans("2013-11-05", -20)] },
    { "id": 13, "name": "Eastern Energy", sector: "Power", "transactions": [trans("2012-09-30", 3020), trans("2013-09-30", 3000), trans("2014-06-30", -6328, true)] },
    { "id": 14, "name": "Pharmacol", sector: "Pharmaceutical", "transactions": [trans("2012-11-20", 1872), trans("2013-05-19", -1000), trans("2014-02-25", -1139)] },
    { "id": 15, "name": "Zebra Corp", sector: "Financial", "transactions": [trans("2012-12-10", 950), trans("2013-03-02", 500), trans("2013-06-18", 500), trans("2014-06-30", -2287, true)] },
    { "id": 16, "name": "Powernet", sector: "Power", "transactions": [trans("2013-01-04", 1487), trans("2014-06-30", -1698, true)] },
    { "id": 17, "name": "Inca Investments", sector: "Financial", "transactions": [trans("2013-03-27", 420), trans("2014-01-15", -300), trans("2014-06-30", -80, true)] }
];

// Seed the data in the table
getDB(function (db) {
    var investmentsTable = db.collection('investments');
    investmentsTable.count(function (err, count) {
        if (err) throw err;
        console.log(count + " records in table");
        if (count < investments.length) {
            for (var n = count; n < investments.length; n++) {
                console.log("Inserting record '" + investments[n].name + "'");
                investmentsTable.insert(investments[n]);
            }
        }

        db.close();
    });
});

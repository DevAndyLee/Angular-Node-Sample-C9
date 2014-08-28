var Db = require('mongodb').Db,
    Server = require('mongodb').Server;

require('./seed-data');

function Repository() {
    var self = this;

    var getDB = function getDB(callbackFn) {
        var db = new Db('spa', new Server(process.env.IP, 27017), { w: 0 });
        db.open(function (err, db) {
            if (err) throw err;

            callbackFn(db);
        });
    };

    var getFilteredInvestments = function getFilteredInvestments(name, callbackFn) {
        getDB(function (db) {
            var query = name ? { name: { $regex: name, $options: 'i' } } : {};
            db.collection('investments').find(query, function (err, cursor) {
                if (err) throw err;

                cursor.toArray(function (err, list) {
                    if (err) throw err;

                    callbackFn(list);
                    db.close();
                });
            });
        });
    };

    this.analysis = function (name, callbackFn) {
        getFilteredInvestments(name, function (list) { callbackFn(list.map(toModel)); });
    };

    this.getInvestment = function (id, callbackFn) {
        getDB(function (db) {
            db.collection('investments').findOne({ id: id }, function (err, investment) {
                if (err) throw err;
                callbackFn({
                    name: investment.name,
                    sector: investment.sector,
                    transactions: investment.transactions,
                    analysis: toModel(investment)
                });

                db.close();
            });
        });
    };

    this.getSectors = function (name, callbackFn) {
        self.analysis(name, function (analysisResults) {
            var sectors = {};
            for (var i = 0; i < analysisResults.length; i++) {
                var investment = analysisResults[i];
                var sector = sectors[investment.sector];
                if (!sector) {
                    sector = { name: investment.sector, investedAmount: 0, returnAmount: 0 };
                    sectors[investment.sector] = sector;
                }

                sector.investedAmount += investment.investedAmount;
                sector.returnAmount += investment.returnAmount;
            }

            var sectorList = [];
            for (var s in sectors) {
                sectorList.push(sectors[s]);
            }

            callbackFn(sectorList);
        });
    };

    this.getTransactions = function (name, callbackFn) {
        getFilteredInvestments(name, function (investments) {
            callbackFn(investments.reduce(function (list, investment) {
                for (var i = 0; i < investment.transactions.length; i++) {
                    var t = investment.transactions[i];
                    if (!t.valuation) list.push(t);
                }
                return list;
            }, []));
        });
    };

    var toModel = function toModel(investment) {
        var transactions = investment.transactions;
        var startDate = transactions[0].date;
        var endDate = transactions[investment.transactions.length - 1].date;

        var investedAmount = transactions.filter(function (t) { return t.amount > 0; }).reduce(function (sum, t) { return sum + t.amount; }, 0);
        var returnAmount = transactions.filter(function (t) { return t.amount < 0; }).reduce(function (sum, t) { return sum - t.amount; }, 0);

        return {
            id: investment.id,
            name: investment.name,
            sector: investment.sector,
            startDate: startDate,
            endDate: endDate,
            holdingPeriod: (new Date(Date.parse(endDate)).getTime() - new Date(Date.parse(startDate)).getTime()) / (365.25 * 24 * 3600 * 1000),
            investedAmount: investedAmount,
            returnAmount: returnAmount,
            returnOnInvestment: (returnAmount - investedAmount) / investedAmount,
            open: transactions[investment.transactions.length - 1].valuation
        };
    };
}

module.exports = new Repository();

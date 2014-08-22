var url = require("url"),
    queryString = require('query-string'),
    repository = require('./repository');

exports.router = function (request, response, next) {
    var urlParts = url.parse(request.url);
    var pathname = urlParts.pathname;
    console.log("Request for " + pathname + " received (params: " + urlParts.query + ").");

    var query = queryString.parse(urlParts.query);

    var jsonResult = function (result) { response.send(result) };

    if (pathname === '/analysis')
        repository.analysis(query.name, jsonResult);
    else if (pathname === '/getSectors')
        repository.getSectors(query.name, jsonResult);
    else if (pathname === '/getTransactions')
        repository.getTransactions(query.name, jsonResult);
    else if (pathname === '/getInvestment')
        repository.getInvestment(parseInt(query.id), jsonResult);
    else {
        response.writeHead(404);
    }
};

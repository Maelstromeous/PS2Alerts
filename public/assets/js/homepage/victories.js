var alertStats = {
    total: 0,
    totalDominations: 0,
    victories: {
        vs: 0,
        nc: 0,
        tr: 0,
        draw: 0
    },
    dominations: {
        vs: 0,
        nc: 0,
        tr: 0
    }
};

var serverStats = [];

var servers = [1,10,13,17,25,1000,1001,1002,1003,2000,2001,2002,2003];

// Build Server array
for (var i = 0; i < servers.length; i++) {
    serverStats[servers[i]] = {
        vs: 0,
        nc: 0,
        tr: 0,
        draw: 0
    };
}

console.log(serverStats);

// ASYNC FUNCTIONS
setTimeout(function() {
    getTotalVictories();
}, 0);

setTimeout(function() {
    getEmpireVictories();
}, 0);

setTimeout(function() {
    getServerVictories();
}, 0);

function getTotalVictories() {
    Promise.all([
        readStatisticsAlertTotal({ Valid: 1 }),
        readStatisticsAlertTotal({ ResultDomination: 1 }),
    ]).then(function(totals) {
        alertStats.total            = totals[0];
        alertStats.totalDominations = totals[1];

        writeTotals();
    });
}

function getEmpireVictories() {
    // Initiate a promise to return all data required
    Promise.all([
        readStatisticsAlertTotal({ ResultWinner: 'vs' }),
        readStatisticsAlertTotal({ ResultWinner: 'nc' }),
        readStatisticsAlertTotal({ ResultWinner: 'tr' }),
        readStatisticsAlertTotal({ ResultWinner: 'draw' }),
        readStatisticsAlertTotal({ ResultWinner: 'vs', ResultDomination: 1 }),
        readStatisticsAlertTotal({ ResultWinner: 'nc', ResultDomination: 1 }),
        readStatisticsAlertTotal({ ResultWinner: 'tr', ResultDomination: 1 }),
    ]).then(function(totals) {
        // Write to the statistics object
        alertStats.victories.vs   = totals[0];
        alertStats.victories.nc   = totals[1];
        alertStats.victories.tr   = totals[2];
        alertStats.victories.draw = totals[3];
        alertStats.dominations.vs = totals[4];
        alertStats.dominations.nc = totals[5];
        alertStats.dominations.tr = totals[6];

        writeEmpireTotals();
    }).catch(function(error) {
        console.log(error);
    });
}

function getServerVictories() {
    console.log("Getting server victories");
    Promise.all([
        readApiGet('/statistics/alert/zone')
    ]).then(function(serverTotals) {
        console.log(serverTotals[0]);
        writeServerVictories(serverTotals[0]);
        writeZoneVictories(serverTotals[0]);
    }).catch(function(error) {
        console.log(error);
    });
}

function writeTotals() {

}

function writeEmpireTotals() {
    var empires = ['vs', 'nc', 'tr', 'draw'];

    for (var i = 0; i < empires.length; i++) {
        var elem = $('#' + empires[i] + '-victories');
        var percentage = alertStats.victories[empires[i]] / alertStats.total * 100;

        $(elem).html('<b>' + alertStats.victories[empires[i]] + '</b> / ' + percentage.toFixed(2) + '%');
    }

    // Deletes Draw for domination loop
    delete empires[3];

    for (var i = 0; i < empires.length; i++) {
        $('#' + empires[i] + '-dominations').text(alertStats.dominations[empires[i]]);
    }

    $('.victory-card .card .fa-spin').hide();
    $('.victory-card .card .collection').fadeIn();

    // Now that all the data is here, set up the victory chart
    setUpVictoryBar();
}

function setUpVictoryBar()
{
    var data = {
        vs:    alertStats.victories.vs / alertStats.total * 100,
        nc:    alertStats.victories.nc / alertStats.total * 100,
        tr:    alertStats.victories.tr / alertStats.total * 100,
        draw:  alertStats.victories.draw / alertStats.total * 100,
        total: alertStats.total
    };

    var elem = $('#victory-territory-bar');
    renderTerritoryBar(data, elem);
}

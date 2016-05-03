app.controller('AlertController', function(
    $scope,
    $window,
    $routeParams,
    AlertMetricsService
) {
    $scope.alert = AlertMetricsService;

    $scope.loaded = {
        data: false
    };

    $scope.project = {
        title: 'Project Status: Alert Detail Pages',
        subtitle: 'Per-alert statistics pages are in the process of being re-written. See below for a summary of the features',
        updated: 'Sunday 6th March 2016',
        completed: [
            'Basic Alert Information (time, server, continent etc)',
            'Territory Capture Bar',
            'Basic Combat Metrics (Kills, Deaths, Tks, Suicides)',
            'Leaderboard system (Players, Outfits, Weapons, Vehicles)',
            'Basic Facility Statistics',
            'Outfit Captures'
        ],
        inprogress: [
            'Map Capture Timeline',
            'Map "who capped whom" display',
        ],
        notstarted: [
            'Faction Kills timeline',
            'Realtime metrics (live updating)',
            'Class Combat Statistics',
            'XP Statistics',
            'Per-player metrics summaries',
            'Per-outfit metrics summaries'
        ]
    };

    $scope.$on('dataLoaded', function() {
        $scope.loaded.data = true;

        // It seems promises causes some issues with Angular. Need to apply the scope to kick it in the nuts.
        $scope.$apply();

        // Alert Countdown
        if ($scope.alert.details.ended == 0) {
            var started = $scope.alert.details.started / 1000; // Start time in seconds
            var end = (started + 5400) * 1000; // Plus 90 minutes, * 1000 for milliseconds

            setTimeout(function() {
                $('#alert-countdown').countdown(end, function(event) {
                    $(this).html(event.strftime('%H:%M:%S'));
                });
            }, 1000);
        }

        $('#player-leaderboard').DataTable({
            data: $scope.alert.parsed.players,
            columns: [
                { data: 'name', title: 'Player', className: 'name' },
                { data: 'outfit', title: 'Outfit', className: 'outfit' },
                { data: 'kills', title: 'Kills', className: 'metric' },
                { data: 'deaths' , title: 'Deaths', className: 'metric' },
                { data: 'kd' , title: 'K/D', className: 'metric' },
                { data: 'teamkills', title: 'TKs', className: 'metric' },
                { data: 'suicides', title: 'Suicides', className: 'metric' },
                { data: 'headshots', title: 'Headshots', className: 'metric' },
                { data: 'hsr', title: 'HS %', className: 'metric hsr' },
                { data: 'kpm', title: 'KPM', className: 'metric kpm' },
                { data: 'dpm', title: 'DPM', className: 'metric dpm' },
                { data: 'factionAbv', visible: false },
                { data: 'outfitTag', visible: false }
            ],
            order:          [2, 'desc'],
            deferRender:    true,
            scrollY:        450,
            scrollCollapse: true,
            scroller:       true,
            "rowCallback": function( row, data, index ) {
                // Format the faction colors
                if (data.factionAbv !== null) {
                    $('.name', row).addClass(data.factionAbv + '-table-text');
                    $('.outfit', row).addClass(data.factionAbv + '-table-text');
                }

                // Add outfit tags
                if (data.outfitTag !== null) {
                    $('.outfit', row).html('['+data.outfitTag+'] '+data.outfit);
                }
                $('.hsr', row).html(data.hsr + '%');
            }
        });

        $('#outfit-leaderboard').DataTable({
            data: $scope.alert.parsed.outfits,
            columns: [
                { data: 'name', title: 'Outfit', className: 'name' },
                { data: 'participants', title: 'Players', className: 'metric'},
                { data: 'kills', title: 'Kills', className: 'metric' },
                { data: 'deaths', title: 'Deaths', className: 'metric' },
                { data: 'kd', title: 'K/D *', className: 'metric kd' },
                { data: 'teamkills', title: 'TKs', className: 'metric' },
                { data: 'suicides', title: 'Suicides', className: 'metric' },
                { data: 'killsPerParticipant', title: 'Kills PP', className: 'metric killsPP' },
                { data: 'deathsPerParticipant', title: 'Deaths PP', className: 'metric deathsPP' },
                { data: 'kpm', title: 'KPM', className: 'metric kpm' },
                { data: 'dpm', title: 'DPM', className: 'metric dpm' },
                { data: 'captures', title: 'Caps', className: 'metric caps' },
                { data: 'tag', title: 'Tag', className: 'metric', visible: false },
                { data: 'factionAbv', visible: false }
            ],
            order:          [2, 'desc'],
            deferRender:    true,
            scrollY:        450,
            scrollCollapse: true,
            scroller:       true,
            "rowCallback": function( row, data, index ) {
                // Format the faction colors
                if (data.factionAbv !== null) {
                    $('.name', row).addClass(data.factionAbv + '-table-text');
                }

                // Add outfit tags
                if (data.tag !== null) {
                    $('.name', row).html('['+data.tag+'] '+data.name);
                }
            }
        });

        $('#weapon-leaderboard').DataTable({
            data: $scope.alert.parsed.weapons,
            columns: [
                { data: 'name', title: 'Weapon', className: 'name' },
                { data: 'kills', title: 'Kills', className: 'metric'},
                { data: 'teamkills', title: 'TKs', className: 'metric' },
                { data: 'headshots' , title: 'Headshots', className: 'metric' },
                { data: 'hsr' , title: 'HS %', className: 'metric hsr' },
                { data: 'kpm', title: 'KPM', className: 'metric kpm' },
                { data: 'vehicle', visible: false },
                { data: 'faction' , visible: false }
            ],
            order:          [1, 'desc'],
            deferRender:    true,
            scrollY:        450,
            scrollCollapse: true,
            scroller:       true,
            "rowCallback": function( row, data, index ) {
                var vehicle = ' [I]';
                // Format the cells
                if (data.factionAbv !== null) {
                    $('.name', row).addClass(data.factionAbv + '-table-text');
                }

                if (data.vehicle === 1) {
                    vehicle = ' [V]';
                }

                $('.name', row).html(data.name + vehicle);
                $('.hsr', row).html(data.hsr + '%');
            }
        });

        $('#vehicle-leaderboard').DataTable({
            data: $scope.alert.parsed.vehicles,
            columns: [
                { data: 'name', title: 'Vehicle', className: 'name' },
                { data: 'kills', title: 'Kills', className: 'metric' },
                { data: 'kd', title: 'K/D (total)', className: 'metric kd' },
                { data: 'killsI', title: 'Inf Kills', className: 'metric' },
                { data: 'killsV', title: 'Veh Kills', className: 'metric' },
                { data: 'deaths', title: 'Deaths', className: 'metric' },
                { data: 'deathsI', title: 'Inf Deaths *', className: 'metric' },
                { data: 'deathsV', title: 'Veh Deaths', className: 'metric' },
                { data: 'bails', title: 'Ejections', className: 'metric' },
                { data: 'kpm', title: 'KPM', className: 'metric kpm' },
                { data: 'dpm', title: 'DPM', className: 'metric dpm' },
                { data: 'factionAbv', visible: false },
                { data: 'type', visible: false }
            ],
            order:          [1, 'desc'],
            deferRender:    true,
            scrollY:        450,
            scrollCollapse: true,
            scroller:       true,
            "rowCallback": function( row, data, index ) {
                // Format the cells
                if (data.factionAbv !== null) {
                    $('.name', row).addClass(data.factionAbv + '-table-text');
                }
            }
        });

        $(document).ready(function(){
            $('ul.tabs').tabs();
        });

        $(document).ready(function() {
            $('.jumpto').on('click', function() {
                var selector = $(this).attr('data-jumpto');
                var element  = $(selector);
                $('html, body').animate({
                    scrollTop: element.offset().top - 10
                }, 300);
            });
        });

        // Simulate a player leaderboard click as it's opened by default
        var options = {
            hitType: 'event',
            eventCategory: 'Alert',
            eventAction: 'Leaderboards Initial'
        };
        ga('send', options);
    });

    $scope.getTopFacilityOutfit = function() {
        var obj = _.orderBy($scope.alert.parsed.facilities, ['captures'], ['desc']);
        console.log(obj[0]);
    };

    // Instantiate the service
    $scope.alert.init($routeParams.alert);

    $scope.filterByProp = function(prop, val) {
        return function(item) {
            return item[prop] > val;
        };
    };
});
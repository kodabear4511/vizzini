define(["Maneuver", "Pilot", "Position", "Team", "UpgradeCard", "process/Action", "process/ActivationAction", "process/Adjudicator", "process/Environment", "process/EnvironmentFactory", "process/Reducer", "process/SimpleAgent", "process/SquadBuilder", "process/Token"],
    function(Maneuver, Pilot, Position, Team, UpgradeCard, Action, ActivationAction, Adjudicator, Environment, EnvironmentFactory, Reducer, SimpleAgent, SquadBuilder, Token)
    {
        "use strict";
        QUnit.module("ActivationAction");

        var delay = 1000;

        QUnit.test("doIt() Lightning Reflexes", function(assert)
        {
            // Setup.
            var upgradeKey = UpgradeCard.LIGHTNING_REFLEXES;
            var action = createActivationAction(upgradeKey);

            // Run.
            var done = assert.async();
            action.doIt();

            // Verify.
            setTimeout(function()
            {
                assert.ok(true, "test resumed from async operation");

                var environment = action.environment();
                var token = action.token();
                assert.equal(token.upgradeKeys.length, 0);
                var position = environment.getPositionFor(token);
                assert.equal(position.x(), 458);
                assert.equal(position.y(), 695);
                assert.equal(position.heading(), 90);
                assert.ok(token.isStressed());

                done();
            }, delay);
        });

        QUnit.test("doIt() Maneuvering Fins", function(assert)
        {
            // Setup.
            var upgradeKey = UpgradeCard.MANEUVERING_FINS;
            var action = createActivationAction(upgradeKey, Maneuver.TURN_LEFT_2_STANDARD);
            action.performAction = function() {};

            // Run.
            var done = assert.async();
            action.doIt();

            // Verify.
            setTimeout(function()
            {
                assert.ok(true, "test resumed from async operation");

                var environment = action.environment();
                var token = environment.activeToken();
                var activationState = token.activationState();
                assert.ok(activationState);
                var activationAction = activationState.activationAction();
                assert.ok(activationAction);
                assert.equal(activationAction.maneuverKey(), Maneuver.BANK_LEFT_2_STANDARD);

                done();
            }, delay);
        });

        QUnit.test("doIt() TIE/x7", function(assert)
        {
            // Setup.
            var upgradeKey = UpgradeCard.TIE_X7;
            var action = createActivationAction(upgradeKey);

            // Run.
            var done = assert.async();
            action.doIt();

            // Verify.
            setTimeout(function()
            {
                assert.ok(true, "test resumed from async operation");

                var environment = action.environment();
                var token = action.token();
                assert.ok(token.evadeCount(), 1);

                done();
            }, delay);
        });

        QUnit.test("doIt() X-Wing", function(assert)
        {
            // Setup.
            var environment = EnvironmentFactory.createCoreSetEnvironment();
            var adjudicator = new Adjudicator();
            var token = environment.tokens()[2]; // X-Wing
            var maneuverKey = Maneuver.STRAIGHT_1_STANDARD;
            var callback = function()
            {
                LOGGER.info("callback() start");
            };
            var action = new ActivationAction(environment, adjudicator, token, maneuverKey, callback);
            var position = environment.getPositionFor(token);
            assert.equal(position.x(), 458);
            assert.equal(position.y(), 895);
            assert.equal(position.heading(), 270);

            // Run.
            var done = assert.async();
            action.doIt();

            // Verify.
            setTimeout(function()
            {
                assert.ok(true, "test resumed from async operation");

                // Execute maneuver.
                var position = environment.getPositionFor(token);
                assert.equal(position.x(), 458);
                assert.equal(position.y(), 895 - (2 * 20 + 1 * 40));
                assert.equal(position.heading(), 270);

                // Check pilot stress.
                assert.ok(!token.isStressed());
                assert.equal(token.stressCount(), 0);

                // Perform action.
                assert.equal(token.focusCount(), 1);

                done();
            }, delay);
        });

        QUnit.test("doIt() X-Wing K-turn", function(assert)
        {
            // Setup.
            var environment = EnvironmentFactory.createCoreSetEnvironment();
            var adjudicator = new Adjudicator();
            var token = environment.tokens()[2]; // X-Wing
            var maneuverKey = Maneuver.KOIOGRAN_TURN_4_HARD;
            var callback = function()
            {
                LOGGER.info("callback() start");
            };
            var action = new ActivationAction(environment, adjudicator, token, maneuverKey, callback);
            var position = environment.getPositionFor(token);
            assert.equal(position.x(), 458);
            assert.equal(position.y(), 895);
            assert.equal(position.heading(), 270);

            // Run.
            var done = assert.async();
            action.doIt();

            // Verify.
            setTimeout(function()
            {
                assert.ok(true, "test resumed from async operation");

                // Execute maneuver.
                var position = environment.getPositionFor(token);
                assert.equal(position.x(), 458);
                assert.equal(position.y(), 895 - (2 * 20 + 4 * 40));
                assert.equal(position.heading(), 90);

                // Check pilot stress.
                assert.ok(token.isStressed());
                assert.equal(token.stressCount(), 1);

                // Perform action.
                assert.equal(token.focusCount(), 0);

                done();
            }, 600);
        });

        QUnit.test("doIt() Huge", function(assert)
        {
            // Setup.
            var squadBuilder1 = SquadBuilder.HugeShipImperialSquadBuilder;
            var squadBuilder2 = SquadBuilder.HugeShipRebelSquadBuilder;
            var agent1 = new SimpleAgent("1", squadBuilder1.faction());
            var agent2 = new SimpleAgent("2", squadBuilder2.faction());
            var squad1 = squadBuilder1.buildSquad(agent1);
            var squad2 = squadBuilder2.buildSquad(agent2);
            var store = Redux.createStore(Reducer.root);
            var environment = new Environment(store, agent1.teamKey(), agent2.teamKey());
            environment.placeInitialTokens(agent1, squad1, agent2, squad2);
            var adjudicator = new Adjudicator();
            var token = environment.tokens()[0]; // Gozanti-class Cruiser
            var maneuverKey = Maneuver.STRAIGHT_1_3;
            var callback = function()
            {
                LOGGER.info("callback() start");
            };
            var action = new ActivationAction(environment, adjudicator, token, maneuverKey, callback);
            var position = environment.getPositionFor(token);
            assert.equal(position.x(), 458);
            assert.equal(position.y(), 96);
            assert.equal(position.heading(), 90);
            assert.equal(token.energyCount(), 4);
            store.dispatch(Action.addEnergyCount(token, -2));
            assert.equal(token.energyCount(), 2);

            // Run.
            var done = assert.async();
            action.doIt();

            // Verify.
            setTimeout(function()
            {
                assert.ok(true, "test resumed from async operation");

                // Execute maneuver.
                var position = environment.getPositionFor(token);
                assert.equal(position.x(), 458);
                assert.equal(position.y(), 96 + (1 * 40));
                assert.equal(position.heading(), 90);

                // Check pilot stress.
                assert.ok(!token.isStressed());
                assert.equal(token.stressCount(), 0);

                // Gain energy.
                assert.equal(token.energyCount(), 4);

                // Perform action.
                assert.equal(token.focusCount(), 0);

                done();
            }, delay);
        });

        QUnit.test("doIt() Lambda-class Shuttle stationary", function(assert)
        {
            // Setup.
            var squadBuilder1 = SquadBuilder.findByNameAndYear("World #4", 2015);
            var squadBuilder2 = SquadBuilder.findByNameAndYear("World #1", 2015);
            var agent1 = new SimpleAgent("1", squadBuilder1.faction());
            var agent2 = new SimpleAgent("2", squadBuilder2.faction());
            var squad1 = squadBuilder1.buildSquad(agent1);
            var squad2 = squadBuilder2.buildSquad(agent2);
            var store = Redux.createStore(Reducer.root);
            var environment = new Environment(store, agent1.teamKey(), agent2.teamKey());
            environment.placeInitialTokens(agent1, squad1, agent2, squad2);
            var adjudicator = new Adjudicator();
            var token = environment.tokens()[2]; // Lambda-class Shuttle
            var maneuverKey = Maneuver.STATIONARY_0_HARD;
            var callback = function()
            {
                LOGGER.info("callback() start");
            };
            var action = new ActivationAction(environment, adjudicator, token, maneuverKey, callback);
            var position = environment.getPositionFor(token);
            assert.equal(position.x(), 686);
            assert.equal(position.y(), 40);
            assert.equal(position.heading(), 90);

            // Run.
            var done = assert.async();
            action.doIt();

            // Verify.
            setTimeout(function()
            {
                assert.ok(true, "test resumed from async operation");

                // Execute maneuver.
                var position = environment.getPositionFor(token);
                assert.equal(position.x(), 686);
                assert.equal(position.y(), 40);
                assert.equal(position.heading(), 90);

                // Check pilot stress.
                assert.ok(token.isStressed());
                assert.equal(token.stressCount(), 1);

                // Perform action.
                assert.equal(token.focusCount(), 0);

                done();
            }, 600);
        });

        function createActivationAction(upgradeKey, maneuverKey)
        {
            var store = Redux.createStore(Reducer.root);
            var environment = new Environment(store, Team.IMPERIAL, Team.REBEL);
            var adjudicator = new Adjudicator();

            var rebelAgent = new SimpleAgent("Rebel Agent", Team.REBEL);
            rebelAgent.chooseAbility = function(environment, pilotKeys, upgradeKeys, callback)
            {
                var pilotKey;
                var upgradeKey = (upgradeKeys.length > 0 ? upgradeKeys[0] : undefined);
                var isAccepted = (upgradeKey !== undefined);

                callback(pilotKey, upgradeKey, isAccepted);
            };

            var token = new Token(store, Pilot.DASH_RENDAR, rebelAgent, [upgradeKey]);
            var tokenPosition = new Position(458, 895, -90);

            environment.placeToken(tokenPosition, token);
            environment.activeToken(token);

            store.dispatch(Action.setEnvironment(environment));
            store.dispatch(Action.addFocusCount(token));

            var myManeuverKey = (maneuverKey !== undefined ? maneuverKey : Maneuver.STRAIGHT_3_STANDARD);

            var callback = function()
            {
                LOGGER.info("callback() start");
            };

            return new ActivationAction(environment, adjudicator, token, myManeuverKey, callback);
        }
    });

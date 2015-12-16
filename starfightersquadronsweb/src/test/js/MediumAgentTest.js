define([ "Adjudicator", "Environment", "Maneuver", "MediumAgent", "Position", "SquadBuilder", "Team", "Token" ],
        function(Adjudicator, Environment, Maneuver, MediumAgent, Position, SquadBuilder, Team, Token)
        {
            QUnit.module("MediumAgent");

            QUnit.test("properties", function(assert)
            {
                // Setup.
                var result = new MediumAgent("myAgent", "myTeam", "mySquadBuilder");

                // Run / Verify.
                assert.equal(result.getName(), "myAgent");
                assert.equal(result.getTeam(), "myTeam");
                assert.equal(result.getSquadBuilder(), "mySquadBuilder");
            });

            QUnit.test("buildSquad() Imperial", function(assert)
            {
                // Setup.
                var agent = new MediumAgent("myAgent", Team.IMPERIAL, SquadBuilder.CoreSetImperialSquadBuilder);
                Token.resetNextId();

                // Run.
                var result = agent.buildSquad();

                // Verify.
                assert.ok(result);
                assert.equal(result.length, 2);
                assert.equal(result[0].getName(), "1 \"Mauler Mithel\" (TIE Fighter)");
                assert.equal(result[1].getName(), "2 \"Dark Curse\" (TIE Fighter)");
            });

            QUnit.test("buildSquad() Rebel", function(assert)
            {
                // Setup.
                var agent = new MediumAgent("myAgent", Team.REBEL, SquadBuilder.CoreSetRebelSquadBuilder);
                Token.resetNextId();

                // Run.
                var result = agent.buildSquad();

                // Verify.
                assert.ok(result);
                assert.equal(result.length, 1);
                assert.equal(result[0].getName(), "1 Luke Skywalker (X-Wing)");
            });

            QUnit.test("chooseWeaponAndDefender() Imperial", function(assert)
            {
                // Setup.
                var environment = Environment.createCoreSetEnvironment();
                var adjudicator = new Adjudicator();
                var name = "myAgent";
                var team = Team.IMPERIAL;
                var squadBuilder = SquadBuilder.CoreSetImperialSquadBuilder;
                var agent = new MediumAgent(name, team, squadBuilder);

                var oldPosition0 = new Position(305, 20, 90);
                var token0 = environment.getTokenAt(oldPosition0);
                var position0 = new Position(458, 795, 90);
                environment.removeToken(oldPosition0);
                environment.placeToken(position0, token0);

                var position1 = new Position(610, 20, 90);
                var token1 = environment.getTokenAt(position1);

                var position2 = new Position(458, 895, -90);
                var token2 = environment.getTokenAt(position2);

                LOGGER.debug("token0 = " + token0);
                LOGGER.debug("token1 = " + token1);
                LOGGER.debug("token2 = " + token2);

                var result;
                var caller = {};
                function callback(weapon, defender)
                {
                    LOGGER.debug("callback() weapon = " + weapon + " defender = " + defender);

                    // Verify.
                    assert.ok(weapon);
                    assert.equal(weapon, token0.getPrimaryWeapon());
                    assert.ok(defender);
                    assert.equal(defender, token2);
                }

                // Run.
                agent.chooseWeaponAndDefender(environment, adjudicator, token0, callback);
            });

            QUnit.test("getPlanningAction() Imperial", function(assert)
            {
                // Setup.
                var environment = Environment.createCoreSetEnvironment("MediumAgent");
                var adjudicator = new Adjudicator();
                var agent = new MediumAgent("myAgent", Team.IMPERIAL, SquadBuilder.CoreSetImperialSquadBuilder);

                var position0 = new Position(305, 20, 90);
                var token0 = environment.getTokenAt(position0);

                var position1 = new Position(610, 20, 90);
                var token1 = environment.getTokenAt(position1);

                var position2 = new Position(458, 895, -90);
                var token2 = environment.getTokenAt(position2);

                var result;
                var caller = {};
                function callback(planningAction)
                {
                    LOGGER.debug("callback()");
                    result = planningAction;

                    // Verify.
                    assert.ok(result);
                    assert.ok(result.getManeuver(token0));
                    assert.ok(result.getManeuver(token1));
                    assert.ok(!result.getManeuver(token2));
                }

                // Run.
                agent.getPlanningAction(environment, adjudicator, callback);
            });

            QUnit.test("getPlanningAction() Rebel", function(assert)
            {
                // Setup.
                var environment = Environment.createCoreSetEnvironment();
                var adjudicator = new Adjudicator();
                var name = "myAgent";
                var team = Team.REBEL;
                var squadBuilder = SquadBuilder.CoreSetRebelSquadBuilder;
                var agent = new MediumAgent(name, team, squadBuilder);

                var position0 = new Position(305, 20, 90);
                var token0 = environment.getTokenAt(position0);
                var maneuver0 = Maneuver.STRAIGHT_1_STANDARD;

                var position1 = new Position(610, 20, 90);
                var token1 = environment.getTokenAt(position1);
                var maneuver1 = Maneuver.STRAIGHT_1_STANDARD;

                var position2 = new Position(458, 895, -90);
                var token2 = environment.getTokenAt(position2);
                var maneuver2 = Maneuver.STRAIGHT_1_STANDARD;

                var result;
                var caller = {};
                function callback(planningAction)
                {
                    LOGGER.debug("callback()");
                    result = planningAction;

                    // Verify.
                    assert.ok(result);
                    assert.ok(!result.getManeuver(token0));
                    assert.ok(!result.getManeuver(token1));
                    assert.ok(result.getManeuver(token2), maneuver2);
                }

                // Run.
                agent.getPlanningAction(environment, adjudicator, callback);
            });

            QUnit.test("getPlanningAction() Rebel 2", function(assert)
            {
                // Setup.
                var environment = Environment.createCoreSetEnvironment();
                var adjudicator = new Adjudicator();
                var agent = new MediumAgent("myAgent", Team.REBEL, SquadBuilder.CoreSetRebelSquadBuilder);

                var oldPosition = new Position(458, 895, -90);
                var newPosition = new Position(20, 110, -90);
                var token = environment.getTokenAt(oldPosition);
                environment.removeToken(oldPosition);
                environment.placeToken(newPosition, token);

                function callback(planningAction)
                {
                    // Verify.
                    assert.ok(planningAction);
                    assert.ok(planningAction.getManeuver(token));
                    assert.equal(planningAction.getManeuver(token), Maneuver.TURN_RIGHT_2_STANDARD);
                }

                // Run.
                agent.getPlanningAction(environment, adjudicator, callback);
            });

            QUnit.test("toString()", function(assert)
            {
                // Setup.
                var agent = new MediumAgent("myAgent", Team.IMPERIAL, SquadBuilder.CoreSetImperialSquadBuilder);

                // Run.
                var result = agent.toString();

                // Verify.
                assert.ok(result);
                assert.equal(result, "myAgent, MediumAgent, imperial, Imperial Core Set: 36 Points");
            });
        });
define([ "Environment", "Phase", "Pilot", "Position", "Range", "Ship", "SimpleAgent", "Team", "Token" ], function(
        Environment, Phase, Pilot, Position, Range, Ship, SimpleAgent, Team, Token)
{
    QUnit.module("Environment");

    QUnit.test("getDefenders()", function(assert)
    {
        // Setup.
        Token.resetNextId();
        var environment = Environment.createCoreSetEnvironment();
        var attackerPosition = new Position(458, 895, -90);
        var attacker = environment.getTokenAt(attackerPosition); // X-Wing
        var weapon = attacker.getPrimaryWeapon();

        // Run.
        var result = environment.getDefenders(attacker.getTeam());

        // Verify.
        assert.ok(result);
        assert.equal(result.length, 2);
    });

    QUnit.test("getPositionFor()", function(assert)
    {
        Token.resetNextId();
        var position = new Position(1, 2, 3);
        var environment = Environment.createCoreSetEnvironment();
        var agent = environment.getFirstAgent();
        var token = new Token(Pilot.ACADEMY_PILOT, agent);
        environment.placeToken(position, token);

        assert.strictEqual(environment.getPositionFor(token), position);
    });

    QUnit.test("getTargetableDefenders() none", function(assert)
    {
        // Setup.
        Token.resetNextId();
        var environment = Environment.createCoreSetEnvironment();
        var attackerPosition = new Position(458, 895, -90);
        var attacker = environment.getTokenAt(attackerPosition);
        var weapon = attacker.getPrimaryWeapon();

        // Run.
        var result = environment.getTargetableDefenders(attacker, attackerPosition, weapon);

        // Verify.
        assert.ok(result);
        assert.equal(result.length, 0);
    });

    QUnit.test("getTargetableDefenders() one", function(assert)
    {
        // Setup.
        Token.resetNextId();
        var environment = Environment.createCoreSetEnvironment();
        var attackerPosition = new Position(458, 895, -90);
        var attacker = environment.getTokenAt(attackerPosition);
        environment.removeToken(attackerPosition);
         attackerPosition = new Position(305, 70, -90);
        environment.placeToken(attackerPosition, attacker);
        var weapon = attacker.getPrimaryWeapon();

        // Run.
        var result = environment.getTargetableDefenders(attacker, attackerPosition, weapon);

        // Verify.
        assert.ok(result);
        assert.equal(result.length, 1);
    });

    QUnit.test("getTargetableDefendersAtRange() none", function(assert)
    {
        // Setup.
        Token.resetNextId();
        var environment = Environment.createCoreSetEnvironment();
        var attackerPosition = new Position(458, 895, -90);
        var attacker = environment.getTokenAt(attackerPosition);
        var weapon = attacker.getPrimaryWeapon();

        // Run.
        var result = environment.getTargetableDefendersAtRange(attacker, attackerPosition, weapon, Range.ONE);

        // Verify.
        assert.ok(result);
        assert.equal(result.length, 0);
    });

    QUnit.test("getTargetableDefendersAtRange() one", function(assert)
    {
        // Setup.
        Token.resetNextId();
        var environment = Environment.createCoreSetEnvironment();
        var attackerPosition = new Position(458, 895, -90);
        var attacker = environment.getTokenAt(attackerPosition);
        environment.removeToken(attackerPosition);
         attackerPosition = new Position(305, 70, -90);
        environment.placeToken(attackerPosition, attacker);
        var weapon = attacker.getPrimaryWeapon();

        // Run.
        var result = environment.getTargetableDefendersAtRange(attacker, attackerPosition, weapon, Range.ONE);

        // Verify.
        assert.ok(result);
        assert.equal(result.length, 1);
    });

    QUnit.test("getTokenAt()", function(assert)
    {
        Token.resetNextId();
        var position = new Position(1, 2, 3);
        var environment = Environment.createCoreSetEnvironment();
        var agent = environment.getFirstAgent();
        var token = new Token(Pilot.ACADEMY_PILOT, agent);
        environment.placeToken(position, token);

        assert.strictEqual(environment.getTokenAt(position), token);
    });

    QUnit.test("getTokenAt() 1", function(assert)
    {
        Token.resetNextId();
        var position = new Position(305, 20, 90);
        var environment = Environment.createCoreSetEnvironment();

        var token = environment.getTokenAt(position);
        assert.strictEqual(token.getPilot(), Pilot.MAULER_MITHEL);
    });

    QUnit.test("getTokenAt() 2", function(assert)
    {
        Token.resetNextId();
        var position = new Position(610, 20, 90);
        var environment = Environment.createCoreSetEnvironment();

        var token = environment.getTokenAt(position);
        assert.strictEqual(token.getPilot(), Pilot.DARK_CURSE);
    });

    QUnit.test("getTokenAt() 3", function(assert)
    {
        Token.resetNextId();
        var position = new Position(458, 895, -90);
        var environment = Environment.createCoreSetEnvironment();

        var token = environment.getTokenAt(position);
        assert.strictEqual(token.getPilot(), Pilot.LUKE_SKYWALKER);
    });

    QUnit.test("getTokenCountFor()", function(assert)
    {
        Token.resetNextId();
        var environment = Environment.createCoreSetEnvironment();

        assert.strictEqual(environment.getTokenCountFor(Team.IMPERIAL), 2);
        assert.strictEqual(environment.getTokenCountFor(Team.REBEL), 1);
    });

    QUnit.test("getTokens()", function(assert)
    {
        Token.resetNextId();
        var environment = Environment.createCoreSetEnvironment();

        var tokens = environment.getTokens();
        assert.equal(tokens.length, 3);
        assert.equal(tokens[0].getPilot(), Pilot.MAULER_MITHEL);
        assert.equal(tokens[1].getPilot(), Pilot.DARK_CURSE);
        assert.equal(tokens[2].getPilot(), Pilot.LUKE_SKYWALKER);
    });

    QUnit.test("getTokensForActivation()", function(assert)
    {
        // Setup.
        Token.resetNextId();
        var environment = Environment.createCoreSetEnvironment();

        // Run.
        var result = environment.getTokensForActivation();

        // Verify.
        assert.ok(result);
        assert.equal(result.length, 3);
        {
            var token = result[0];
            assert.equal(token.getId(), 2);
            assert.equal(token.getPilot(), Pilot.DARK_CURSE);
        }
        {
            var token = result[1];
            assert.equal(token.getId(), 1);
            assert.equal(token.getPilot(), Pilot.MAULER_MITHEL);
        }
        {
            var token = result[2];
            assert.equal(token.getId(), 3);
            assert.equal(token.getPilot(), Pilot.LUKE_SKYWALKER);
        }
    });

    QUnit.test("getTokensForCombat()", function(assert)
    {
        // Setup.
        Token.resetNextId();
        var environment = Environment.createCoreSetEnvironment();

        // Run.
        var result = environment.getTokensForCombat();

        // Verify.
        assert.ok(result);
        assert.equal(result.length, 3);
        {
            var token = result[0];
            assert.equal(token.getId(), 3);
            assert.equal(token.getPilot(), Pilot.LUKE_SKYWALKER);
        }
        {
            var token = result[1];
            assert.equal(token.getId(), 1);
            assert.equal(token.getPilot(), Pilot.MAULER_MITHEL);
        }
        {
            var token = result[2];
            assert.equal(token.getId(), 2);
            assert.equal(token.getPilot(), Pilot.DARK_CURSE);
        }
    });

    QUnit.test("getTokensForTeam() Imperial", function(assert)
    {
        // Setup.
        Token.resetNextId();
        var environment = Environment.createCoreSetEnvironment();

        // Run.
        var result = environment.getTokensForTeam(Team.IMPERIAL);

        // Verify.
        assert.ok(result);
        assert.equal(result.length, 2);
        assert.equal(result[0].getPilot(), Pilot.MAULER_MITHEL);
        assert.equal(result[1].getPilot(), Pilot.DARK_CURSE);
    });

    QUnit.test("getTokensForTeam() Rebel", function(assert)
    {
        // Setup.
        Token.resetNextId();
        var environment = Environment.createCoreSetEnvironment();

        // Run.
        var result = environment.getTokensForTeam(Team.REBEL);

        // Verify.
        assert.ok(result);
        assert.equal(result.length, 1);
        assert.equal(result[0].getPilot(), Pilot.LUKE_SKYWALKER);
    });

    QUnit.test("getTokensTouching()", function(assert)
    {
        // Setup.
        Token.resetNextId();
        var environment = Environment.createCoreSetEnvironment();
        var fromPosition0 = new Position(305, 20, 90);
        var token0 = environment.getTokenAt(fromPosition0); // TIE Fighter 1
        var position1 = new Position(610, 20, 90);
        var token1 = environment.getTokenAt(position1); // TIE Fighter 2
        var fromPosition2 = new Position(458, 895, -90);
        var token2 = environment.getTokenAt(fromPosition2); // X-Wing
        environment.removeToken(fromPosition2);
        fromPosition2 = new Position(fromPosition0.getX(), fromPosition0.getY() + 39, -90);
        environment.placeToken(fromPosition2, token2);
        environment.getTokens().forEach(function(token)
        {
            LOGGER.debug(token.toString() + " at " + environment.getPositionFor(token));
        });

        // Run.
        var result = environment.getTokensTouching(token0);

        // Verify.
        assert.ok(result);
        assert.equal(result.length, 1);
        assert.equal(result[0].getShip(), Ship.X_WING);
    });

    QUnit.test("incrementRound()", function(assert)
    {
        // Setup.
        Token.resetNextId();
        var environment = Environment.createCoreSetEnvironment();
        assert.equal(environment.getRound(), 0);

        // Run.
        environment.incrementRound();

        // Verify.
        assert.equal(environment.getRound(), 1);
    });

    QUnit.test("placeToken()", function(assert)
    {
        // Setup.
        Token.resetNextId();
        var position = new Position(1, 2, 3);
        var environment = Environment.createCoreSetEnvironment();
        var agent = environment.getFirstAgent();
        var token = new Token(Pilot.ACADEMY_PILOT, agent);

        // Run.
        environment.placeToken(position, token);

        // Verify.
        assert.strictEqual(environment.getPositionFor(token), position);
        assert.strictEqual(environment.getTokenAt(position), token);
    });

    QUnit.test("removeToken()", function(assert)
    {
        // Setup.
        Token.resetNextId();
        var position = new Position(1, 2, 3);
        var environment = Environment.createCoreSetEnvironment();
        var agent = environment.getFirstAgent();
        var token = new Token(Pilot.ACADEMY_PILOT, agent);
        environment.placeToken(position, token);
        assert.strictEqual(environment.getPositionFor(token), position);
        assert.strictEqual(environment.getTokenAt(position), token);

        // Run.
        environment.removeToken(position);

        // Verify.
        assert.strictEqual(environment.getPositionFor(token), undefined);
        assert.strictEqual(environment.getTokenAt(position), undefined);
    });

    QUnit.test("setPhase()", function(assert)
    {
        // Setup.
        Token.resetNextId();
        var environment = Environment.createCoreSetEnvironment();

        // Run.
        environment.setPhase(Phase.ACTIVATION_REVEAL_DIAL);

        // Verify.
        assert.equal(environment.getPhase(), Phase.ACTIVATION_REVEAL_DIAL);
    });

    QUnit.test("toString()", function(assert)
    {
        // Setup.
        Token.resetNextId();
        var environment = Environment.createCoreSetEnvironment();

        // Run / Verify.
        assert.equal(environment.toString(), "(305, 20, 90) 1 \"Mauler Mithel\" (TIE Fighter)\n"
                + "(610, 20, 90) 2 \"Dark Curse\" (TIE Fighter)\n" + "(458, 895, 270) 3 Luke Skywalker (X-Wing)\n");
    });
});
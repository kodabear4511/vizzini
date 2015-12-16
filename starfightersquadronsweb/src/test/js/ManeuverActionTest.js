define([ "Environment", "Maneuver", "ManeuverAction", "Position", "Token" ], function(Environment, Maneuver,
        ManeuverAction, Position, Token)
{
    QUnit.module("ManeuverAction");

    QUnit.test("ManeuverAction.doIt() Straight1Easy", function(assert)
    {
        // Setup.
        Token.resetNextId();
        var environment = Environment.createCoreSetEnvironment();
        var maneuver = Maneuver.STRAIGHT_1_EASY;
        var fromPosition = new Position(458, 895, -90); // X-Wing
        var token = environment.getTokenAt(fromPosition);
        assert.ok(token);
        environment.removeToken(fromPosition);
        fromPosition = new Position(fromPosition.getX(), fromPosition.getY(), -30);
        environment.placeToken(fromPosition, token);

        var shipBase = token.getShipBase();
        var maneuverAction = new ManeuverAction(environment, maneuver, fromPosition, shipBase);

        // Run.
        maneuverAction.doIt();

        // Verify.
        var toPosition = environment.getPositionFor(token);
        assert.equal(toPosition.getX(), fromPosition.getX() + 69);
        assert.equal(toPosition.getY(), fromPosition.getY() - 40);
        assert.equal(toPosition.getHeading(), 330);
    });

    QUnit.test("ManeuverAction.doIt() Straight3Standard", function(assert)
    {
        // Setup.
        Token.resetNextId();
        var environment = Environment.createCoreSetEnvironment();
        var maneuver = Maneuver.STRAIGHT_3_STANDARD;
        var fromPosition = new Position(458, 895, -90); // X-Wing
        var token = environment.getTokenAt(fromPosition);
        assert.ok(token);
        environment.removeToken(fromPosition);
        fromPosition = new Position(fromPosition.getX(), fromPosition.getY(), -30);
        environment.placeToken(fromPosition, token);

        var shipBase = token.getShipBase();
        var maneuverAction = new ManeuverAction(environment, maneuver, fromPosition, shipBase);

        // Run.
        maneuverAction.doIt();

        // Verify.
        var toPosition = environment.getPositionFor(token);
        assert.equal(toPosition.getX(), fromPosition.getX() + 139);
        assert.equal(toPosition.getY(), fromPosition.getY() - 80);
        assert.equal(toPosition.getHeading(), 330);
    });

    QUnit.test("ManeuverAction.doIt() Straight3Standard collision", function(assert)
    {
        // Setup.
        Token.resetNextId();
        var environment = Environment.createCoreSetEnvironment();

        var fromPosition0 = new Position(305, 20, 90);
        var token0 = environment.getTokenAt(fromPosition0); // TIE Fighter
        assert.ok(token0);

        var maneuver = Maneuver.STRAIGHT_3_STANDARD;
        var fromPosition2 = new Position(458, 895, -90);
        var token2 = environment.getTokenAt(fromPosition2); // X-Wing
        assert.ok(token2);
        environment.removeToken(fromPosition2);
        fromPosition2 = new Position(fromPosition2.getX(), fromPosition2.getY(), -30);
        environment.placeToken(fromPosition2, token2);

        // Move token0 to token1's planned toPosition.
        fromPosition0 = new Position(fromPosition2.getX() + 139, fromPosition2.getY() - 80, 90);
        environment.placeToken(fromPosition0, token0);

        var shipBase = token2.getShipBase();
        var maneuverAction = new ManeuverAction(environment, maneuver, fromPosition2, shipBase);

        // Run.
        maneuverAction.doIt();

        // Verify.
        var toPosition = environment.getPositionFor(token2);
        assert.equal(toPosition.getX(), fromPosition2.getX() + 95);
        assert.equal(toPosition.getY(), fromPosition2.getY() - 55);
        assert.equal(toPosition.getHeading(), 330);
    });
});
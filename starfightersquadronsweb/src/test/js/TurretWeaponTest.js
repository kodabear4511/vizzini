define([ "Environment", "Position", "Range", "Token", "TurretWeapon" ], function(Environment, Position, Range, Token,
        TurretWeapon)
{
    QUnit.module("TurretWeapon");

    QUnit.test("TurretWeapon properties", function(assert)
    {
        // Setup.
        var weapon = new TurretWeapon("myWeapon", true, 12, [ Range.TWO, Range.THREE ]);

        // Run / Verify.
        assert.equal(weapon.getName(), "myWeapon");
        assert.equal(weapon.isPrimary(), true);
        assert.equal(weapon.getWeaponValue(), 12);
        var ranges = weapon.getRanges();
        assert.equal(ranges.length, 2);
        assert.equal(ranges[0], Range.TWO);
        assert.equal(ranges[1], Range.THREE);
    });

    QUnit.test("isDefenderInRange() range one", function(assert)
    {
        // Setup.
        Token.resetNextId();
        var environment = Environment.createCoreSetEnvironment();
        var attackerPosition = new Position(458, 895, -90);
        var attacker = environment.getTokenAt(attackerPosition);
        assert.ok(attacker);
        var defenderPosition = new Position(305, 20, 90);
        var defender = environment.getTokenAt(defenderPosition);
        environment.removeToken(attackerPosition);
        attackerPosition = new Position(defenderPosition.getX(), defenderPosition.getY() + 50, -90);
        environment.placeToken(attackerPosition, attacker);
        var weapon = new TurretWeapon("myWeapon", true, 12, [ Range.ONE, Range.TWO ]);

        // Run.
        var result = weapon.isDefenderInRange(attacker, attackerPosition, defender, defenderPosition);

        // Verify.
        assert.ok(result);
    });

    QUnit.test("isDefenderVulnerable() range one", function(assert)
    {
        // Setup.
        Token.resetNextId();
        var environment = Environment.createCoreSetEnvironment();
        var attackerPosition = new Position(458, 895, -90);
        var attacker = environment.getTokenAt(attackerPosition);
        assert.ok(attacker);
        var defenderPosition = new Position(305, 20, 90);
        var defender = environment.getTokenAt(defenderPosition);
        environment.removeToken(attackerPosition);
        attackerPosition = new Position(defenderPosition.getX(), defenderPosition.getY() + 50, -90);
        environment.placeToken(attackerPosition, attacker);
        var weapon = new TurretWeapon("myWeapon", true, 12, [ Range.ONE, Range.TWO ]);

        // Run.
        var result = weapon.isDefenderVulnerable(attacker, attackerPosition, defender, defenderPosition);

        // Verify.
        assert.ok(result);
    });

    QUnit.test("isDefenderVulnerable() rotated", function(assert)
    {
        // Setup.
        Token.resetNextId();
        var environment = Environment.createCoreSetEnvironment();
        var attackerPosition = new Position(458, 895, -90);
        var attacker = environment.getTokenAt(attackerPosition);
        assert.ok(attacker);
        var defenderPosition = new Position(305, 20, 90);
        var defender = environment.getTokenAt(defenderPosition);
        environment.removeToken(attackerPosition);
        attackerPosition = new Position(defenderPosition.getX(), defenderPosition.getY() + 50, 0);
        environment.placeToken(attackerPosition, attacker);
        var weapon = new TurretWeapon("myWeapon", true, 12, [ Range.ONE, Range.TWO ]);

        // Run.
        var result = weapon.isDefenderVulnerable(attacker, attackerPosition, defender, defenderPosition);

        // Verify.
        assert.ok(result);
    });

    QUnit.test("isDefenderTargetable() range one", function(assert)
    {
        // Setup.
        Token.resetNextId();
        var environment = Environment.createCoreSetEnvironment();
        var attackerPosition = new Position(458, 895, -90);
        var attacker = environment.getTokenAt(attackerPosition);
        assert.ok(attacker);
        var defenderPosition = new Position(305, 20, 90);
        var defender = environment.getTokenAt(defenderPosition);
        environment.removeToken(attackerPosition);
        attackerPosition = new Position(defenderPosition.getX(), defenderPosition.getY() + 50, -90);
        environment.placeToken(attackerPosition, attacker);
        var weapon = new TurretWeapon("myWeapon", true, 12, [ Range.ONE, Range.TWO ]);

        // Run.
        var result = weapon.isDefenderTargetable(attacker, attackerPosition, defender, defenderPosition);

        // Verify.
        assert.ok(result);
    });

    QUnit.test("toString()", function(assert)
    {
        // Setup.
        var weapon = new TurretWeapon("myWeapon", true, 12, [ Range.TWO, Range.THREE ]);

        // Run / Verify.
        assert.equal(weapon.toString(), "myWeapon");
    });
});

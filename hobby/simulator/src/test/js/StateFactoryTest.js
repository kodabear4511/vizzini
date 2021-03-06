define([ "Body", "StateFactory" ], function(Body, StateFactory)
{
    "use strict";
    QUnit.module("StateFactory");

    QUnit.test("Reference.createStates()", function(assert)
    {
        // Run.
        var result = StateFactory.Reference.createStates();

        // Verify.
        assert.ok(result);
        var solState = result[Body.SOL];
        verifyVector(assert, solState.position(), 561524.6657, 231553.661, -24203.0858);
        verifyQuaternion(assert, solState.orientation(), 0.974114, 0.217157, 0.062802, 0.0);
        verifyVector(assert, solState.velocity(), 0.0011, 0.012, 0.0);
        verifyQuaternion(assert, solState.angularVelocity(), 1.0, 0.0, -0.000001, 0.000001);

        var earthState = result[Body.EARTH];
        verifyVector(assert, earthState.position(), -75613579.1947, 126206909.8272, -27995.6683);
        verifyQuaternion(assert, earthState.orientation(), 1.0, 0.0, 0.0, 0.0);
        verifyVector(assert, earthState.velocity(), -25.9625, -15.5125, 0.0004);
        verifyQuaternion(assert, earthState.angularVelocity(), 1.0, 0.0, 0.0, 0.000036);

        var lunaState = result[Body.LUNA];
        verifyVector(assert, lunaState.position(), -75651368.2263, 126584174.0843, -61031.2989);
        verifyQuaternion(assert, lunaState.orientation(), 1.0, 0.0, 0.0, 0.0);
        verifyVector(assert, lunaState.velocity(), -26.9966, -15.5789, 0.0178);
        verifyQuaternion(assert, lunaState.angularVelocity(), 1.0, 0.0, 0.0, 0.000001);
    });

    QUnit.test("StateFactory.createCircularOrbit()", function(assert)
    {
        // Setup.
        var states = StateFactory.Reference.createStates();
        var solState = states[Body.SOL];
        var parentKey = Body.EARTH;
        var parentState = states[parentKey];
        var distance = 2.0 * Body.properties[parentKey].equatorialRadius;

        // Run.
        var result = StateFactory.createCircularOrbit(solState, parentKey, parentState, distance);

        // Verify.
        assert.ok(result);
        verifyVector(assert, result.position(), -75606978.5976, 126195994.0223, -27995.3397);
        verifyQuaternion(assert, result.orientation(), 0.491203, 0.0, 0.000026, 0.871045);
        verifyVector(assert, result.velocity(), -21.1791, -12.6201, 0.0004);
        verifyQuaternion(assert, result.angularVelocity(), 1.0, 0.0, 0.0, 0.000219);
    });

    QUnit.test("StateFactory.createRelativeState()", function(assert)
    {
        // Setup.
        var states = StateFactory.Reference.createStates();
        var earthState = states[Body.EARTH];

        // Run.
        var result = StateFactory.createRelativeState(earthState, 42164, 3.0746);

        // Verify.
        assert.ok(result);
        verifyVector(assert, result.position(), -75571415.1947, 126206909.8272, -27995.6683);
        verifyVector(assert, result.velocity(), -25.9625, -12.4379, 0.0004);
    });
});

define([ "Quaternion", "Vector" ], function(Quaternion, Vector)
{
    "use strict";
    QUnit.module("Quaternion");

    QUnit.test("Quaternion()", function(assert)
    {
        // Setup / Run.
        var result = new Quaternion(1.0, 2.0, 3.0, 4.0);

        // Verify.
        assert.ok(result);
        assert.equal(Math.vizziniRound(result.magnitude(), 6), 5.477226);
        verifyQuaternion(assert, result, 1.0, 2.0, 3.0, 4.0);
    });

    QUnit.test("Quaternion() zeroes", function(assert)
    {
        // Special case for all zeroes.

        // Setup / Run.
        var result = new Quaternion(0.0, 0.0, 0.0, 0.0);

        // Verify.
        assert.ok(result);
        assert.equal(Math.vizziniRound(result.magnitude(), 6), 1.0);
        verifyQuaternion(assert, result, 1.0, 0.0, 0.0, 0.0);
    });

    QUnit.test("Quaternion.newInstance()", function(assert)
    {
        // Setup.
        var angle = 10.0;
        var v = new Vector(1.0, 2.0, 3.0);

        // Run.
        var result = Quaternion.newInstance(angle, v);

        // Verify.
        assert.equal(Math.vizziniRound(result.magnitude(), 6), 1.0);
        verifyQuaternion(assert, result, 0.996195, 0.023293, 0.046587, 0.06988);
        assert.equal(Math.vizziniRound(result.angle(), 6), angle);
        verifyVector(assert, result.vector(), 0.2673, 0.5345, 0.8018);

        // Run.
        result = Quaternion.newInstance(angle + 720.0, v);

        // Verify.
        assert.equal(Math.vizziniRound(result.magnitude(), 6), 1.0);
        verifyQuaternion(assert, result, 0.996195, 0.023293, 0.046587, 0.06988);

        // Run.
        result = Quaternion.newInstance(angle - 360.0, v);

        // Verify.
        assert.equal(Math.vizziniRound(result.magnitude(), 6), 1.0);
        verifyQuaternion(assert, result, 0.996195, 0.023293, 0.046587, 0.06988);
    });

    QUnit.test("Quaternion.newInstance() zero angle", function(assert)
    {
        // Setup.
        var angle = 0.0;
        var v = new Vector(1.0, 2.0, 3.0);

        // Run.
        var result = Quaternion.newInstance(angle, v);

        // Verify.
        verifyQuaternion(assert, result, 1.0, 0.0, 0.0, 0.0);
    });

    QUnit.test("Quaternion.newInstance() zero vector", function(assert)
    {
        // Setup.
        var angle = 10.0;
        var v = Vector.ZERO;

        // Run.
        var result = Quaternion.newInstance(angle, v);

        // Verify.
        verifyQuaternion(assert, result, 1.0, 0.0, 0.0, 0.0);
    });

    QUnit.test("Quaternion.newInstanceAzimuthElevation()", function(assert)
    {
        // Setup.
        var azimuth = 35.0;
        var elevation = 15.0;

        // Run.
        var result = Quaternion.newInstanceAzimuthElevation(azimuth, elevation);

        // Verify.
        assert.ok(result);
        assert.equal(Math.vizziniRound(result.magnitude(), 6), 1.0);
        verifyQuaternion(assert, result, 0.945558, 0.03925, -0.124485, 0.298133);
        var v = result.preMultiply(Vector.X_AXIS);
        verifyVector(assert, v, 0.7912, 0.5540, 0.2588);
    });

    QUnit.test("Quaternion.newInstanceAzimuthElevation() zero azimuth", function(assert)
    {
        // Setup.
        var azimuth = 0.0;
        var elevation = 15.0;

        // Run.
        var result = Quaternion.newInstanceAzimuthElevation(azimuth, elevation);

        // Verify.
        assert.ok(result);
        assert.equal(Math.vizziniRound(result.magnitude(), 6), 1.0);
        verifyQuaternion(assert, result, 0.991445, 0.0, -0.130526, 0.0);
        var v = result.preMultiply(Vector.X_AXIS);
        verifyVector(assert, v, 0.9659, 0.0, 0.2588);
    });

    QUnit.test("Quaternion.newInstanceAzimuthElevation() zero elevation", function(assert)
    {
        // Setup.
        var azimuth = 35.0;
        var elevation = 0.0;

        // Run.
        var result = Quaternion.newInstanceAzimuthElevation(azimuth, elevation);

        // Verify.
        assert.ok(result);
        assert.equal(Math.vizziniRound(result.magnitude(), 6), 1.0);
        verifyQuaternion(assert, result, 0.953717, 0.0, 0.0, 0.300706);
        var v = result.preMultiply(Vector.X_AXIS);
        verifyVector(assert, v, 0.8192, 0.5736, 0.0);
    });

    QUnit.test("Quaternion.newInstanceVector()", function(assert)
    {
        // Setup.
        var azimuth = 35.0;
        var elevation = 15.0;
        var q = Quaternion.newInstanceAzimuthElevation(azimuth, elevation);
        var vector = q.preMultiply(Vector.X_AXIS);

        // Run.
        var result = Quaternion.newInstanceVector(vector);

        // Verify.
        assert.ok(result);
        assert.equal(Math.vizziniRound(result.magnitude(), 6), 1.0);
        verifyQuaternion(assert, result, 0.793353, -0.349171, 0.498668, 0.0);
        var v = result.preMultiply(Vector.X_AXIS);
        verifyVector(assert, v, 0.5027, -0.3482, -0.7912);
    });

    QUnit.test("Quaternion.newInstanceVector() zero", function(assert)
    {
        // Setup.
        var vector = Vector.ZERO;

        // Run.
        var result = Quaternion.newInstanceVector(vector);

        // Verify.
        assert.ok(result);
        assert.equal(Math.vizziniRound(result.magnitude(), 6), 1.0);
        verifyQuaternion(assert, result, 1.0, 0.0, 0.0, 0.0);
        var v = result.preMultiply(Vector.X_AXIS);
        verifyVector(assert, v, 1.0, 0.0, 0.0);
    });

    QUnit.test("angle()", function(assert)
    {
        // Setup.
        var angle0 = 35.0;
        var angle1 = 75.0;
        var angle2 = 135.0;

        var q0 = Quaternion.newInstance(angle0, Vector.Z_AXIS);
        var q1 = Quaternion.newInstance(angle1, Vector.X_AXIS);
        var q2 = Quaternion.newInstance(angle2, Vector.Y_AXIS);

        // Run / Verify.
        assert.equal(Math.vizziniRound(q0.angle(), 4), angle0);
        assert.equal(Math.vizziniRound(q1.angle(), 4), angle1);
        assert.equal(Math.vizziniRound(q2.angle(), 4), angle2);
    });

    QUnit.test("azimuth() negative", function(assert)
    {
        // Setup.
        var azimuth = -35.0;
        var elevation = 15.0;
        var q = Quaternion.newInstanceAzimuthElevation(azimuth, elevation);

        // Run / Verify.
        assert.equal(Math.vizziniRound(q.azimuth(), 4), 325.0);
    });

    QUnit.test("azimuth() positive", function(assert)
    {
        // Setup.
        var azimuth = 35.0;
        var elevation = 15.0;
        var q = Quaternion.newInstanceAzimuthElevation(azimuth, elevation);

        // Run / Verify.
        assert.equal(Math.vizziniRound(q.azimuth(), 4), azimuth);
    });

    QUnit.test("elevation() negative", function(assert)
    {
        // Setup.
        var azimuth = 35.0;
        var elevation = -15.0;
        var q = Quaternion.newInstanceAzimuthElevation(azimuth, elevation);

        // Run / Verify.
        assert.equal(Math.vizziniRound(q.elevation(), 4), 345.0);
    });

    QUnit.test("elevation() positive", function(assert)
    {
        // Setup.
        var azimuth = 35.0;
        var elevation = 15.0;
        var q = Quaternion.newInstanceAzimuthElevation(azimuth, elevation);

        // Run / Verify.
        assert.equal(Math.vizziniRound(q.elevation(), 4), elevation);
    });

    QUnit.test("magnitude()", function(assert)
    {
        // Setup.
        var w = 10.0;
        var x = 5.0;
        var y = 7.0;
        var z = 9.0;
        var q = new Quaternion(w, x, y, z);

        // Run / Verify.
        assert.equal(Math.vizziniRound(q.magnitude(), 6), 15.968719);
    });

    QUnit.test("multiply()", function(assert)
    {
        // Setup.
        var angle0 = 35.0;
        var angle1 = 75.0;
        var angle2 = 135.0;

        var q0 = Quaternion.newInstance(angle0, Vector.Z_AXIS);
        var q1 = Quaternion.newInstance(angle1, Vector.X_AXIS);
        var q2 = Quaternion.newInstance(angle2, Vector.Y_AXIS);

        // Run.
        var q01 = q0.multiply(q1);

        // Verify.
        assert.ok(q01);
        verifyQuaternion(assert, q01, 0.756635, 0.580586, 0.183058, 0.238566);
        assert.equal(Math.vizziniRound(q01.magnitude(), 6), 1.0);
        assert.equal(Math.vizziniRound(q01.angle(), 6), 81.663206);
        verifyVector(assert, q01.vector(), 0.888, 0.28, 0.3649);
        assert.equal(Math.vizziniRound(q01.vector().magnitude(), 6), 1.0);
    });

    QUnit.test("multiply() identity", function(assert)
    {
        // Setup.
        var angle0 = 35.0;
        var angle1 = 75.0;
        var angle2 = 135.0;

        var q0 = Quaternion.newInstance(angle0, Vector.Z_AXIS);
        var q1 = Quaternion.newInstance(angle1, Vector.X_AXIS);
        var q2 = Quaternion.newInstance(angle2, Vector.Y_AXIS);

        // Run.
        var q00 = q0.multiply(Quaternion.ZERO);
        var q11 = q1.multiply(Quaternion.ZERO);
        var q22 = q2.multiply(Quaternion.ZERO);

        // Verify.
        assert.ok(q00);
        verifyQuaternion(assert, q00, Math.vizziniRound(q0.w(), 6), Math.vizziniRound(q0.x(), 6), Math.vizziniRound(q0
                .y(), 6), Math.vizziniRound(q0.z(), 6));
        assert.equal(Math.vizziniRound(q00.magnitude(), 6), 1.0);

        assert.ok(q11);
        verifyQuaternion(assert, q11, Math.vizziniRound(q1.w(), 6), Math.vizziniRound(q1.x(), 6), Math.vizziniRound(q1
                .y(), 6), Math.vizziniRound(q1.z(), 6));
        assert.equal(Math.vizziniRound(q11.magnitude(), 6), 1.0);

        assert.ok(q22);
        verifyQuaternion(assert, q22, Math.vizziniRound(q2.w(), 6), Math.vizziniRound(q2.x(), 6), Math.vizziniRound(q2
                .y(), 6), Math.vizziniRound(q2.z(), 6));
        assert.equal(Math.vizziniRound(q22.magnitude(), 6), 1.0);
    });

    QUnit.test("preMultiply() 0", function(assert)
    {
        // Setup.
        var angle0 = 35.0;
        var angle1 = 75.0;
        var angle2 = 135.0;

        var q0 = Quaternion.newInstance(angle0, Vector.Z_AXIS);
        var q1 = Quaternion.newInstance(angle1, Vector.X_AXIS);
        var q2 = Quaternion.newInstance(angle2, Vector.Y_AXIS);

        // Run / Verify.
        var v = q0.preMultiply(Vector.X_AXIS);
        verifyVector(assert, v, 0.8192, 0.5736, 0.0);

        v = q1.preMultiply(Vector.Y_AXIS);
        verifyVector(assert, v, 0.0, 0.2588, 0.9659);

        v = q2.preMultiply(Vector.Z_AXIS);
        verifyVector(assert, v, 0.7071, 0.0, -0.7071);

        v = q0.preMultiply(Vector.Z_AXIS);
        verifyVector(assert, v, 0.0, 0.0, 1.0);
    });

    QUnit.test("preMultiply() 1", function(assert)
    {
        // Setup.
        var q0 = Quaternion.newInstance(90.0, Vector.Z_AXIS);
        var q1 = Quaternion.newInstance(90.0, Vector.Y_AXIS);
        var q = q1.multiply(q0);

        // Run / Verify.
        var v = q.preMultiply(Vector.X_AXIS);
        verifyVector(assert, v, 0.0, 1.0, 0.0);

        v = q.preMultiply(Vector.Y_AXIS);
        verifyVector(assert, v, 0.0, 0.0, 1.0);

        v = q.preMultiply(Vector.Z_AXIS);
        verifyVector(assert, v, 1.0, 0.0, 0.0);
    });

    QUnit.test("postMultiply()", function(assert)
    {
        // Setup.
        var angle0 = 35.0;
        var angle1 = 75.0;
        var angle2 = 135.0;

        var q0 = Quaternion.newInstance(angle0, Vector.Z_AXIS);
        var q1 = Quaternion.newInstance(angle1, Vector.X_AXIS);
        var q2 = Quaternion.newInstance(angle2, Vector.Y_AXIS);

        // Run / Verify.
        var v = q0.postMultiply(Vector.X_AXIS);
        verifyVector(assert, v, 0.8192, -0.5736, 0.0);

        v = q1.postMultiply(Vector.Y_AXIS);
        verifyVector(assert, v, 0.0, 0.2588, -0.9659);

        v = q2.postMultiply(Vector.Z_AXIS);
        verifyVector(assert, v, -0.7071, 0.0, -0.7071);

        v = q0.postMultiply(Vector.Z_AXIS);
        verifyVector(assert, v, 0.0, 0.0, 1.0);
    });

    QUnit.test("vector()", function(assert)
    {
        // Setup.
        var w = 10.0;
        var x = 5.0;
        var y = 7.0;
        var z = 9.0;
        var q = new Quaternion(w, x, y, z);

        // Run.
        var result = q.vector();

        // Verify.
        assert.equal(Math.vizziniRound(result.magnitude(), 6), 15.968719);
        verifyVector(assert, result, 6.4132, 8.9785, 11.5437);
    });

    QUnit.test("toHeadingString()", function(assert)
    {
        assert.equal(Quaternion.ZERO.toHeadingString(), "0° around 000m000");

        assert.equal(Quaternion.newInstance(0.0, Vector.Z_AXIS).toHeadingString(), "0° around 000m000");
        assert.equal(Quaternion.newInstance(90.0, Vector.Z_AXIS).toHeadingString(), "90° around 000m090");
        assert.equal(Quaternion.newInstance(180.0, Vector.Z_AXIS).toHeadingString(), "180° around 000m090");
        assert.equal(Quaternion.newInstance(270.0, Vector.Z_AXIS).toHeadingString(), "90° around 000m270");

        assert.equal(Quaternion.newInstance(-90.0, Vector.Y_AXIS).toHeadingString(), "90° around 270m000");
        assert.equal(Quaternion.newInstance(90.0, Vector.Y_AXIS).toHeadingString(), "90° around 090m000");
    });

    QUnit.test("toString()", function(assert)
    {
        // Setup.
        var q = new Quaternion(1.0, 2.0, 3.0, 4.0);

        // Run.
        var result = q.toString();

        // Verify.
        assert.ok(result);
        assert.equal(result, "(1, 2, 3, 4)");
    });

    QUnit.test("unit()", function(assert)
    {
        // Setup.
        var q = new Quaternion(1.0, 2.0, 3.0, 4.0);

        // Run.
        var result = q.unit();

        // Run / Verify.
        verifyQuaternion(assert, result, 0.182574, 0.365148, 0.547723, 0.730297);
    });
});

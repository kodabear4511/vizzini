define([ "Bearing" ], function(Bearing)
{
    QUnit.module("Bearing");

    QUnit.test("isBank()", function(assert)
    {
        assert.ok(!Bearing.properties[Bearing.TURN_LEFT].isBank);
        assert.ok(Bearing.properties[Bearing.BANK_LEFT].isBank);
        assert.ok(!Bearing.properties[Bearing.STRAIGHT].isBank);
        assert.ok(Bearing.properties[Bearing.BANK_RIGHT].isBank);
        assert.ok(!Bearing.properties[Bearing.TURN_RIGHT].isBank);
        assert.ok(!Bearing.properties[Bearing.KOIOGRAN_TURN].isBank);
        assert.ok(!Bearing.properties[Bearing.SEGNORS_LOOP_LEFT].isBank);
        assert.ok(!Bearing.properties[Bearing.SEGNORS_LOOP_RIGHT].isBank);
    });

    QUnit.test("isTurn()", function(assert)
    {
        assert.ok(Bearing.properties[Bearing.TURN_LEFT].isTurn);
        assert.ok(!Bearing.properties[Bearing.BANK_LEFT].isTurn);
        assert.ok(!Bearing.properties[Bearing.STRAIGHT].isTurn);
        assert.ok(!Bearing.properties[Bearing.BANK_RIGHT].isTurn);
        assert.ok(Bearing.properties[Bearing.TURN_RIGHT].isTurn);
        assert.ok(!Bearing.properties[Bearing.KOIOGRAN_TURN].isTurn);
        assert.ok(!Bearing.properties[Bearing.SEGNORS_LOOP_LEFT].isTurn);
        assert.ok(!Bearing.properties[Bearing.SEGNORS_LOOP_RIGHT].isTurn);
    });

    QUnit.test("values()", function(assert)
    {
        // Run.
        var result = Bearing.values();

        // Verify.
        assert.ok(result);
        assert.equal(result.length, 8);
        assert.equal(result[0], Bearing.TURN_LEFT);
        assert.equal(result[7], Bearing.SEGNORS_LOOP_RIGHT);
    });
});

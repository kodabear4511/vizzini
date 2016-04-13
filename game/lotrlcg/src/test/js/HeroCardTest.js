define([ "HeroCard", "Trait" ], function(HeroCard, Trait)
{
    "use strict";
    QUnit.module("HeroCard");

    QUnit.test("HeroCard properties Aragorn (Leadership)", function(assert)
    {
        var sphere = HeroCard.ARAGORN_LEADERSHIP;
        var properties = HeroCard.properties[sphere];
        assert.equal(properties.name, "Aragorn");
        assert.equal(properties.value, "aragornLeadership");
    });

    QUnit.test("keys and values", function(assert)
    {
        // Setup.

        // Run.
        var result = HeroCard.values();
        var ownPropertyNames = Object.getOwnPropertyNames(HeroCard);

        // Verify.
        ownPropertyNames.forEach(function(key)
        {
            var key2 = HeroCard[key];

            if (key !== "properties" && typeof key2 === "string")
            {
                assert.ok(HeroCard.properties[key2], "Missing value for key = " + key);
            }
        });

        result.forEach(function(value)
        {
            var p = ownPropertyNames.filter(function(key)
            {
                return HeroCard[key] === value;
            });

            assert.equal(p.length, 1, "Missing key for value = " + value);
        });
    });

    QUnit.test("traits", function(assert)
    {
        HeroCard.values().forEach(function(cardKey)
        {
            var card = HeroCard.properties[cardKey];
            card.traitKeys.forEach(function(traitKey)
            {
                assert.ok(traitKey, "Missing traitKey for cardKey = " + cardKey);
            });
        });
    });

    QUnit.test("HeroCard.values()", function(assert)
    {
        // Run.
        var result = HeroCard.values();

        // Verify.
        assert.ok(result);
        assert.equal(result.length, 32);
        assert.equal(result[0], HeroCard.ARAGORN_FELLOWSHIP);
        assert.equal(result[31], HeroCard.TREEBEARD);
    });
});

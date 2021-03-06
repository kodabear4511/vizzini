define([ "ManeuverComputer", "Position" ], function(ManeuverComputer, Position)
{
    "use strict";
    var RangeRuler =
    {
        ONE: "one",
        TWO: "two",
        THREE: "three",
        FOUR: "four",
        FIVE: "five",
        properties:
        {
            "one":
            {
                minDistance: 0, // Minimum distance. (mm)
                maxDistance: 100, // Maximum distance. (mm)
                name: "1",
                value: "one",
            },
            "two":
            {
                minDistance: 101, // Minimum distance. (mm)
                maxDistance: 200, // Maximum distance. (mm)
                name: "2",
                value: "two",
            },
            "three":
            {
                minDistance: 201, // Minimum distance. (mm)
                maxDistance: 300, // Maximum distance. (mm)
                name: "3",
                value: "three",
            },
            "four":
            {
                minDistance: 301, // Minimum distance. (mm)
                maxDistance: 400, // Maximum distance. (mm)
                name: "4",
                value: "four",
            },
            "five":
            {
                minDistance: 401, // Minimum distance. (mm)
                maxDistance: 500, // Maximum distance. (mm)
                name: "5",
                value: "five",
            },
        },

        values: function()
        {
            return Object.getOwnPropertyNames(this.properties);
        },
    };

    RangeRuler.STANDARD_RANGES = [ RangeRuler.ONE, RangeRuler.TWO, RangeRuler.THREE ];

    RangeRuler.findRange = function(distance)
    {
        var answer;

        var values = this.values();

        for (var i = 0; i < values.length; i++)
        {
            var r = values[i];
            var min = this.properties[r].minDistance;
            var max = this.properties[r].maxDistance;

            if ((min <= distance) && (distance <= max))
            {
                answer = r;
                break;
            }
        }

        return answer;
    };

    RangeRuler.getRange = function(attacker, attackerPosition, defender, defenderPosition)
    {
        InputValidator.validateNotNull("attacker", attacker);
        InputValidator.validateNotNull("attackerPosition", attackerPosition);
        InputValidator.validateNotNull("defender", defender);
        InputValidator.validateNotNull("defenderPosition", defenderPosition);

        var distance = attackerPosition.computeDistance(defenderPosition);

        var attackerPolygon = ManeuverComputer.computePolygon(attacker.pilot().shipTeam.ship.shipBase, attackerPosition
                .x(), attackerPosition.y(), attackerPosition.heading());
        var defenderPolygon = ManeuverComputer.computePolygon(defender.pilot().shipTeam.ship.shipBase, defenderPosition
                .x(), defenderPosition.y(), defenderPosition.heading());

        var points0 = attackerPolygon.points();
        var points1 = defenderPolygon.points();

        for (var i = 0; i < points0.length; i += 2)
        {
            var position0 = new Position(points0[i], points0[i + 1], 0);

            for (var j = 0; j < points1.length; j += 2)
            {
                var position1 = new Position(points1[j], points1[j + 1], 0);
                var myDistance = position0.computeDistance(position1);
                distance = Math.min(myDistance, distance);
            }
        }

        LOGGER.trace("distance = " + distance);

        return RangeRuler.findRange(Math.round(distance));
    };

    if (Object.freeze)
    {
        Object.freeze(RangeRuler);
    }

    return RangeRuler;
});

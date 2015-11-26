/*
 * Provides an enumeration of ranges.
 */
var Range =
{
    ONE: "one",
    TWO: "two",
    THREE: "three",
    properties:
    {
        "one":
        {
            minDistance: 0, // Minimum distance. (mm)
            maxDistance: 100, // Maximum distance. (mm)
            displayName: "1",
            value: "one",
        },
        "two":
        {
            minDistance: 101, // Minimum distance. (mm)
            maxDistance: 200, // Maximum distance. (mm)
            displayName: "2",
            value: "two",
        },
        "three":
        {
            minDistance: 201, // Minimum distance. (mm)
            maxDistance: 300, // Maximum distance. (mm)
            displayName: "3",
            value: "three",
        },
    },

    /*
     * @param distance Distance. (mm)
     * 
     * @return the range value for the given parameter.
     */
    findRange: function(distance)
    {
        var answer;

        var values = Range.values();

        for (var i = 0; i < values.length; i++)
        {
            var r = values[i];
            var min = Range.properties[r].minDistance;
            var max = Range.properties[r].maxDistance;

            if ((min <= distance) && (distance <= max))
            {
                answer = r;
                break;
            }
        }

        return answer;
    },

    values: function()
    {
        return Object.getOwnPropertyNames(Range.properties);
    },
};

if (Object.freeze)
{
    Object.freeze(Range);
};
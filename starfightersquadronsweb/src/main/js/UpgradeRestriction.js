define([ "Pilot", "Ship", "ShipBase", "Team", "ShipTeam" ], function(Pilot, Ship, ShipBase, Team, ShipTeam)
{
    "use strict";
    function PilotSkillRestriction(pilotSkill)
    {
        InputValidator.validateNotNull("pilotSkill", pilotSkill);

        return (
        {
            displayName: "Pilot Skill above \"" + pilotSkill + "\".",
            passes: function(pilotKey)
            {
                var myPilotSkill = Pilot.properties[pilotKey].shipState.pilotSkillValue();
                return myPilotSkill > pilotSkill;
            }
        });
    }

    function ShipSizeRestriction(shipBaseKey)
    {
        InputValidator.validateNotNull("shipBaseKey", shipBaseKey);

        var props = ShipBase.properties[shipBaseKey];

        return (
        {
            displayName: props.name + " only.",
            passes: function(pilotKey)
            {
                var shipTeamKey = Pilot.properties[pilotKey].shipTeam;
                var shipKey = ShipTeam.properties[shipTeamKey].ship;
                var myShipBaseKey = Ship.properties[shipKey].shipBase;
                return myShipBaseKey === shipBaseKey;
            }
        });
    }

    function ShipRestriction(shipKey)
    {
        InputValidator.validateNotNull("shipKey", shipKey);

        var props = Ship.properties[shipKey];

        return (
        {
            displayName: props.name + " only.",
            passes: function(pilotKey)
            {
                var shipTeamKey = Pilot.properties[pilotKey].shipTeam;
                var myShipKey = ShipTeam.properties[shipTeamKey].ship;
                return myShipKey === shipKey;
            }
        });
    }

    function TeamRestriction(teamKey)
    {
        InputValidator.validateNotNull("teamKey", teamKey);

        var props = Team.properties[teamKey];

        return (
        {
            displayName: props.name + " only.",
            passes: function(pilotKey)
            {
                var shipTeamKey = Pilot.properties[pilotKey].shipTeam;
                var myTeamKey = ShipTeam.properties[shipTeamKey].team;
                return myTeamKey === teamKey;
            }
        });
    }

    var UpgradeRestriction =
    {
        // Pilot skill lower bound.
        PILOT_SKILL_ABOVE_1: "pilotSkillAbove1",
        PILOT_SKILL_ABOVE_2: "pilotSkillAbove2",
        PILOT_SKILL_ABOVE_3: "pilotSkillAbove3",
        PILOT_SKILL_ABOVE_4: "pilotSkillAbove4",

        // Ship specific.
        A_WING_ONLY: "aWingOnly",
        AGGRESSOR_ONLY: "aggressorOnly",
        B_WING_ONLY: "bWingOnly",
        FIRESPRAY_31_ONLY: "firespray31Only",
        HWK_290_ONLY: "hwk290Only",
        LAMBDA_CLASS_SHUTTLE_ONLY: "lambdaClassShuttleOnly",
        M3_A_INTERCEPTOR_ONLY: "m3AInterceptorOnly",
        STAR_VIPER_ONLY: "starViperOnly",
        TIE_ADVANCED_ONLY: "tieAdvancedOnly",
        TIE_INTERCEPTOR_ONLY: "tieInterceptorOnly",
        TIE_PHANTOM_ONLY: "tiePhantomOnly",
        VT_49_DECIMATOR_ONLY: "vt49DecimatorOnly",
        X_WING_ONLY: "xWingOnly",
        YT_1300_ONLY: "yt1300Only",
        YT_2400_ONLY: "yt2400Only",
        Y_WING_ONLY: "yWingOnly",
        YV_666_ONLY: "yv666Only",

        // Ship size.
        HUGE_SHIP_ONLY: "hugeShipOnly",
        LARGE_SHIP_ONLY: "largeShipOnly",
        SMALL_SHIP_ONLY: "smallShipOnly",

        // Team specific.
        IMPERIAL_ONLY: "imperialOnly",
        REBEL_ONLY: "rebelOnly",
        SCUM_ONLY: "scumOnly",

        // Miscellaneous.
        LIMITED: "limited",
        TIE_ONLY: "tieOnly",

        properties:
        {
            "aWingOnly": new ShipRestriction(Ship.A_WING),
            "aggressorOnly": new ShipRestriction(Ship.AGGRESSOR),
            "bWingOnly": new ShipRestriction(Ship.B_WING),
            "firespray31Only": new ShipRestriction(Ship.FIRESPRAY_31),
            "hugeShipOnly":
            {
                displayName: "Huge ship only.",
                passes: function(pilotKey)
                {
                    var shipTeamKey = Pilot.properties[pilotKey].shipTeam;
                    var shipKey = ShipTeam.properties[shipTeamKey].ship;
                    var shipBaseKey = Ship.properties[shipKey].shipBase;
                    return shipBaseKey === ShipBase.HUGE1 || shipBaseKey === ShipBase.HUGE2;
                }
            },
            "hwk290Only": new ShipRestriction(Ship.HWK_290),
            "imperialOnly": new TeamRestriction(Team.IMPERIAL),
            "lambdaClassShuttleOnly": new ShipRestriction(Ship.LAMBDA_CLASS_SHUTTLE),
            "largeShipOnly": new ShipSizeRestriction(ShipBase.LARGE),
            "limited":
            {
                displayName: "Limited.",
                passes: function(pilotKey)
                {
                    // FIXME: implement Limited.passes()
                    return true;
                }
            },
            "m3AInterceptorOnly": new ShipRestriction(Ship.M3_A_INTERCEPTOR),
            "pilotSkillAbove1": new PilotSkillRestriction(1),
            "pilotSkillAbove2": new PilotSkillRestriction(2),
            "pilotSkillAbove3": new PilotSkillRestriction(3),
            "pilotSkillAbove4": new PilotSkillRestriction(4),
            "rebelOnly": new TeamRestriction(Team.REBEL),
            "scumOnly": new TeamRestriction(Team.SCUM),
            "smallShipOnly": new ShipSizeRestriction(ShipBase.SMALL),
            "starViperOnly": new ShipRestriction(Ship.STAR_VIPER),
            "tieAdvancedOnly": new ShipRestriction(Ship.TIE_ADVANCED),
            "tieInterceptorOnly": new ShipRestriction(Ship.TIE_INTERCEPTOR),
            "tieOnly":
            {
                displayName: "TIE only.",
                passes: function(pilotKey)
                {
                    var shipTeamKey = Pilot.properties[pilotKey].shipTeam;
                    var shipKey = ShipTeam.properties[shipTeamKey].ship;
                    return Ship.properties[shipKey].name.startsWith("TIE");
                }
            },
            "tiePhantomOnly": new ShipRestriction(Ship.TIE_PHANTOM),
            "vt49DecimatorOnly": new ShipRestriction(Ship.VT_49_DECIMATOR),
            "xWingOnly":
            {
                displayName: "X-Wing only.",
                passes: function(pilotKey)
                {
                    var shipTeamKey = Pilot.properties[pilotKey].shipTeam;
                    var shipKey = ShipTeam.properties[shipTeamKey].ship;
                    return shipKey === Ship.X_WING || shipKey === Ship.T_70_X_WING;
                }
            },
            "yt1300Only": new ShipRestriction(Ship.YT_1300),
            "yt2400Only": new ShipRestriction(Ship.YT_2400),
            "yWingOnly": new ShipRestriction(Ship.Y_WING),
            "yv666Only": new ShipRestriction(Ship.YV_666),
        },

        passes: function(restrictions, pilotKey)
        {
            InputValidator.validateNotNull("pilotKey", pilotKey);

            var answer = true;

            if (restrictions !== undefined)
            {
                answer = restrictions.reduce(function(previousValue, restriction)
                {
                    if (!UpgradeRestriction.properties[restriction]) { throw "Can't find properties for restriction: " +
                            restriction; }
                    return previousValue && UpgradeRestriction.properties[restriction].passes(pilotKey);
                }, true);
            }

            return answer;
        },

        values: function()
        {
            return Object.getOwnPropertyNames(UpgradeRestriction.properties);
        },
    };

    if (Object.freeze)
    {
        Object.freeze(UpgradeRestriction);
    }

    return UpgradeRestriction;
});

/*
 * Provides pilot abilities for the Activation Phase.
 */
define(["Bearing", "Difficulty", "Maneuver", "Phase", "Pilot", "UpgradeCard", "process/Selector", "process/ShipActionAction"],
    function(Bearing, Difficulty, Maneuver, Phase, Pilot, UpgradeCard, Selector, ShipActionAction)
    {
        "use strict";
        var PilotAbility2 = {};

        ////////////////////////////////////////////////////////////////////////
        PilotAbility2[Phase.ACTIVATION_REVEAL_DIAL] = {};

        PilotAbility2[Phase.ACTIVATION_REVEAL_DIAL][Pilot.COUNTESS_RYAD] = {
            // When you reveal a Straight maneuver, you may treat it as a K-Turn maneuver.
            condition: function(store, token)
            {
                var activeToken = getActiveToken(store);
                var maneuver = getManeuver(activeToken);
                return token === activeToken && maneuver.bearingKey === Bearing.STRAIGHT;
            },
            consequent: function(store, token)
            {
                var oldManeuver = getManeuver(token);
                var newManeuverKey = Maneuver.find(Bearing.KOIOGRAN_TURN, oldManeuver.speed, oldManeuver.difficultyKey);
                if (newManeuverKey === undefined)
                {
                    throw "Can't find K-Turn maneuver for oldManeuver = " + oldManeuver.bearingKey + " " + oldManeuver.speed + " " + oldManeuver.difficultyKey;
                }
                token.activationState().activationAction().maneuverKey(newManeuverKey);
            },
        };

        PilotAbility2[Phase.ACTIVATION_REVEAL_DIAL][UpgradeCard.BOBA_FETT_IMPERIAL] = {
            // When you reveal a bank maneuver, you may rotate your dial to the other bank maneuver of the same speed.
            condition: function(store, token)
            {
                var activeToken = getActiveToken(store);
                var maneuver = getManeuver(activeToken);
                return token === activeToken && [Bearing.BANK_LEFT, Bearing.BANK_RIGHT].vizziniContains(maneuver.bearingKey);
            },
            consequent: function(store, token)
            {
                var environment = store.getState().environment;
                var oldManeuver = getManeuver(token);
                var newBearingKey;
                switch (oldManeuver.bearingKey)
                {
                    case Bearing.BANK_LEFT:
                        newBearingKey = Bearing.BANK_RIGHT;
                        break;
                    case Bearing.BANK_RIGHT:
                        newBearingKey = Bearing.BANK_LEFT;
                        break;
                }
                var newManeuverKey = findManeuverByBearingSpeed(token, newBearingKey, oldManeuver.speed);
                token.activationState().activationAction().maneuverKey(newManeuverKey);
            },
        };

        ////////////////////////////////////////////////////////////////////////
        PilotAbility2[Phase.ACTIVATION_CLEAN_UP] = {};

        PilotAbility2[Phase.ACTIVATION_CLEAN_UP][Pilot.NIGHT_BEAST] = {
            // After executing a green maneuver, you may perform a free focus action.
            condition: function(store, token)
            {
                var activeToken = getActiveToken(store);
                var maneuver = getManeuver(activeToken);
                return token === activeToken && maneuver.difficultyKey === Difficulty.EASY;
            },
            consequent: function(store, token)
            {
                var shipActionAction = new ShipActionAction.Focus(store, token);
                shipActionAction.doIt();
            },
        };

        ////////////////////////////////////////////////////////////////////////
        function findManeuverByBearingSpeed(token, bearing, speed)
        {
            InputValidator.validateNotNull("token", token);
            InputValidator.validateNotNull("bearing", bearing);
            InputValidator.validateNotNull("speed", speed);

            var answer;
            var maneuverKeys = token.pilot().shipTeam.ship.maneuverKeys;

            for (var i = 0; i < maneuverKeys.length; i++)
            {
                var maneuverKey = maneuverKeys[i];
                var maneuver = Maneuver.properties[maneuverKey];

                if (maneuver.bearingKey === bearing && maneuver.speed === speed)
                {
                    answer = maneuverKey;
                    break;
                }
            }

            return answer;
        }

        function getActivationAction(token)
        {
            InputValidator.validateNotNull("token", token);

            return token.activationState().activationAction();
        }

        function getActiveToken(store)
        {
            InputValidator.validateNotNull("store", store);

            return Selector.activeToken(store.getState());
        }

        function getManeuver(token)
        {
            InputValidator.validateNotNull("token", token);

            var maneuverKey = getManeuverKey(token);
            return Maneuver.properties[maneuverKey];
        }

        function getManeuverKey(token)
        {
            InputValidator.validateNotNull("token", token);

            var activationAction = getActivationAction(token);
            return activationAction.maneuverKey();
        }

        if (Object.freeze)
        {
            Object.freeze(PilotAbility2);
        }

        return PilotAbility2;
    });

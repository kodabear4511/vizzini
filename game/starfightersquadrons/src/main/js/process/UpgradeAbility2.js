/*
 * Provides upgrade abilities for the Activation Phase.
 */
define(["Bearing", "Difficulty", "Maneuver", "Phase", "Position", "UpgradeCard", "process/Action", "process/Selector"],
    function(Bearing, Difficulty, Maneuver, Phase, Position, UpgradeCard, Action, Selector)
    {
        "use strict";
        var UpgradeAbility2 = {};

        ////////////////////////////////////////////////////////////////////////
        UpgradeAbility2[Phase.ACTIVATION_REVEAL_DIAL] = {};

        UpgradeAbility2[Phase.ACTIVATION_REVEAL_DIAL][UpgradeCard.ADRENALINE_RUSH] = {
            // When you reveal a red maneuver, you may discard this card to treat that maneuver as a white maneuver until the end of the Activation phase.
            condition: function(store, token)
            {
                var activeToken = getActiveToken(store);
                var maneuver = getManeuver(activeToken);
                return token === activeToken && maneuver.difficultyKey === Difficulty.HARD;
            },
            consequent: function(store, token)
            {
                discardUpgrade(token, UpgradeCard.ADRENALINE_RUSH);

                var oldManeuver = getManeuver(token);
                var newManeuverKey = Maneuver.find(oldManeuver.bearingKey, oldManeuver.speed, Difficulty.STANDARD);
                if (newManeuverKey === undefined)
                {
                    throw "Can't find white maneuver for oldManeuver = " + oldManeuver;
                }
                token.activationState().activationAction().maneuverKey(newManeuverKey);
            },
        };

        UpgradeAbility2[Phase.ACTIVATION_REVEAL_DIAL][UpgradeCard.INERTIAL_DAMPENERS] = {
            // When you reveal your maneuver, you may discard this card to instead perform a white Stationary 0 maneuver. Then receive 1 stress token.
            condition: function(store, token)
            {
                var activeToken = getActiveToken(store);
                return token === activeToken;
            },
            consequent: function(store, token)
            {
                discardUpgrade(token, UpgradeCard.INERTIAL_DAMPENERS);

                token.activationState().activationAction().maneuverKey(Maneuver.STATIONARY_0_STANDARD);
                token.receiveStress();
            },
        };

        UpgradeAbility2[Phase.ACTIVATION_REVEAL_DIAL][UpgradeCard.MANEUVERING_FINS] = {
            // When you reveal a turn maneuver (left or right), you may rotate your dial to the corresponding bank maneuver (left or right) of the same speed.
            condition: function(store, token)
            {
                var activeToken = getActiveToken(store);
                var maneuver = getManeuver(activeToken);
                return token === activeToken && [Bearing.TURN_LEFT, Bearing.TURN_RIGHT].vizziniContains(maneuver.bearingKey);
            },
            consequent: function(store, token)
            {
                var environment = store.getState().environment;
                var oldManeuver = getManeuver(token);
                var newBearingKey;
                switch (oldManeuver.bearingKey)
                {
                    case Bearing.TURN_LEFT:
                        newBearingKey = Bearing.BANK_LEFT;
                        break;
                    case Bearing.TURN_RIGHT:
                        newBearingKey = Bearing.BANK_RIGHT;
                        break;
                }
                var newManeuverKey = findManeuverByBearingSpeed(token, newBearingKey, oldManeuver.speed);
                token.activationState().activationAction().maneuverKey(newManeuverKey);
            },
        };

        ////////////////////////////////////////////////////////////////////////
        UpgradeAbility2[Phase.ACTIVATION_CLEAN_UP] = {};

        UpgradeAbility2[Phase.ACTIVATION_CLEAN_UP][UpgradeCard.LIGHTNING_REFLEXES] = {
            // After you execute a white or green maneuver on your dial, you may discard this card to rotate your ship 180˚. Then receive 1 stress token after the "Check Pilot Stress" step.
            condition: function(store, token)
            {
                var activeToken = getActiveToken(store);
                var maneuver = getManeuver(activeToken);
                return token === activeToken && [Difficulty.STANDARD, Difficulty.EASY].vizziniContains(maneuver.difficultyKey);
            },
            consequent: function(store, token)
            {
                discardUpgrade(token, UpgradeCard.LIGHTNING_REFLEXES);

                var environment = store.getState().environment;
                var fromPosition = environment.getPositionFor(token);
                var toPosition = new Position(fromPosition.x(), fromPosition.y(), fromPosition.heading() + 180);
                store.dispatch(Action.moveToken(fromPosition, toPosition));
                token.receiveStress();
            },
        };

        UpgradeAbility2[Phase.ACTIVATION_CLEAN_UP][UpgradeCard.TIE_X7] = {
            // Your upgrade bar loses the Cannon and Missile upgrade icons. After executing a 3-, 4-, or 5-speed maneuver, you may assign 1 evade token to your ship.
            condition: function(store, token)
            {
                var activeToken = getActiveToken(store);
                var maneuver = getManeuver(activeToken);
                return token === activeToken && [3, 4, 5].vizziniContains(maneuver.speed);
            },
            consequent: function(store, token)
            {
                store.dispatch(Action.addEvadeCount(token));
            },
        };

        ////////////////////////////////////////////////////////////////////////
        UpgradeAbility2[Phase.ACTIVATION_GAIN_ENERGY] = {};

        UpgradeAbility2[Phase.ACTIVATION_GAIN_ENERGY][UpgradeCard.ENGINEERING_TEAM] = {
            // During the Activation phase, when you reveal a Straight maneuver, gain 1 additional energy during the "Gain Energy" step.
            condition: function(store, token)
            {
                var activeToken = getActiveToken(store);
                var maneuver = getManeuver(activeToken);
                return token === activeToken && maneuver.bearingKey === Bearing.STRAIGHT;
            },
            consequent: function(store, token)
            {
                store.dispatch(Action.addEnergyCount(token));
            },
        };

        ////////////////////////////////////////////////////////////////////////
        function discardUpgrade(token, upgradeKey)
        {
            InputValidator.validateNotNull("token", token);
            // upgradeKey optional.

            var myUpgradeKey = (upgradeKey === undefined ? getWeapon(token).upgradeKey() : upgradeKey);
            token.discardUpgrade(myUpgradeKey);
        }

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
            Object.freeze(UpgradeAbility2);
        }

        return UpgradeAbility2;
    });

define(["Count", "Value"], function(Count, Value)
{
    "use strict";
    var Selector = {};

    Selector.activeToken = function(state)
    {
        InputValidator.validateNotNull("state", state);

        var answer;

        if (state.activeTokenId !== undefined && state.activeTokenId !== null)
        {
            answer = Selector.token(state, state.activeTokenId);
        }

        return answer;
    };

    Selector.agilityValue = function(state, tokenId)
    {
        return Selector.value(state, tokenId, Value.AGILITY);
    };

    Selector.attackerTargetLocks = function(state, attacker)
    {
        InputValidator.validateNotNull("state", state);
        InputValidator.validateNotNull("attacker", attacker);

        return state.targetLocks.filter(function(targetLock)
        {
            return targetLock.attacker().id() === attacker.id();
        });
    };

    Selector.cloakCount = function(state, tokenId)
    {
        return Selector.count(state, tokenId, Count.CLOAK);
    };

    Selector.count = function(state, tokenId, property)
    {
        InputValidator.validateNotNull("state", state);
        InputValidator.validateIsNumber("tokenId", tokenId);
        InputValidator.validateNotNull("property", property);

        var answer;
        var counts = state.tokenIdToCounts[tokenId];

        if (counts)
        {
            answer = counts[property];
        }

        return answer;
    };

    Selector.criticalDamages = function(state, tokenId)
    {
        InputValidator.validateNotNull("state", state);
        InputValidator.validateIsNumber("tokenId", tokenId);

        var answer = state.tokenIdToCriticalDamages[tokenId];

        return (answer ? answer.slice() : []);
    };

    Selector.damages = function(state, tokenId)
    {
        InputValidator.validateNotNull("state", state);
        InputValidator.validateIsNumber("tokenId", tokenId);

        var answer = state.tokenIdToDamages[tokenId];

        return (answer ? answer.slice() : []);
    };

    Selector.defenderTargetLocks = function(state, defender)
    {
        InputValidator.validateNotNull("state", state);
        InputValidator.validateNotNull("defender", defender);

        return state.targetLocks.filter(function(targetLock)
        {
            return targetLock.defender().id() === defender.id();
        });
    };

    Selector.energyCount = function(state, tokenId)
    {
        return Selector.count(state, tokenId, Count.ENERGY);
    };

    Selector.energyValue = function(state, tokenId)
    {
        return Selector.value(state, tokenId, Value.ENERGY);
    };

    Selector.environment = function(state)
    {
        return state.environment;
    };

    Selector.evadeCount = function(state, tokenId)
    {
        return Selector.count(state, tokenId, Count.EVADE);
    };

    Selector.focusCount = function(state, tokenId)
    {
        return Selector.count(state, tokenId, Count.FOCUS);
    };

    Selector.hullValue = function(state, tokenId)
    {
        return Selector.value(state, tokenId, Value.HULL);
    };

    Selector.ionCount = function(state, tokenId)
    {
        return Selector.count(state, tokenId, Count.ION);
    };

    Selector.pilotSkillValue = function(state, tokenId)
    {
        return Selector.value(state, tokenId, Value.PILOT_SKILL);
    };

    Selector.position = function(state, tokenId)
    {
        InputValidator.validateNotNull("state", state);
        InputValidator.validateIsNumber("tokenId", tokenId);

        return state.tokenIdToPosition[tokenId];
    };

    Selector.primaryWeaponValue = function(state, tokenId)
    {
        return Selector.value(state, tokenId, Value.PRIMARY_WEAPON);
    };

    Selector.reinforceCount = function(state, tokenId)
    {
        return Selector.count(state, tokenId, Count.REINFORCE);
    };

    Selector.shieldCount = function(state, tokenId)
    {
        return Selector.count(state, tokenId, Count.SHIELD);
    };

    Selector.shieldValue = function(state, tokenId)
    {
        return Selector.value(state, tokenId, Value.SHIELD);
    };

    Selector.stressCount = function(state, tokenId)
    {
        return Selector.count(state, tokenId, Count.STRESS);
    };

    Selector.targetLock = function(targetLocks, attacker, defender)
    {
        InputValidator.validateNotNull("targetLocks", targetLocks);
        InputValidator.validateNotNull("attacker", attacker);
        InputValidator.validateNotNull("defender", defender);

        var answer;

        for (var i = 0; i < targetLocks.length; i++)
        {
            var targetLock = targetLocks[i];

            if (targetLock.attacker().id() === attacker.id() && targetLock.defender().id() === defender.id())
            {
                answer = targetLock;
                break;
            }
        }

        return answer;
    };

    Selector.token = function(state, tokenId)
    {
        InputValidator.validateNotNull("state", state);
        InputValidator.validateIsNumber("tokenId", tokenId);

        return state.tokens[tokenId];
    };

    Selector.tokenAt = function(state, position)
    {
        InputValidator.validateNotNull("state", state);
        InputValidator.validateNotNull("position", position);

        var answer;
        var tokenId = state.positionToTokenId[position];

        if (tokenId !== undefined)
        {
            answer = Selector.token(state, tokenId);
        }

        return answer;
    };

    Selector.tokenToUpgradePerRound = function(state, tokenId, upgradeKey)
    {
        InputValidator.validateNotNull("state", state);
        InputValidator.validateIsNumber("tokenId", tokenId);
        InputValidator.validateNotNull("upgradeKey", upgradeKey);

        var answer;

        if (state.tokenIdToUpgradePerRound[tokenId] !== undefined)
        {
            answer = state.tokenIdToUpgradePerRound[tokenId][upgradeKey];
        }

        return answer;
    };

    Selector.tractorBeamCount = function(state, tokenId)
    {
        return Selector.count(state, tokenId, Count.TRACTOR_BEAM);
    };

    Selector.upgrades = function(state, tokenId)
    {
        InputValidator.validateNotNull("state", state);
        InputValidator.validateIsNumber("tokenId", tokenId);

        var answer = state.tokenIdToUpgrades[tokenId];

        return (answer ? answer.slice() : []);
    };

    Selector.value = function(state, tokenId, property)
    {
        InputValidator.validateNotNull("state", state);
        InputValidator.validateIsNumber("tokenId", tokenId);
        InputValidator.validateNotNull("property", property);

        var answer;
        var values = state.tokenIdToValues[tokenId];

        if (values)
        {
            answer = values[property];
        }

        return answer;
    };

    Selector.weaponsDisabledCount = function(state, tokenId)
    {
        return Selector.count(state, tokenId, Count.WEAPONS_DISABLED);
    };

    if (Object.freeze)
    {
        Object.freeze(Selector);
    }

    return Selector;
});

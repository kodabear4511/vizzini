define([ "process/Action" ], function(Action)
{
    "use strict";
    function ShipDestroyedAction(environment, token, fromPosition)
    {
        this.environment = function()
        {
            return environment;
        };

        this.token = function()
        {
            return token;
        };

        this.fromPosition = function()
        {
            return fromPosition;
        };

        this.doIt = function()
        {
            LOGGER.trace("ShipDestroyedAction.doIt() start");

            token.removeAllTargetLocks();

            // Return the damage cards.
            if (token.tokenFore && token.tokenAft)
            {
                environment.discardAllDamage(token.tokenFore().damages());
                environment.discardAllDamage(token.tokenFore().criticalDamages());
                environment.discardAllDamage(token.tokenAft().damages());
                environment.discardAllDamage(token.tokenAft().criticalDamages());
            }
            else
            {
                environment.discardAllDamage(token.damages());
                environment.discardAllDamage(token.criticalDamages());
            }

            environment.removeToken(fromPosition);
            var store = environment.store();
            store.dispatch(Action.setUserMessage("Ship destroyed: " + token));

            LOGGER.trace("ShipDestroyedAction.doIt() end");
        };
    }

    return ShipDestroyedAction;
});

/*
 * Provides a user interface for Starfighter Squadrons.
 */
function SSPanel(environmentIn)
{
    var that = this;

    environmentIn.addRoundListener(this);
    environmentIn.addPhaseListener(this);
    environmentIn.addActiveTokenListener(this);

    this.activeTokenChange = function(environment, oldValue, newValue)
    {
        updateFromEnvironment(environment);
    }

    this.paintComponent = function(playState)
    {
        LOGGER.trace("SSPanel.paintComponent() start");

        var answer = "";

        if (playState)
        {
            var round = playState.getRound();
            var phase = playState.getPhase();
            var activeToken = playState.getActiveToken();
            LOGGER.trace("round = " + round + " phase = " + phase
                    + " activeToken = " + activeToken);

            answer += "Round: ";
            answer += round;

            if (phase)
            {
                answer += " Phase: ";
                answer += Phase.properties[phase].displayName;
            }

            if (activeToken)
            {
                answer += " Active Ship: ";
                answer += activeToken.getName();
            }
        }

        var component = document.getElementById("ssPanel");
        component.innerHTML = answer;

        LOGGER.trace("SSPanel.paintComponent() end");
    }

    this.phaseChange = function(environment, oldValue, newValue)
    {
        updateFromEnvironment(environment);
    }

    this.roundChange = function(environment, oldValue, newValue)
    {
        updateFromEnvironment(environment);
    }

    function updateFromEnvironment(environment)
    {
        var round = environment.getRound();
        var phase = environment.getPhase();
        var activeToken = environment.getActiveToken();

        var playState = new PlayState(round, phase, activeToken);
        that.paintComponent(playState);
    }
}
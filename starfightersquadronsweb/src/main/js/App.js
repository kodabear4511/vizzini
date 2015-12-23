"use strict";
var LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "https://raw.githubusercontent.com/jmthompson2015/vizzini/master/starfightersquadronsweb/src/main/resources/";
var audioBase = resourceBase + "audio/";
var iconBase = resourceBase + "icons/";
var imageBase = resourceBase + "images/";

require([ "Game", "ui/EnvironmentUI", "ui/NewGamePanel" ], function(Game, EnvironmentUI, NewGamePanel)
{
    // Create initial agents and tokens.
    var newGamePanel = React.createElement(NewGamePanel,
    {
        callback: startNewGame,
    });

    React.render(newGamePanel, document.getElementById("inputArea"));
    var environmentUI;

    function startNewGame(agents)
    {
        LOGGER.info("startNewGame() start");

        LOGGER.info("agents[0] = " + agents[0]);
        LOGGER.info("agents[1] = " + agents[1]);

        var element = document.getElementById("inputArea");
        element.innerHTML = "";

        var game = new Game(agents);
        environmentUI = new EnvironmentUI(game.engine(), game.environment());

        game.start();

        HtmlUtilities.removeClass(document.getElementById("ssPanel"), "hidden");
        HtmlUtilities.removeClass(document.getElementById("messageArea"), "hidden");
        updateSizes(environmentUI);

        LOGGER.info("startNewGame() end");
    }

    function updateSizes(environmentUI)
    {
        var firstPilots = document.getElementById("firstPilots");
        var secondPilots = document.getElementById("secondPilots");
        var newWidth = window.innerWidth - firstPilots.offsetWidth - secondPilots.offsetWidth;

        var ssPanel = document.getElementById("ssPanel");
        var messageArea = document.getElementById("messageArea");
        var inputArea = document.getElementById("inputArea");
        var newHeight = window.innerHeight - ssPanel.offsetHeight - messageArea.offsetHeight - inputArea.offsetHeight
                - 20;

        var size = Math.min(newWidth, newHeight);

        var myPlayAreaCanvas = document.getElementById("playAreaCanvas");
        myPlayAreaCanvas.width = size;
        myPlayAreaCanvas.height = size;

        if (environmentUI)
        {
            environmentUI.setScale(size / 915.0);
        }
    }

    function updateSizes(environmentUI)
    {
        var firstPilots = document.getElementById("firstPilots");
        var secondPilots = document.getElementById("secondPilots");
        var newWidth = window.innerWidth - firstPilots.offsetWidth - secondPilots.offsetWidth;

        var ssPanel = document.getElementById("ssPanel");
        var messageArea = document.getElementById("messageArea");
        var inputArea = document.getElementById("inputArea");
        var newHeight = window.innerHeight - ssPanel.offsetHeight - messageArea.offsetHeight - inputArea.offsetHeight
                - 20;

        var size = Math.min(newWidth, newHeight);

        var myPlayAreaCanvas = document.getElementById("playAreaCanvas");
        myPlayAreaCanvas.width = size;
        myPlayAreaCanvas.height = size;

        if (environmentUI)
        {
            environmentUI.setScale(size / 915.0);
        }
    }

    window.addEventListener("resize", function()
    {
        updateSizes(environmentUI)
    }, false);
    window.addEventListener("orientationchange", function()
    {
        updateSizes(environmentUI)
    }, false);
});

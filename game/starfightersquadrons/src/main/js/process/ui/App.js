var LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "https://raw.githubusercontent.com/jmthompson2015/vizzini/master/game/starfightersquadrons/src/main/resources/";
var iconBase = resourceBase + "icons/";
var imageBase = resourceBase + "images/";

require(["process/Action", "process/Game", "process/Reducer", "process/ui/EnvironmentUI", "process/ui/NewGamePanel"],
    function(Action, Game, Reducer, EnvironmentUI, NewGamePanel)
    {
        "use strict";

        // Create initial agents and tokens.
        var store0 = Redux.createStore(Reducer.root);
        var newGamePanel = React.createElement(ReactRedux.Provider,
        {
            store: store0,
        }, React.createElement(NewGamePanel,
        {
            callback: startNewGame,
            iconBase: iconBase,
            imageBase: imageBase,
        }));

        ReactDOM.render(newGamePanel, document.getElementById("inputArea"));
        var game;
        var environmentUI;

        function startNewGame(agent1, squad1, agent2, squad2)
        {
            LOGGER.info("startNewGame() start");

            LOGGER.info("agent1 = " + agent1);
            LOGGER.info("squad1 = " + squad1);
            LOGGER.info("agent2 = " + agent2);
            LOGGER.info("squad2 = " + squad2);

            var element = document.getElementById("inputArea");
            element.innerHTML = "";

            game = new Game(agent1, squad1, agent2, squad2);
            var store = game.environment().store();
            environmentUI = React.createElement(ReactRedux.Provider,
            {
                store: store,
            }, React.createElement(EnvironmentUI,
            {
                engine: game.engine(),
                environment: game.environment(),
                imageBase: imageBase,
            }));
            ReactDOM.render(environmentUI, document.getElementById("environmentUI"));

            game.start();

            updateSizes(environmentUI);

            LOGGER.info("startNewGame() end");
        }

        /*
         * @see https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements
         */
        function updateSizes(environmentUI)
        {
            var mainTable = document.getElementById("mainTable");
            var windowWidth = Math.min(window.innerWidth - 8, mainTable.clientWidth);
            var firstPilots = document.getElementById("firstPilots");
            var secondPilots = document.getElementById("secondPilots");
            var newWidth = windowWidth;

            if (firstPilots)
            {
                newWidth -= firstPilots.offsetWidth;
            }

            if (secondPilots)
            {
                newWidth -= secondPilots.offsetWidth;
            }

            var myPlayAreaCanvas = document.getElementById("playAreaCanvas");
            if (myPlayAreaCanvas)
            {
                myPlayAreaCanvas.width = newWidth;
            }

            if (game)
            {
                var playFormat = game.environment().playFormat();

                if (myPlayAreaCanvas)
                {
                    var aspectRatio = playFormat.width / playFormat.height;
                    myPlayAreaCanvas.height = newWidth / aspectRatio;
                }

                var store = game.environment().store();
                store.dispatch(Action.setPlayAreaScale(newWidth / playFormat.width));
            }
        }

        window.addEventListener("resize", function()
        {
            updateSizes(environmentUI);
        }, false);
        window.addEventListener("orientationchange", function()
        {
            updateSizes(environmentUI);
        }, false);
    });

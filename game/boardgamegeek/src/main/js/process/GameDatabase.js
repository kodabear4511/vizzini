define([ "process/Action", "process/GameDetailFetcher", "process/GameSummaryFetcher", "process/Reducer" ], function(
        Action, GameDetailFetcher, GameSummaryFetcher, Reducer)
{
    "use strict";
    function GameDatabase(pageCount)
    {
        InputValidator.validateInRange("pageCount", pageCount, 1, 10);

        var that = this;
        var DETAIL_CACHE_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        var ENTITY_CACHE_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        var SUMMARY_CACHE_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

        var store = Redux.createStore(Reducer.root);
        store.dispatch(Action.setGameDatabase(this));

        this.pageCount = function()
        {
            return pageCount;
        };

        this.store = function()
        {
            return store;
        };

        this.categories = function()
        {
            return getEntities("boardgamecategory");
        };

        this.designers = function()
        {
            return getEntities("boardgamedesigner");
        };

        this.filteredGameSummaries = function()
        {
            var answer;
            var filters = this.filters();
            var gameSummaryMap = this.gameSummaryMap();

            if (filters && filters.length > 0)
            {
                var gameSummaries = Object.values(gameSummaryMap);
                answer = gameSummaries.filter(function(gameSummary)
                {
                    var gameDetail = that.findGameDetailById(gameSummary.id);

                    return GameDatabase.passesFilters(filters, gameSummary, gameDetail);
                });
            }
            else
            {
                answer = Object.values(gameSummaryMap);
            }

            answer.sort(function(a, b)
            {
                return a.boardGameRank - b.boardGameRank;
            });

            LOGGER.trace("GameDatabase.filteredGameSummaries() answer.length = " + answer.length);

            return answer;
        };

        this.loadFromLocalStorage = function()
        {
            if (localStorage.entityTimestamp)
            {
                var newEntityTimestamp = parseInt(localStorage.entityTimestamp);
                LOGGER.debug("localStorage newEntityTimestamp = " + newEntityTimestamp);

                if (newEntityTimestamp && Date.now() < newEntityTimestamp + ENTITY_CACHE_TIME)
                {
                    // Load from localStorage.
                    var newEntityMap = JSON.parse(localStorage.entityMap);
                    LOGGER.debug("newEntityMap loaded from localStorage");
                    store.dispatch(Action.setEntityTimestamp(newEntityTimestamp));
                    store.dispatch(Action.mergeEntityMap(newEntityMap));
                }
            }

            if (localStorage.gameDetailTimestamp)
            {
                var newGameDetailTimestamp = parseInt(localStorage.gameDetailTimestamp);
                LOGGER.debug("localStorage newGameDetailTimestamp = " + newGameDetailTimestamp);

                if (newGameDetailTimestamp && Date.now() < newGameDetailTimestamp + DETAIL_CACHE_TIME)
                {
                    // Load from localStorage.
                    var newGameDetailMap = JSON.parse(localStorage.gameDetailMap);
                    LOGGER.debug("newGameDetailMap loaded from localStorage");
                    store.dispatch(Action.setGameDetailTimestamp(newGameDetailTimestamp));
                    store.dispatch(Action.mergeGameDetailMap(newGameDetailMap));
                }
            }

            if (localStorage.gameSummaryTimestamp)
            {
                var newGameSummaryTimestamp = parseInt(localStorage.gameSummaryTimestamp);
                LOGGER.debug("localStorage newGameSummaryTimestamp = " + newGameSummaryTimestamp);

                if (newGameSummaryTimestamp && Date.now() < newGameSummaryTimestamp + SUMMARY_CACHE_TIME)
                {
                    // Load from localStorage.
                    var newGameSummaryMap = JSON.parse(localStorage.gameSummaryMap);
                    LOGGER.debug("newGameSummaryMap loaded from localStorage");
                    store.dispatch(Action.setGameSummaryTimestamp(newGameSummaryTimestamp));
                    store.dispatch(Action.mergeGameSummaryMap(newGameSummaryMap));
                }
            }

            if (!this.gameSummaryMap() || Object.vizziniIsEmpty(this.gameSummaryMap()))
            {
                // Load from the internet.
                for (var i = 1; i <= pageCount; i++)
                {
                    var summaryFetcher = new GameSummaryFetcher(this, i, this.receiveSummaryData.bind(this));
                    summaryFetcher.fetchData();
                }

                LOGGER.debug("gameSummaries loading from the internet");
            }

            if (!this.gameDetailMap())
            {
                store.dispatch(Action.resetGameDetailMap());
            }
        };

        this.mechanics = function()
        {
            return getEntities("boardgamemechanic");
        };

        this.receiveDetailData = function(newGameDetailMap)
        {
            LOGGER.trace("GameDatabase.receiveDetailData() start");

            store.dispatch(Action.mergeGameDetailMap(newGameDetailMap));
            that.storeToLocalStorage();

            LOGGER.trace("GameDatabase.receiveDetailData() end");
        };

        this.receiveSummaryData = function(newGameSummaryMap)
        {
            LOGGER.trace("GameDatabase.receiveSummaryData() start");

            store.dispatch(Action.mergeGameSummaryMap(newGameSummaryMap));
            that.storeToLocalStorage();

            // Fetch a game detail for each game summary.
            var needGameDetailIds = [];
            var keys = Object.keys(newGameSummaryMap);
            var i, len;

            for (i = 0, len = keys.length; i < len; i++)
            {
                var gameSummary = newGameSummaryMap[keys[i]];
                var gameDetail = that.findGameDetailById(gameSummary.id);

                if (!gameDetail)
                {
                    needGameDetailIds.push(gameSummary.id);
                }
            }

            if (needGameDetailIds.length > 0)
            {
                var numPerCall = 20;
                var count = Math.ceil(needGameDetailIds.length / numPerCall);

                for (i = 0; i < count; i++)
                {
                    var start = numPerCall * i;
                    var max = Math.min(numPerCall, needGameDetailIds.length);
                    var end = start + max;
                    var detailFetcher = new GameDetailFetcher(that, needGameDetailIds.slice(start, end),
                            that.receiveDetailData.bind(that));
                    detailFetcher.fetchData();
                }
            }

            LOGGER.trace("GameDatabase.receiveSummaryData() end");
        };

        this.storeToLocalStorage = function()
        {
            if (!Object.vizziniIsEmpty(this.entityMap()))
            {
                if (!this.entityTimestamp())
                {
                    store.dispatch(Action.setEntityTimestamp(Date.now()));
                }
                localStorage.entityTimestamp = this.entityTimestamp();
                localStorage.entityMap = JSON.stringify(this.entityMap());
                LOGGER.debug("entityMap stored to localStorage with timestamp " + this.entityTimestamp());
            }

            if (!Object.vizziniIsEmpty(this.gameDetailMap()))
            {
                if (!this.gameDetailTimestamp())
                {
                    store.dispatch(Action.setGameDetailTimestamp(Date.now()));
                }
                localStorage.gameDetailTimestamp = this.gameDetailTimestamp();
                localStorage.gameDetailMap = JSON.stringify(this.gameDetailMap());
                LOGGER.debug("gameDetailMap stored to localStorage with timestamp " + this.gameDetailTimestamp());
            }

            if (!Object.vizziniIsEmpty(this.gameSummaryMap()))
            {
                if (!this.gameSummaryTimestamp())
                {
                    store.dispatch(Action.setGameSummaryTimestamp(Date.now()));
                }
                localStorage.gameSummaryTimestamp = this.gameSummaryTimestamp();
                localStorage.gameSummaryMap = JSON.stringify(this.gameSummaryMap());
                LOGGER.debug("gameSummaryMap stored to localStorage with timestamp " + this.gameSummaryTimestamp());
            }
        };

        function getEntities(type)
        {
            var answer = [];

            var entityMap = that.entityMap();
            var keys = Object.keys(entityMap);
            for (var i = 0, len = keys.length; i < len; i++)
            {
                var entity = entityMap[keys[i]];
                if (entity.type === type)
                {
                    answer.push(entity);
                }
            }

            answer.sort(function(a, b)
            {
                var answer = b.count - a.count;

                if (answer === 0)
                {
                    if (a.name > b.name)
                    {
                        answer = 1;
                    }
                    else if (a.name < b.name)
                    {
                        answer = -1;
                    }
                    else
                    {
                        answer = 0;
                    }
                }
                return answer;
            });

            return answer;
        }
    }

    GameDatabase.prototype.entityMap = function()
    {
        return this.store().getState().entityMap;
    };

    GameDatabase.prototype.entityTimestamp = function()
    {
        return this.store().getState().entityTimestamp;
    };

    GameDatabase.prototype.filters = function()
    {
        return this.store().getState().filters;
    };

    GameDatabase.prototype.findEntityById = function(id)
    {
        return this.entityMap()[id];
    };

    GameDatabase.prototype.findGameDetailById = function(id)
    {
        return this.gameDetailMap()[id];
    };

    GameDatabase.prototype.findGameSummaryById = function(id)
    {
        return this.gameSummaryMap()[id];
    };

    GameDatabase.prototype.gameDetailMap = function()
    {
        return this.store().getState().gameDetailMap;
    };

    GameDatabase.prototype.gameDetailTimestamp = function()
    {
        return this.store().getState().gameDetailTimestamp;
    };

    GameDatabase.prototype.gameSummaryMap = function()
    {
        return this.store().getState().gameSummaryMap;
    };

    GameDatabase.prototype.gameSummaryTimestamp = function()
    {
        return this.store().getState().gameSummaryTimestamp;
    };

    GameDatabase.prototype.newEntity = function(type, id, name)
    {
        var entityMap = this.entityMap();
        var answer = entityMap[id];

        if (answer)
        {
            // Increment count.
            answer.count++;
        }
        else
        {
            answer =
            {
                type: type,
                id: parseInt(id),
                name: name,
                count: 1,
            };

            entityMap[answer.id] = answer;
        }

        return answer;
    };

    GameDatabase.prototype.newGameDetail = function(id, title, designers, yearPublished, minPlayers, maxPlayers,
            bestWithPlayers, minPlayTime, maxPlayTime, categories, mechanics)
    {
        var gameDetailMap = this.gameDetailMap();
        var answer = gameDetailMap[id];

        if (!answer)
        {
            answer =
            {
                id: parseInt(id),
                title: title,
                designers: designers,
                yearPublished: parseInt(yearPublished),
                minPlayers: parseInt(minPlayers),
                maxPlayers: parseInt(maxPlayers),
                bestWithPlayers: parseInt(bestWithPlayers),
                minPlayTime: parseInt(minPlayTime),
                maxPlayTime: parseInt(maxPlayTime),
                categories: categories,
                mechanics: mechanics,
            };

            gameDetailMap[answer.id] = answer;
        }

        return answer;
    };

    GameDatabase.prototype.newGameSummary = function(id, title, boardGameRank, geekRatingDisplay, averageRatingDisplay,
            numVoters)
    {
        var gameSummaryMap = this.gameSummaryMap();
        var answer = gameSummaryMap[id];

        if (!answer)
        {
            answer =
            {
                id: parseInt(id),
                title: title,
                boardGameRank: parseInt(boardGameRank),
                geekRating: parseFloat(geekRatingDisplay),
                geekRatingDisplay: geekRatingDisplay,
                averageRating: parseFloat(averageRatingDisplay),
                averageRatingDisplay: averageRatingDisplay,
                numVoters: parseInt(numVoters),
            };

            gameSummaryMap[answer.id] = answer;
        }

        return answer;
    };

    GameDatabase.passesFilters = function(filters, gameSummary, gameDetail)
    {
        var passes = true;

        filters.forEach(function(filter)
        {
            passes = passes && filter.passes(gameSummary, gameDetail);
        });

        return passes;
    };

    return GameDatabase;
});

define([ "ActivationAction", "CombatAction", "Phase", "Pilot", "PlanningAction", "RangeRuler", "Team", "UpgradeCard" ],
        function(ActivationAction, CombatAction, Phase, Pilot, PlanningAction, RangeRuler, Team, UpgradeCard)
        {
            "use strict";
            function Engine(environment, adjudicator)
            {
                InputValidator.validateNotNull("environment", environment);
                InputValidator.validateNotNull("adjudicator", adjudicator);

                this.environment = function()
                {
                    return environment;
                };

                this.adjudicator = function()
                {
                    return adjudicator;
                };

                var that = this;
                var firstTokenToManeuver, secondTokenToManeuver;
                var activationQueue = [];
                var combatQueue = [];
                var endQueue = [];
                var delay = 1000;

                this.firstTokenToManeuver = function()
                {
                    return firstTokenToManeuver;
                };

                this.performActivationPhase = function()
                {
                    if (!isGameOver())
                    {
                        LOGGER.trace("Engine.performActivationPhase() start");
                        environment.phase(Phase.ACTIVATION_START);
                        activationQueue = environment.getTokensForActivation(true);
                        this.processActivationQueue();
                    }
                };

                this.performCombatPhase = function()
                {
                    if (!isGameOver())
                    {
                        LOGGER.trace("Engine.performCombatPhase() start");
                        environment.phase(Phase.COMBAT_START);

                        // Search for Epsilon Leader.
                        var tokens = environment.getTokensForCombat().filter(function(token)
                        {
                            return token.pilotKey() === Pilot.EPSILON_LEADER;
                        });

                        if (tokens.length > 0)
                        {
                            var epsilonLeader = tokens[0];
                            var friendlies = environment.getFriendlyTokensAtRange(epsilonLeader, RangeRuler.ONE);

                            friendlies.forEach(function(token)
                            {
                                token.removeStress();
                            });
                        }

                        // Search for a ship upgraded with Ysanne Isard.
                        tokens = environment.getTokensForCombat().filter(function(token)
                        {
                            return token.isUpgradedWith(UpgradeCard.YSANNE_ISARD);
                        });

                        if (tokens.length > 0)
                        {
                            var ysanneIsard = tokens[0];

                            if (ysanneIsard.shield().count() === 0 &&
                                    (ysanneIsard.damageCount() > 0 || ysanneIsard.criticalDamageCount() > 0))
                            {
                                ysanneIsard.evade().increase();
                            }
                        }

                        combatQueue = environment.getTokensForCombat();
                        this.processCombatQueue();
                    }
                };

                this.performEndPhase = function()
                {
                    if (!isGameOver())
                    {
                        LOGGER.trace("Engine.performEndPhase() start");
                        environment.phase(Phase.END_START);

                        endQueue = environment.getTokensForCombat();
                        this.processEndQueue();
                    }
                };

                this.performPlanningPhase = function()
                {
                    if (!isGameOver())
                    {
                        LOGGER.trace("Engine.performPlanningPhase() start");

                        environment.phase(Phase.PLANNING_START);
                        environment.incrementRound();

                        var firstAgent = environment.firstAgent();
                        var firstPlanningAction = new PlanningAction(environment, adjudicator, firstAgent,
                                that.setTokenToManeuver);
                        firstPlanningAction.doIt();

                        var secondAgent = environment.secondAgent();
                        var secondPlanningAction = new PlanningAction(environment, adjudicator, secondAgent,
                                that.setTokenToManeuver);
                        secondPlanningAction.doIt();

                        // Wait for agents to respond.
                    }
                };

                this.processActivationQueue = function()
                {
                    LOGGER.trace("Engine.processActivationQueue() start");

                    if (activationQueue.length === 0)
                    {
                        firstTokenToManeuver = undefined;
                        secondTokenToManeuver = undefined;

                        environment.activeToken(undefined);
                        LOGGER.trace("Engine.processActivationQueue() done");
                        environment.phase(Phase.ACTIVATION_END);
                        setTimeout(function()
                        {
                            that.performCombatPhase();
                        }, delay);
                        return;
                    }

                    var token = activationQueue.shift();
                    environment.activeToken(token);
                    var factionKey = token.pilot().shipTeam.teamKey;
                    var myToken = token;

                    if (token.parent && token.pilot().value.endsWith("fore"))
                    {
                        myToken = token.parent;
                    }

                    var maneuverKey;

                    if (Team.isFriendly(factionKey, environment.firstTeam()))
                    {
                        maneuverKey = firstTokenToManeuver[myToken];
                    }
                    else
                    {
                        maneuverKey = secondTokenToManeuver[myToken];
                    }

                    var activationAction = new ActivationAction(environment, adjudicator, token, maneuverKey,
                            this.processActivationQueue.bind(this));
                    activationAction.doIt();

                    LOGGER.trace("Engine.processActivationQueue() end");
                };

                this.processCombatQueue = function()
                {
                    LOGGER.trace("Engine.processCombatQueue() start");

                    if (combatQueue.length === 0)
                    {
                        // Search for a ship upgraded with R5-P9.
                        var tokens = environment.getTokensForCombat().filter(function(token)
                        {
                            return token.isUpgradedWith(UpgradeCard.R5_P9);
                        });

                        if (tokens.length > 0)
                        {
                            var r5p9 = tokens[0];

                            if (r5p9.focus().count() > 0 && r5p9.shield().count() < r5p9.shieldValue())
                            {
                                r5p9.focus().decrease();
                                r5p9.recoverShield();
                            }
                        }

                        environment.activeToken(undefined);
                        LOGGER.trace("Engine.processCombatQueue() done");
                        environment.phase(Phase.COMBAT_END);
                        setTimeout(function()
                        {
                            that.performEndPhase();
                        }, delay);
                        return;
                    }

                    var attacker = combatQueue.shift();

                    if (attacker)
                    {
                        environment.activeToken(attacker);

                        if (adjudicator.canAttack(attacker))
                        {
                            // Perform combat steps.
                            LOGGER.debug("attacker = " + attacker.name());

                            // Declare target.
                            var agent = attacker.agent();
                            agent
                                    .chooseWeaponAndDefender(environment, adjudicator, attacker,
                                            that.setWeaponAndDefender);

                            // Wait for agent to respond.
                        }
                        else
                        {
                            // Proceed.
                            setTimeout(that.processCombatQueue, delay);
                        }
                    }

                    LOGGER.trace("Engine.processCombatQueue() end");
                };

                this.processEndQueue = function()
                {
                    LOGGER.trace("Engine.processEndQueue() start");

                    if (endQueue.length === 0)
                    {
                        environment.activeToken(undefined);
                        LOGGER.trace("Engine.processEndQueue() done");
                        environment.phase(Phase.END_END);
                        setTimeout(function()
                        {
                            that.performPlanningPhase();
                        }, delay);
                        return;
                    }

                    var token = endQueue.shift();

                    if (token)
                    {
                        environment.activeToken(token);

                        // Perform end steps.
                        token.evade().clear();

                        if (!token.isUpgradedWith(UpgradeCard.MOLDY_CROW))
                        {
                            token.focus().clear();
                        }

                        token.reinforce().clear();
                        token.weaponsDisabled().clear();
                    }

                    this.processEndQueue();
                    LOGGER.trace("Engine.processEndQueue() end");
                };

                this.secondTokenToManeuver = function()
                {
                    return secondTokenToManeuver;
                };

                this.setTokenToManeuver = function(agent, tokenToManeuver)
                {
                    if (agent === environment.firstAgent())
                    {
                        firstTokenToManeuver = tokenToManeuver;
                        LOGGER.trace("firstTokenToManeuver = " + firstTokenToManeuver);
                    }
                    else if (agent === environment.secondAgent())
                    {
                        secondTokenToManeuver = tokenToManeuver;
                        LOGGER.trace("secondTokenToManeuver = " + secondTokenToManeuver);
                    }
                    else
                    {
                        LOGGER.error("planningAction agent = " + agent);
                    }

                    if (firstTokenToManeuver && secondTokenToManeuver)
                    {
                        LOGGER.trace("Engine.performPlanningPhase() end");
                        environment.phase(Phase.PLANNING_END);
                        setTimeout(function()
                        {
                            that.performActivationPhase();
                        }, delay);
                    }
                };

                this.setWeaponAndDefender = function(weapon, defender)
                {
                    if (weapon && defender)
                    {
                        LOGGER.debug("weapon = " + weapon);
                        LOGGER.debug("defender = " + defender);
                        var attacker = environment.activeToken();
                        var attackerPosition = environment.getPositionFor(attacker);

                        if (defender)
                        {
                            environment.phase(Phase.COMBAT_DECLARE_TARGET);
                            var defenderPosition = environment.getPositionFor(defender);

                            var combatAction = new CombatAction(environment, adjudicator, attacker, attackerPosition,
                                    weapon, defender, defenderPosition, that.processCombatQueue);
                            LOGGER.trace("combatAction = " + combatAction);
                            combatAction.doIt();
                        }
                    }
                    else
                    {
                        that.processCombatQueue();
                    }
                };

                function isGameOver()
                {
                    var answer = adjudicator.isGameOver(environment);

                    if (answer)
                    {
                        LOGGER.debug("adjudicator.isGameOver() ? " + adjudicator.isGameOver(environment));
                        processGameOver();
                    }

                    return answer;
                }

                function processGameOver()
                {
                    var winner = adjudicator.determineWinner(environment);

                    that.trigger(Engine.WINNER_EVENT, winner);

                    return winner;
                }
            }

            Engine.WINNER_EVENT = "winner";

            MicroEvent.mixin(Engine);

            return Engine;
        });

define(["Maneuver", "Phase", "process/Action", "process/ActivationAction", "process/Adjudicator", "process/CombatAction", "process/EnvironmentFactory", "process/PilotAbility3", "../../../test/js/MockAttackDice", "../../../test/js/MockDefenseDice"],
    function(Maneuver, Phase, Action, ActivationAction, Adjudicator, CombatAction, EnvironmentFactory, PilotAbility, MockAttackDice, MockDefenseDice)
    {
        "use strict";
        QUnit.module("PilotAbility3");

        QUnit.test("condition()", function(assert)
        {
            // Setup.
            var environment = createEnvironment();
            var store = environment.store();
            var token = environment.tokens()[2]; // X-Wing.

            // Run / Verify.
            Phase.values().forEach(function(phaseKey)
            {
                var abilities = PilotAbility[phaseKey];

                if (abilities)
                {
                    Object.keys(abilities).forEach(function(pilotKey)
                    {
                        var ability = abilities[pilotKey];

                        if (ability.condition)
                        {
                            var result = ability.condition(store, token);
                            assert.ok(result !== undefined, "phaseKey = " + phaseKey + " pilotKey = " + pilotKey);
                        }
                    });
                }
            });
        });

        QUnit.test("consequent()", function(assert)
        {
            // Setup.
            var environment = createEnvironment();
            var store = environment.store();
            var token = environment.tokens()[2]; // X-Wing.

            // Run / Verify.
            Phase.values().forEach(function(phaseKey)
            {
                var abilities = PilotAbility[phaseKey];

                if (abilities)
                {
                    Object.keys(abilities).forEach(function(pilotKey)
                    {
                        var ability = abilities[pilotKey];

                        if (ability.condition && ability.condition(store, token))
                        {
                            ability.consequent(store, token);
                            assert.ok(true, "phaseKey = " + phaseKey + " pilotKey = " + pilotKey);
                        }
                    });
                }
            });
        });

        QUnit.test("function()", function(assert)
        {
            // Setup.
            var environment = createEnvironment();
            var store = environment.store();
            var token = environment.tokens()[2]; // X-Wing.

            // Run / Verify.
            Phase.values().forEach(function(phaseKey)
            {
                var abilities = PilotAbility[phaseKey];

                if (abilities)
                {
                    Object.keys(abilities).forEach(function(pilotKey)
                    {
                        var ability = abilities[pilotKey];

                        if (typeof ability === "function")
                        {
                            ability(store, token);
                            assert.ok(true, "phaseKey = " + phaseKey + " pilotKey = " + pilotKey);
                        }
                    });
                }
            });

            assert.ok(true);
        });

        function createEnvironment()
        {
            var environment = EnvironmentFactory.createCoreSetEnvironment();
            var adjudicator = new Adjudicator();

            var store = environment.store();
            var attacker = environment.tokens()[2]; // X-Wing.
            var attackerPosition = environment.getPositionFor(attacker);
            var weapon = attacker.primaryWeapon();
            var defender = environment.tokens()[0]; // TIE Fighter.
            var defenderPosition = environment.getPositionFor(defender);
            var callback = function()
            {
                LOGGER.info("in callback()");
            };

            store.dispatch(Action.setEnvironment(environment));
            store.dispatch(Action.setActiveToken(attacker.id()));
            store.dispatch(Action.addFocusCount(attacker));
            store.dispatch(Action.addStressCount(attacker));

            var combatState = attacker.combatState();
            combatState.attackDice(new MockAttackDice());
            combatState.defenseDice(new MockDefenseDice());
            combatState.isInFiringArc(true);
            combatState.isDefenderHit(true);

            var combatAction = new CombatAction(environment, adjudicator, attacker, attackerPosition, weapon, defender,
                defenderPosition, callback, MockAttackDice, MockDefenseDice);
            combatState.combatAction(combatAction);

            return environment;
        }
    });

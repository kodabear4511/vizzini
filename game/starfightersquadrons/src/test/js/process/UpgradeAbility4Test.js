define(["Phase", "process/Action", "process/Adjudicator", "process/CombatAction", "process/EnvironmentFactory", "process/UpgradeAbility4", "../../../test/js/MockAttackDice", "../../../test/js/MockDefenseDice"],
    function(Phase, Action, Adjudicator, CombatAction, EnvironmentFactory, UpgradeAbility, MockAttackDice, MockDefenseDice)
    {
        "use strict";
        QUnit.module("UpgradeAbility4");

        QUnit.test("condition()", function(assert)
        {
            // Setup.
            var environment = createEnvironment();
            var store = environment.store();
            var token = environment.tokens()[2]; // X-Wing.

            // Run / Verify.
            Phase.values().forEach(function(phaseKey)
            {
                var abilities = UpgradeAbility[phaseKey];

                if (abilities)
                {
                    Object.keys(abilities).forEach(function(upgradeKey)
                    {
                        var ability = abilities[upgradeKey];

                        if (ability.condition)
                        {
                            var result = ability.condition(store, token);
                            assert.ok(result !== undefined, "phaseKey = " + phaseKey + " upgradeKey = " + upgradeKey);
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
                var abilities = UpgradeAbility[phaseKey];

                if (abilities)
                {
                    Object.keys(abilities).forEach(function(upgradeKey)
                    {
                        var ability = abilities[upgradeKey];

                        if (ability.condition && ability.condition(store, token))
                        {
                            ability.consequent(store, token);
                            assert.ok(true, "phaseKey = " + phaseKey + " upgradeKey = " + upgradeKey);
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
                var abilities = UpgradeAbility[phaseKey];

                if (abilities)
                {
                    Object.keys(abilities).forEach(function(upgradeKey)
                    {
                        var ability = abilities[upgradeKey];

                        if (typeof ability === "function")
                        {
                            ability(store, token);
                            assert.ok(true, "phaseKey = " + phaseKey + " upgradeKey = " + upgradeKey);
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

            var combatAction = new CombatAction(environment, adjudicator, attacker, attackerPosition, weapon, defender,
                defenderPosition, callback, MockAttackDice, MockDefenseDice);
            combatState.combatAction(combatAction);

            return environment;
        }
    });

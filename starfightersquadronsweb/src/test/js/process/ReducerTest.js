define([ "Phase", "Pilot", "PlayFormat", "SimpleAgent", "Team", "UpgradeCard", "process/Action", "process/Reducer" ],
        function(Phase, Pilot, PlayFormat, SimpleAgent, Team, UpgradeCard, Action, Reducer)
        {
            "use strict";
            QUnit.module("Reducer");

            QUnit.test("addRound()", function(assert)
            {
                // Setup.
                var store = Redux.createStore(Reducer.root);
                assert.equal(store.getState().round, 0);

                // Run.
                store.dispatch(Action.addRound());

                // Verify.
                assert.equal(store.getState().round, 1);

                // Run.
                store.dispatch(Action.addRound(2));

                // Verify.
                assert.equal(store.getState().round, 3);
            });

            QUnit.test("setActiveToken()", function(assert)
            {
                // Setup.
                var store = Redux.createStore(Reducer.root);
                assert.ok(!store.getState().activeTokenId);

                // Run.
                store.dispatch(Action.setActiveToken(1));

                // Verify.
                assert.equal(store.getState().activeTokenId, 1);

                // Run.
                store.dispatch(Action.setActiveToken(2));

                // Verify.
                assert.equal(store.getState().activeTokenId, 2);
            });

            QUnit.test("setFirstAgent()", function(assert)
            {
                // Setup.
                var agent = new SimpleAgent("Bob", Team.IMPERIAL);
                var store = Redux.createStore(Reducer.root);
                assert.ok(!store.getState().firstAgent);

                // Run.
                store.dispatch(Action.setFirstAgent(agent));

                // Verify.
                assert.equal(store.getState().firstAgent, agent);
            });

            QUnit.test("setPhase()", function(assert)
            {
                // Setup.
                var store = Redux.createStore(Reducer.root);
                assert.equal(store.getState().phaseKey, Phase.SETUP);

                // Run.
                store.dispatch(Action.setPhase(Phase.ACTIVATION_START));

                // Verify.
                assert.equal(store.getState().phaseKey, Phase.ACTIVATION_START);

                // Run.
                store.dispatch(Action.setPhase(Phase.COMBAT_MODIFY_ATTACK_DICE));

                // Verify.
                assert.equal(store.getState().phaseKey, Phase.COMBAT_MODIFY_ATTACK_DICE);
            });

            QUnit.test("setPlayFormat()", function(assert)
            {
                // Setup.
                var store = Redux.createStore(Reducer.root);
                assert.equal(store.getState().playFormatKey, undefined);

                // Run.
                store.dispatch(Action.setPlayFormat(PlayFormat.STANDARD));

                // Verify.
                assert.equal(store.getState().playFormatKey, PlayFormat.STANDARD);

                // Run.
                store.dispatch(Action.setPlayFormat(PlayFormat.EPIC));

                // Verify.
                assert.equal(store.getState().playFormatKey, PlayFormat.EPIC);
            });

            QUnit.test("setSecondAgent()", function(assert)
            {
                // Setup.
                var agent = new SimpleAgent("Mike", Team.REBEL);
                var store = Redux.createStore(Reducer.root);
                assert.ok(!store.getState().secondAgent);

                // Run.
                store.dispatch(Action.setSecondAgent(agent));

                // Verify.
                assert.equal(store.getState().secondAgent, agent);
            });
        });

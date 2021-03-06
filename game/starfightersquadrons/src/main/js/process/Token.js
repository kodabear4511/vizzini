define(["ActivationState", "Bearing", "CombatState", "Count", "DamageCard", "DamageCardV2", "Difficulty", "Maneuver", "Phase", "Pilot", "RangeRuler", "ShipAction", "ShipBase", "UpgradeCard", "UpgradeType", "Value", "Weapon", "process/Action", "process/DamageAbility2", "process/Selector", "process/ShipActionAction", "process/UpgradeAbility2"],
    function(ActivationState, Bearing, CombatState, Count, DamageCard, DamageCardV2, Difficulty, Maneuver, Phase, Pilot, RangeRuler, ShipAction, ShipBase, UpgradeCard, UpgradeType, Value, Weapon, Action, DamageAbility2, Selector, ShipActionAction, UpgradeAbility2)
    {
        "use strict";

        function Token(store, pilotKeyIn, agent, upgradeKeysIn)
        {
            InputValidator.validateNotNull("store", store);
            InputValidator.validateNotNull("pilotKeyIn", pilotKeyIn);
            InputValidator.validateNotNull("agent", agent);

            this.store = function()
            {
                return store;
            };

            var pilotKey, pilot;

            if (typeof pilotKeyIn === "string")
            {
                pilotKey = pilotKeyIn;
                pilot = Pilot.properties[pilotKey];
            }
            else
            {
                pilot = pilotKeyIn;
                pilotKey = pilot.value;
            }

            this.agent = function()
            {
                return agent;
            };

            var ship;

            this.ship = function()
            {
                if (!ship)
                {
                    ship = pilot.shipTeam.ship;

                    if (pilot.value.endsWith("fore"))
                    {
                        ship = ship.fore;
                    }
                    else if (pilot.value.endsWith("aft"))
                    {
                        ship = ship.aft;
                    }
                    else if (pilot.value.endsWith("crippledFore"))
                    {
                        ship = ship.crippledFore;
                    }
                    else if (pilot.value.endsWith("crippledAft"))
                    {
                        ship = ship.crippledAft;
                    }
                }

                return ship;
            };

            this.activationState = function()
            {
                return activationState;
            };

            this.combatState = function()
            {
                return combatState;
            };

            this.discardUpgrade = function(upgradeKey)
            {
                InputValidator.validateNotNull("upgradeKey", upgradeKey);

                store.dispatch(Action.removeTokenUpgrade(this, upgradeKey));
                var upgrade = UpgradeCard.properties[upgradeKey];

                if (upgrade.weaponValue !== undefined)
                {
                    for (var i = 0; i < secondaryWeapons.length; i++)
                    {
                        var weapon = secondaryWeapons[i];

                        if (weapon.upgradeKey() === upgradeKey)
                        {
                            secondaryWeapons.vizziniRemove(weapon);
                        }
                    }
                }
            };

            this.id = function()
            {
                return id;
            };

            this.maneuverKeys = function()
            {
                var answer;

                if (this.isIonized())
                {
                    answer = [Maneuver.STRAIGHT_1_STANDARD];
                }
                else
                {
                    answer = pilot.shipTeam.ship.maneuverKeys.slice();

                    if (this.isCriticallyDamagedWith(DamageCard.DAMAGED_ENGINE) ||
                        this.isCriticallyDamagedWith(DamageCardV2.DAMAGED_ENGINE))
                    {
                        answer = changeBearingManeuversToDifficulty(answer, Bearing.TURN_LEFT, Difficulty.HARD);
                        answer = changeBearingManeuversToDifficulty(answer, Bearing.TURN_RIGHT, Difficulty.HARD);
                    }

                    if (this.isUpgradedWith(UpgradeCard.NIEN_NUNB))
                    {
                        answer = changeBearingManeuversToDifficulty(answer, Bearing.STRAIGHT, Difficulty.EASY);
                    }

                    if (this.isUpgradedWith(UpgradeCard.R2_ASTROMECH))
                    {
                        answer = changeSpeedManeuversToDifficulty(answer, 1, Difficulty.EASY);
                        answer = changeSpeedManeuversToDifficulty(answer, 2, Difficulty.EASY);
                    }

                    if (this.isUpgradedWith(UpgradeCard.TWIN_ION_ENGINE_MK_II))
                    {
                        answer = changeBearingManeuversToDifficulty(answer, Bearing.BANK_LEFT, Difficulty.EASY);
                        answer = changeBearingManeuversToDifficulty(answer, Bearing.BANK_RIGHT, Difficulty.EASY);
                    }

                    if (this.isUpgradedWith(UpgradeCard.UNHINGED_ASTROMECH))
                    {
                        answer = changeSpeedManeuversToDifficulty(answer, 3, Difficulty.EASY);
                    }

                    if (this.isStressed() && !this.isUpgradedWith(UpgradeCard.HERA_SYNDULLA))
                    {
                        answer = answer.filter(function(maneuverKey)
                        {
                            return Maneuver.properties[maneuverKey].difficultyKey !== Difficulty.HARD;
                        });
                    }
                }

                return answer;
            };

            this.newInstance = function(store, agent)
            {
                InputValidator.validateNotNull("store", store);
                InputValidator.validateNotNull("agent", agent);

                var answer = new Token(store, pilotKey, agent);

                this.upgradeKeys().forEach(function(upgradeKey)
                {
                    store.dispatch(Action.addTokenUpgrade(answer, upgradeKey));
                    var upgrade = UpgradeCard.properties[upgradeKey];

                    if (upgrade.weaponValue)
                    {
                        answer.secondaryWeapons().push(createSecondaryWeapon(upgrade));
                    }
                });

                return answer;
            };

            this.pilot = function()
            {
                return pilot;
            };

            this.pilotKey = function()
            {
                return pilotKey;
            };

            this.primaryWeapon = function()
            {
                return primaryWeapon;
            };

            this.secondaryWeapons = function()
            {
                return secondaryWeapons;
            };

            this.shipState = function(property)
            {
                InputValidator.validateNotNull("property", property);

                var propertyName = property + "Value";
                var ship = that.ship();

                var answer = pilot[propertyName];

                if (answer === undefined)
                {
                    answer = ship[propertyName];
                }

                if (answer === undefined && ship.fore)
                {
                    answer = ship.fore[propertyName];
                }

                if (answer === undefined && ship.aft)
                {
                    answer = ship.aft[propertyName];
                }

                return (answer !== undefined ? answer : null);
            };

            function changeBearingManeuversToDifficulty(maneuverKeys, bearingKey, difficultyKey)
            {
                return maneuverKeys.map(function(maneuverKey)
                {
                    var maneuver = Maneuver.properties[maneuverKey];
                    var myBearingKey = maneuver.bearingKey;

                    if (myBearingKey === bearingKey)
                    {
                        var speed = maneuver.speed;
                        var answer = Maneuver.find(bearingKey, speed, difficultyKey);
                        if (!answer)
                        {
                            throw "Unknown maneuver: " + bearingKey + " " + speed + " " + difficultyKey;
                        }
                        return answer;
                    }
                    else
                    {
                        return maneuverKey;
                    }
                });
            }

            function changeSpeedManeuversToDifficulty(maneuverKeys, speed, difficultyKey)
            {
                return maneuverKeys.map(function(maneuverKey)
                {
                    var maneuver = Maneuver.properties[maneuverKey];
                    var mySpeed = maneuver.speed;

                    if (mySpeed === speed)
                    {
                        var bearingKey = maneuver.bearingKey;
                        var answer = Maneuver.find(bearingKey, speed, difficultyKey);
                        if (!answer)
                        {
                            throw "Unknown maneuver: " + bearingKey + " " + speed + " " + difficultyKey;
                        }
                        return answer;
                    }
                    else
                    {
                        return maneuverKey;
                    }
                });
            }

            function createPrimaryWeapon()
            {
                var primaryWeaponValue = that.shipState(Value.PRIMARY_WEAPON);
                var ship = that.ship();

                return new Weapon("Primary Weapon", primaryWeaponValue, ship.primaryWeaponRanges, ship.primaryFiringArcKey,
                    ship.auxiliaryFiringArcKey, ship.isPrimaryWeaponTurret);
            }

            function createSecondaryWeapon(upgrade)
            {
                return new Weapon(upgrade.name, upgrade.weaponValue, upgrade.ranges, upgrade.firingArcKey, undefined,
                    upgrade.isWeaponTurret, upgrade.value);
            }

            // /////////////////////////////////////////////////////////////////////
            // Initialize.
            var that = this;
            var id = store.getState().nextTokenId;
            store.dispatch(Action.incrementNextTokenId());

            Value.values().forEach(function(property)
            {
                store.dispatch(Action.setValue(this, property, this.shipState(property)));
            }, this);

            Count.values().forEach(function(property)
            {
                var value;

                switch (property)
                {
                    case Count.ENERGY:
                        value = this.shipState(Value.ENERGY);
                        store.dispatch(Action.setEnergyCount(that, value));
                        break;
                    case Count.SHIELD:
                        value = this.shipState(Value.SHIELD);
                        store.dispatch(Action.setShieldCount(that, value));
                        break;
                    default:
                        store.dispatch(Action.setCount(that, property));
                }
            }, this);

            var primaryWeapon = (this.shipState(Value.PRIMARY_WEAPON) !== null ? createPrimaryWeapon() : undefined);
            var secondaryWeapons = [];

            // Initialize the upgrades.
            if (upgradeKeysIn)
            {
                upgradeKeysIn.forEach(function(upgradeKey)
                {
                    store.dispatch(Action.addTokenUpgrade(that, upgradeKey));
                    var upgrade = UpgradeCard.properties[upgradeKey];

                    if (upgrade.weaponValue)
                    {
                        secondaryWeapons.push(createSecondaryWeapon(upgrade));
                    }
                });
            }

            if (upgradeKeysIn)
            {
                upgradeKeysIn.forEach(function(upgradeKey)
                {
                    var upgrade = UpgradeCard.properties[upgradeKey];

                    if (upgrade.energyLimit !== undefined)
                    {
                        store.dispatch(Action.setTokenUpgradeEnergy(id, upgradeKey, upgrade.energyLimit));
                    }
                });
            }

            var activationState = new ActivationState();
            var combatState = new CombatState();
        }

        Token.prototype.addAttackerTargetLock = function(targetLock)
        {
            InputValidator.validateNotNull("targetLock", targetLock);

            var attackerTargetLocks = this.attackerTargetLocks();

            if (attackerTargetLocks.length > 0)
            {
                // Remove previous target lock.
                var previous = attackerTargetLocks[0];
                this.removeAttackerTargetLock(previous);
            }

            this.store().dispatch(Action.addTargetLock(targetLock));
        };

        Token.prototype.addCriticalDamage = function(damageKey)
        {
            if (this.pilotKey() === Pilot.CHEWBACCA)
            {
                this.addDamage(damageKey);
            }
            else
            {
                this.store().dispatch(Action.addTokenCriticalDamage(this, damageKey));
            }
        };

        Token.prototype.addDamage = function(damageKey)
        {
            this.store().dispatch(Action.addTokenDamage(this.id(), damageKey));
        };

        Token.prototype.agilityValue = function()
        {
            return Selector.agilityValue(this.store().getState(), this.id());
        };

        Token.prototype.attackerTargetLocks = function()
        {
            return Selector.attackerTargetLocks(this.store().getState(), this);
        };

        Token.prototype.cloakCount = function()
        {
            return Selector.cloakCount(this.store().getState(), this.id());
        };

        Token.prototype.computeAttackDiceCount = function(environment, weapon, defender, rangeKey)
        {
            InputValidator.validateNotNull("environment", environment);
            InputValidator.validateNotNull("weapon", weapon);
            InputValidator.validateNotNull("defender", defender);
            InputValidator.validateNotNull("rangeKey", rangeKey);

            var answer;

            if (this.isCriticallyDamagedWith(DamageCard.BLINDED_PILOT))
            {
                answer = 0;
                this.flipDamageCardFacedown(DamageCard.BLINDED_PILOT);
            }
            else
            {
                answer = weapon.weaponValue();

                if ((rangeKey === RangeRuler.ONE) && weapon.isPrimary())
                {
                    // Bonus attack die at range one.
                    answer++;

                    if (this.pilotKey() === Pilot.TALONBANE_COBRA)
                    {
                        answer++;
                    }
                    else if (weapon.upgradeKey() === UpgradeCard.DORSAL_TURRET)
                    {
                        answer++;
                    }
                }

                if (this.pilotKey() === Pilot.EADEN_VRILL && weapon.isPrimary() && defender.isStressed())
                {
                    answer++;
                }

                if (this.pilotKey() === Pilot.MAULER_MITHEL && rangeKey === RangeRuler.ONE)
                {
                    answer++;
                }

                if (weapon.upgradeKey() === UpgradeCard.PROTON_ROCKETS)
                {
                    answer += Math.min(this.agilityValue(), 3);
                }

                if (this.isCriticallyDamagedWith(DamageCardV2.WEAPONS_FAILURE))
                {
                    answer -= 1;
                }
            }

            return answer;
        };

        Token.prototype.computeDefenseDiceCount = function(weapon, rangeKey)
        {
            var answer = this.agilityValue();

            if ([RangeRuler.THREE, RangeRuler.FOUR, RangeRuler.FIVE].vizziniContains(rangeKey) && weapon.isPrimary())
            {
                // Bonus defense die at range three, four, and five.
                answer++;

                if (this.pilotKey() === Pilot.TALONBANE_COBRA)
                {
                    answer++;
                }
            }

            return answer;
        };

        Token.prototype.criticalDamageCount = function()
        {
            return this.criticalDamages().length;
        };

        Token.prototype.criticalDamages = function()
        {
            return Selector.criticalDamages(this.store().getState(), this.id());
        };

        Token.prototype.damageCount = function()
        {
            return this.damages().length;
        };

        Token.prototype.damages = function()
        {
            return Selector.damages(this.store().getState(), this.id());
        };

        Token.prototype.defenderTargetLocks = function()
        {
            return Selector.defenderTargetLocks(this.store().getState(), this);
        };

        Token.prototype.energyCount = function()
        {
            return Selector.energyCount(this.store().getState(), this.id());
        };

        Token.prototype.energyValue = function()
        {
            var value = Selector.energyValue(this.store().getState(), this.id());

            return (value !== undefined ? value : null);
        };

        Token.prototype.equals = function(other)
        {
            return this.id() == other.id() && this.pilotKey() == other.pilotKey();
        };

        Token.prototype.evadeCount = function()
        {
            return Selector.evadeCount(this.store().getState(), this.id());
        };

        Token.prototype.findTargetLockByDefender = function(defender)
        {
            return Selector.targetLock(this.store().getState().targetLocks, this, defender);
        };

        Token.prototype.flipDamageCardFacedown = function(damageKey)
        {
            this.removeCriticalDamage(damageKey);
            this.addDamage(damageKey);
        };

        Token.prototype.focusCount = function()
        {
            return Selector.focusCount(this.store().getState(), this.id());
        };

        Token.prototype.hullValue = function()
        {
            return Selector.hullValue(this.store().getState(), this.id());
        };

        Token.prototype.ionCount = function()
        {
            return Selector.ionCount(this.store().getState(), this.id());
        };

        Token.prototype.isCloaked = function()
        {
            return this.cloakCount() > 0;
        };

        Token.prototype.isCriticallyDamagedWith = function(damageKey)
        {
            var criticalDamages = this.criticalDamages();
            return criticalDamages.vizziniContains(damageKey);
        };

        Token.prototype.isDestroyed = function()
        {
            return this.totalDamage() >= this.hullValue();
        };

        Token.prototype.isHuge = function()
        {
            return ShipBase.isHuge(this.ship().shipBaseKey) || (this.parent !== undefined);
        };

        Token.prototype.isIonized = function()
        {
            return this.ionCount() > 0;
        };

        Token.prototype.isStressed = function()
        {
            return this.stressCount() > 0;
        };

        Token.prototype.isUpgradedWith = function(upgradeKey)
        {
            return this.upgradeKeys().vizziniContains(upgradeKey);
        };

        Token.prototype.name = function()
        {
            var pilotName = this.pilot().name;
            var shipName = this.pilot().shipTeam.ship.name;
            var answer = this.id() + " " + pilotName;

            if (!pilotName.startsWith(shipName))
            {
                answer += " (" + shipName + ")";
            }

            return answer;
        };

        Token.prototype.pilotName = function()
        {
            var answer = this.id() + " ";

            if (this.pilot().isUnique)
            {
                answer += "\u25CF ";
            }

            answer += this.pilot().name;

            return answer;
        };

        Token.prototype.pilotSkillValue = function()
        {
            return Selector.pilotSkillValue(this.store().getState(), this.id());
        };

        Token.prototype.primaryFiringArcKey = function()
        {
            return this.pilot().shipTeam.ship.primaryFiringArcKey;
        };

        Token.prototype.primaryWeaponValue = function()
        {
            var value = Selector.primaryWeaponValue(this.store().getState(), this.id());

            return (value !== undefined ? value : null);
        };

        Token.prototype.receiveStress = function()
        {
            this.store().dispatch(Action.addStressCount(this));

            if (this.pilotKey() === Pilot.SOONTIR_FEL)
            {
                this.store().dispatch(Action.addFocusCount(this));
            }
        };

        Token.prototype.recoverShield = function()
        {
            if (this.shieldCount() < this.shieldValue())
            {
                this.store().dispatch(Action.addShieldCount(this));
            }
        };

        Token.prototype.reinforceCount = function()
        {
            return Selector.reinforceCount(this.store().getState(), this.id());
        };

        Token.prototype.removeAllTargetLocks = function()
        {
            // Remove target locks which have this as the defender.
            var targetLocks = this.defenderTargetLocks();
            targetLocks.forEach(function(targetLock)
            {
                var attacker = targetLock.attacker();
                attacker.removeAttackerTargetLock(targetLock);
            }, this);

            // Remove target locks which have this as the attacker.
            targetLocks = this.attackerTargetLocks();
            targetLocks.forEach(function(targetLock)
            {
                var defender = targetLock.defender();
                this.removeAttackerTargetLock(targetLock);
            }, this);
        };

        Token.prototype.removeAttackerTargetLock = function(targetLock)
        {
            InputValidator.validateNotNull("targetLock", targetLock);

            this.store().dispatch(Action.removeTargetLock(targetLock));
        };

        Token.prototype.removeCriticalDamage = function(damageKey)
        {
            this.store().dispatch(Action.removeTokenCriticalDamage(this, damageKey));
        };

        Token.prototype.removeStress = function()
        {
            if (this.stressCount() > 0)
            {
                this.store().dispatch(Action.addStressCount(this, -1));

                if (this.isUpgradedWith(UpgradeCard.KYLE_KATARN))
                {
                    this.store().dispatch(Action.addFocusCount(this));
                }
            }
        };

        Token.prototype.shieldCount = function()
        {
            return Selector.shieldCount(this.store().getState(), this.id());
        };

        Token.prototype.shieldValue = function()
        {
            return Selector.shieldValue(this.store().getState(), this.id());
        };

        Token.prototype.shipActions = function()
        {
            var answer = [];

            var phaseKey = Phase.ACTIVATION_PERFORM_ACTION;
            var store = this.store();

            if (!this.isCriticallyDamagedWith(DamageCardV2.DAMAGED_SENSOR_ARRAY))
            {
                if (!this.isCriticallyDamagedWith(DamageCard.DAMAGED_SENSOR_ARRAY))
                {
                    answer.vizziniAddAll(this.ship().shipActionKeys);
                }

                if (answer.vizziniContains(ShipAction.CLOAK) && this.isCloaked())
                {
                    answer.vizziniRemove(ShipAction.CLOAK);
                }

                if (this.isUpgradedWith(UpgradeCard.MIST_HUNTER))
                {
                    answer.push(ShipAction.BARREL_ROLL);
                }

                if (this.isUpgradedWith(UpgradeCard.ENGINE_UPGRADE))
                {
                    answer.push(ShipAction.BOOST);
                }

                if (this.isUpgradedWith(UpgradeCard.MILLENNIUM_FALCON))
                {
                    answer.push(ShipAction.EVADE);
                }

                if (this.isUpgradedWith(UpgradeCard.BROADCAST_ARRAY))
                {
                    answer.push(ShipAction.JAM);
                }

                if (this.isUpgradedWith(UpgradeCard.TARGETING_COMPUTER))
                {
                    answer.push(ShipAction.TARGET_LOCK);
                }

                if (UpgradeAbility2[phaseKey])
                {
                    var upgradeKeys = this.upgradeKeys();

                    upgradeKeys.forEach(function(upgradeKey)
                    {
                        var upgradeAbility = UpgradeAbility2[phaseKey][upgradeKey];

                        if (upgradeAbility)
                        {
                            if (upgradeAbility && upgradeAbility.condition && upgradeAbility.condition(store, this))
                            {
                                answer.push(
                                {
                                    type: UpgradeCard,
                                    key: upgradeKey,
                                });
                            }
                        }
                    }, this);
                }
            }

            if (DamageAbility2[phaseKey])
            {
                var criticalDamages = this.criticalDamages();

                criticalDamages.forEach(function(damageKey)
                {
                    var damageAbility = DamageAbility2[phaseKey][damageKey];

                    if (damageAbility && damageAbility.condition && damageAbility.condition(store, this))
                    {
                        answer.push(
                        {
                            type: DamageCard,
                            key: damageKey,
                        });
                    }
                }, this);
            }

            return answer;
        };

        Token.prototype.shipName = function()
        {
            return this.pilot().shipTeam.ship.name;
        };

        Token.prototype.stressCount = function()
        {
            return Selector.stressCount(this.store().getState(), this.id());
        };

        Token.prototype.teamName = function()
        {
            return this.pilot().shipTeam.team.name;
        };

        Token.prototype.toString = function()
        {
            return this.name();
        };

        Token.prototype.totalDamage = function()
        {
            var answer = this.damageCount();

            answer += this.criticalDamages().reduce(function(accumulator, currentValue)
            {
                return accumulator + ([DamageCard.DIRECT_HIT, DamageCardV2.DIRECT_HIT].vizziniContains(currentValue) ? 2 : 1);
            }, 0);

            return answer;
        };

        Token.prototype.tractorBeamCount = function()
        {
            return Selector.tractorBeamCount(this.store().getState(), this.id());
        };

        Token.prototype.upgradeKeys = function()
        {
            return Selector.upgrades(this.store().getState(), this.id());
        };

        Token.prototype.upgradeTypeKeys = function()
        {
            var answer = this.pilot().upgradeTypeKeys.slice();

            if (UpgradeCard.valuesByPilotAndType(this.pilotKey(), UpgradeType.TITLE).length > 0)
            {
                answer.unshift(UpgradeType.TITLE);
            }

            if (UpgradeCard.valuesByPilotAndType(this.pilotKey(), UpgradeType.MODIFICATION).length > 0)
            {
                answer.push(UpgradeType.MODIFICATION);

                if (this.isUpgradedWith(UpgradeCard.ROYAL_GUARD_TIE))
                {
                    answer.push(UpgradeType.MODIFICATION);
                }
            }

            if (this.isUpgradedWith(UpgradeCard.A_WING_TEST_PILOT))
            {
                answer.push(UpgradeType.ELITE);
            }

            if (this.isUpgradedWith(UpgradeCard.R2_D6))
            {
                answer.push(UpgradeType.ELITE);
            }

            if (this.isUpgradedWith(UpgradeCard.ANDRASTA))
            {
                answer.push(UpgradeType.BOMB);
                answer.push(UpgradeType.BOMB);
            }

            if (this.isUpgradedWith(UpgradeCard.B_WING_E2))
            {
                answer.push(UpgradeType.CREW);
            }

            if (this.isUpgradedWith(UpgradeCard.TANTIVE_IV))
            {
                answer.push(UpgradeType.CREW);
                answer.push(UpgradeType.TEAM);
            }

            if (this.isUpgradedWith(UpgradeCard.BOMB_LOADOUT))
            {
                answer.push(UpgradeType.BOMB);
            }

            if (this.isUpgradedWith(UpgradeCard.SLAVE_I))
            {
                answer.push(UpgradeType.TORPEDO);
            }

            if (this.isUpgradedWith(UpgradeCard.TIE_X1))
            {
                answer.push(UpgradeType.SYSTEM);
            }

            if (this.isUpgradedWith(UpgradeCard.VIRAGO))
            {
                answer.push(UpgradeType.SYSTEM);
                answer.push(UpgradeType.ILLICIT);
            }

            return answer;
        };

        Token.prototype.weaponsDisabledCount = function()
        {
            return Selector.weaponsDisabledCount(this.store().getState(), this.id());
        };

        return Token;
    });

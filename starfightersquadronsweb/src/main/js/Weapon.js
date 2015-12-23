/*
 * Provides a weapon for Starfighter Squadrons.
 */
define([ "FiringArc", "Maneuver", "RangeRuler", "ShipBase" ], function(FiringArc, Maneuver, RangeRuler, ShipBase)
{
    function Weapon(name, isPrimary, weaponValue, ranges)
    {
        this.getName = function()
        {
            return name;
        }

        this.getRanges = function()
        {
            return ranges;
        }

        this.getWeaponValue = function()
        {
            return weaponValue;
        }

        this.isPrimary = function()
        {
            return isPrimary;
        }
    }

    /*
     * @param attacker Attacker. @param attackerPosition Attacker position. @param defender Defender. @param
     * defenderPosition Defender position.
     * 
     * @return true if the defender is in this weapon's range.
     */
    Weapon.prototype.isDefenderInRange = function(attacker, attackerPosition, defender, defenderPosition)
    {
        var range = RangeRuler.getRange(attacker, attackerPosition, defender, defenderPosition);
        // LOGGER.trace("Weapon.isDefenderInRange() range = " + range);
        // LOGGER.trace("Weapon.getRanges() = " + this.getRanges());

        return range && this.getRanges().vizziniContains(range);
    }

    /*
     * @param attacker Attacker. @param attackerPosition Attacker position. @param defender Defender. @param
     * defenderPosition Defender position.
     * 
     * @return true if the defender is in this weapon's firing arc and range.
     */
    Weapon.prototype.isDefenderTargetable = function(attacker, attackerPosition, defender, defenderPosition)
    {
        // LOGGER.trace("Weapon.isDefenderInRange(attacker, attackerPosition, defender, defenderPosition) ? "
        // + this.isDefenderInRange(attacker, attackerPosition, defender, defenderPosition));
        // LOGGER.trace("Weapon.isDefenderVulnerable(attacker, attackerPosition, defender, defenderPosition) ? "
        // + this.isDefenderVulnerable(attacker, attackerPosition, defender, defenderPosition));
        return this.isDefenderInRange(attacker, attackerPosition, defender, defenderPosition)
                && this.isDefenderVulnerable(attacker, attackerPosition, defender, defenderPosition);
    }

    /*
     * @param attacker Attacker. @param attackerPosition Attacker position. @param defender Defender. @param
     * defenderPosition Defender position.
     * 
     * @return true if the defender is in this weapon's firing arc.
     */
    Weapon.prototype.isDefenderVulnerable = function(attacker, attackerPosition, defender, defenderPosition)
    {
        return this._isDefenderInPrimaryFiringArc(attacker, attackerPosition, defender, defenderPosition);
    }

    Weapon.prototype.toString = function()
    {
        return this.getName();
    }

    /*
     * @param attacker Attacker. @param attackerPosition Attacker position. @param defender Defender. @param
     * defenderPosition Defender position.
     * 
     * @return true if the defender is in this weapon's firing arc.
     */
    Weapon.prototype._isDefenderInPrimaryFiringArc = function(attacker, attackerPosition, defender, defenderPosition)
    {
        var firingArc = attacker.getShipPrimaryFiringArc();
        var bearing = attackerPosition.computeBearing(defenderPosition.x(), defenderPosition.y());
        // LOGGER.trace("bearing = " + bearing);
        var answer = FiringArc.properties[firingArc].isInFiringArc(bearing);
        // LOGGER.trace("0 answer ? " + answer);

        if (!answer)
        {
            var defenderBase = defender.getShipBase();
            var polygon = Maneuver.computePolygon(defenderBase, defenderPosition.x(), defenderPosition.y(),
                    defenderPosition.heading());

            // FIXME
            // final double[] coords = new double[6];
            //
            // for (final PathIterator iter = polygon.getPathIterator(null);
            // !iter.isDone(); iter.next())
            // {
            // iter.currentSegment(coords);
            // final int bearing = attackerPosition.computeBearing(coords[0],
            // coords[1]);
            // LOGGER.trace("bearing = " + bearing);
            //
            // if (firingArc.isInFiringArc(bearing))
            // {
            // answer = true;
            // break;
            // }
            // }
        }

        return answer;
    }

    return Weapon;
});

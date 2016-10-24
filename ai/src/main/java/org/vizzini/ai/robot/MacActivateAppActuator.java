package org.vizzini.ai.robot;

import org.apache.commons.lang3.StringUtils;

/**
 * Provides an activate application command implementation of an actuator. This implementation uses Applescript, so it
 * is specifically for Macintosh OS X only.
 * 
 * @see java.lang.ProcessBuilder
 */
public final class MacActivateAppActuator implements Actuator<String, String>
{
    /** Delegate. */
    private final CommandActuator delegate;

    /**
     * Construct this object.
     * 
     * @param name Name.
     */
    public MacActivateAppActuator(final String name)
    {
        delegate = new CommandActuator(name);
    }

    @Override
    public String actuate(final String input)
    {
        if (StringUtils.isEmpty(input))
        {
            throw new IllegalArgumentException("input is null or empty");
        }

        final String quotedAppName = "\"" + input + "\"";

        final String[] command = { "/usr/bin/osascript", "-e", "tell application " + quotedAppName + " to activate", };

        return delegate.actuate(command);
    }

    @Override
    public String getName()
    {
        return delegate.getName();
    }
}

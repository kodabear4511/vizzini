package org.vizzini.ai.geneticalgorithm.geneticprogramming;

import java.util.Collections;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.vizzini.core.Visitor;

/**
 * Provides an implementation of a set variable function. This function supports the following types.
 * <ol>
 * <li>Double</li>
 * <li>Integer</li>
 * <li>String</li>
 * <li>Boolean</li>
 * </ol>
 * 
 * @param <T> Type.
 */
public final class PutVariableFunction<T> implements UnaryFunction<T>
{
    /** Delegate. */
    private final Function<T> delegate;

    /** Variable name. */
    private final String variableName;

    /**
     * Construct this object.
     * 
     * @param converter Number utilities.
     * @param variableName Variable name.
     * @param child Child node.
     */
    @SuppressWarnings("hiding")
    public PutVariableFunction(final Converter<T> converter, final String variableName, final TreeNode<T> child)
    {
        this(converter, variableName, Collections.singletonList(child));
    }

    /**
     * Construct this object.
     * 
     * @param converter Number utilities.
     * @param variableName Variable name.
     * @param children Child nodes.
     */
    @SuppressWarnings("hiding")
    private PutVariableFunction(final Converter<T> converter, final String variableName,
            final List<TreeNode<T>> children)
    {
        if (StringUtils.isEmpty(variableName))
        {
            throw new IllegalArgumentException("variableName is null or empty");
        }

        this.delegate = new DefaultFunction<T>(converter, "put", ARITY, children);
        this.variableName = variableName;

        for (int i = 0; i < ARITY; i++)
        {
            final TreeNode<T> child = getChildAt(i);
            child.setParent(this);
        }
    }

    @Override
    public void accept(final Visitor<TreeNode<T>> visitor)
    {
        if (visitor == null)
        {
            throw new IllegalArgumentException("visitor is null");
        }

        visitor.visit(this);
    }

    @Override
    public TreeNode<T> copy()
    {
        return withChild(getChild().copy());
    }

    @Override
    public boolean equals(final Object object)
    {
        boolean answer = false;

        if (object == this)
        {
            answer = true;
        }
        else if (object == null)
        {
            answer = false;
        }
        else if (getClass() != object.getClass())
        {
            answer = false;
        }
        else
        {
            @SuppressWarnings("unchecked")
            final PutVariableFunction<T> another = (PutVariableFunction<T>)object;

            answer = variableName.equals(another.variableName);

            if (answer)
            {
                answer = delegate.equals(another.delegate);
            }
        }

        return answer;
    }

    @Override
    public T evaluate(final Context context)
    {
        T answer = null;

        final int size = getArity();

        if (size > 0)
        {
            for (int i = 0; i < size; i++)
            {
                final TreeNode<T> child = getChildAt(i);
                final T eval = child.evaluate(context);

                if (i == 0)
                {
                    answer = eval;
                }
            }
        }

        if (answer == null)
        {
            answer = getConverter().getDefaultValue();
        }

        context.putVariable(variableName, answer);

        return answer;
    }

    @Override
    public int getArity()
    {
        return delegate.getArity();
    }

    @Override
    public TreeNode<T> getChild()
    {
        return getChildAt(0);
    }

    @Override
    public TreeNode<T> getChildAt(final int index)
    {
        return delegate.getChildAt(index);
    }

    @Override
    public List<TreeNode<T>> getChildren()
    {
        return delegate.getChildren();
    }

    @Override
    public Converter<T> getConverter()
    {
        return delegate.getConverter();
    }

    @Override
    public TreeNode<T> getParent()
    {
        return delegate.getParent();
    }

    @Override
    public Class<T> getReturnType()
    {
        return delegate.getReturnType();
    }

    @Override
    public String getSymbol()
    {
        return delegate.getSymbol();
    }

    /**
     * @return variableName
     */
    public String getVariableName()
    {
        return variableName;
    }

    @Override
    public int hashCode()
    {
        int answer = 0;

        final int[] primes = { 2, 3, };
        int i = 0;

        answer += primes[i++] * variableName.hashCode();
        answer += primes[i++] * delegate.hashCode();

        return answer;
    }

    @Override
    public int indexOf(final TreeNode<T> child)
    {
        return delegate.indexOf(child);
    }

    @Override
    public void setParent(final TreeNode<T> parent)
    {
        delegate.setParent(parent);
    }

    @Override
    public String toString()
    {
        final List<TreeNode<T>> children = getChildren();

        final ToStringBuilder builder = new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE);

        builder.append("returnType", getReturnType().getSimpleName());
        builder.append("parent", (getParent() == null ? null : getParent().getClass().getSimpleName()));
        builder.append("variableName", getVariableName());
        builder.append("symbol", getSymbol());
        builder.append("children", children);

        return builder.toString();
    }

    @Override
    public PutVariableFunction<T> withChild(final TreeNode<T> child)
    {
        return new PutVariableFunction<T>(getConverter(), getVariableName(), child);
    }

    @Override
    public PutVariableFunction<T> withChildren(final List<TreeNode<T>> children)
    {
        return new PutVariableFunction<T>(getConverter(), getVariableName(), children);
    }
}

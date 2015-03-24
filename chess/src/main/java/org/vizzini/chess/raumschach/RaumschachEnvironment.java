package org.vizzini.chess.raumschach;

import java.beans.PropertyChangeListener;
import java.util.BitSet;
import java.util.List;

import org.vizzini.chess.ChessEnvironment;
import org.vizzini.chess.ChessPosition;
import org.vizzini.chess.ChessTeam;
import org.vizzini.chess.ChessToken;
import org.vizzini.chess.DefaultChessEnvironment;
import org.vizzini.chess.DefaultChessToken;
import org.vizzini.chess.Dimensions;
import org.vizzini.chess.GameType;
import org.vizzini.core.game.Action;
import org.vizzini.core.game.Agent;
import org.vizzini.core.game.Environment;
import org.vizzini.core.game.Position;
import org.vizzini.core.game.Team;
import org.vizzini.core.game.Token;

/**
 * Provides a raumschach chess environment.
 */
public final class RaumschachEnvironment implements ChessEnvironment
{
    /** Board delegate. */
    private DefaultChessEnvironment delegate;

    /**
     * Construct this object.
     */
    public RaumschachEnvironment()
    {
        this(0, 1, ChessTeam.WHITE);
    }

    /**
     * Construct this object.
     * 
     * @param fiftyMoveCount Fifty move count.
     * @param moveCount Move count.
     * @param whoseMove Whose move.
     */
    public RaumschachEnvironment(final int fiftyMoveCount, final int moveCount, final ChessTeam whoseMove)
    {
        delegate = new DefaultChessEnvironment(GameType.RAUMSCHACH, fiftyMoveCount, moveCount, whoseMove);
    }

    @Override
    public void addDoActionListener(final PropertyChangeListener listener)
    {
        delegate.addDoActionListener(listener);
    }

    @Override
    public void addUndoActionListener(final PropertyChangeListener listener)
    {
        delegate.addUndoActionListener(listener);
    }

    @Override
    public void clear()
    {
        delegate.clear();
    }

    @Override
    public Environment copy()
    {
        final RaumschachEnvironment answer = new RaumschachEnvironment(getFiftyMoveCount(), getMoveCount(),
                getWhoseMove());

        answer.delegate = delegate.copy();

        return answer;
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
            final RaumschachEnvironment another = (RaumschachEnvironment)object;

            answer = (delegate == another.delegate) || delegate.equals(another.delegate);
        }

        return answer;
    }

    @Override
    public void fireDoActionPropertyChange(final Action oldValue, final Action newValue)
    {
        delegate.fireDoActionPropertyChange(oldValue, newValue);
    }

    @Override
    public void fireUndoActionPropertyChange(final Action oldValue, final Action newValue)
    {
        delegate.fireUndoActionPropertyChange(oldValue, newValue);
    }

    @Override
    public BitSet getBlackAttackBoard()
    {
        return delegate.getBlackAttackBoard();
    }

    @Override
    public ChessPosition getBlackKingPosition()
    {
        return RaumschachPosition.findByIndex(delegate.getBlackKingIndex());
    }

    @Override
    public String getDescription()
    {
        return delegate.getDescription();
    }

    @Override
    public Dimensions getDimensions()
    {
        return delegate.getDimensions();
    }

    @Override
    public int getFiftyMoveCount()
    {
        return delegate.getFiftyMoveCount();
    }

    @Override
    public Agent getFirstAgent()
    {
        return delegate.getFirstAgent();
    }

    @Override
    public GameType getGameType()
    {
        return delegate.getGameType();
    }

    @Override
    public int getMoveCount()
    {
        return delegate.getMoveCount();
    }

    @Override
    public String getName()
    {
        return delegate.getName();
    }

    @Override
    public ChessPosition getPositionFor(final int index)
    {
        return RaumschachPosition.findByIndex(index);
    }

    @Override
    public ChessPosition getPositionFor(final int file, final int rank, final int level)
    {
        return RaumschachPosition.findByCoordinates(file, rank, level);
    }

    @Override
    public ChessPosition[] getPositionValues()
    {
        return RaumschachPosition.values();
    }

    @Override
    public int getRepeatedMoveCount()
    {
        return delegate.getRepeatedMoveCount();
    }

    @Override
    public Agent getSecondAgent()
    {
        return delegate.getSecondAgent();
    }

    @Override
    public ChessToken getTokenAt(final Integer index)
    {
        return delegate.getTokenAt(index);
    }

    @Override
    public ChessToken getTokenAt(final Position<?> position)
    {
        return delegate.getTokenAt(position);
    }

    @Override
    public int getTokenCount()
    {
        return delegate.getTokenCount();
    }

    @Override
    public int getTokenCountFor(final Agent agent)
    {
        return delegate.getTokenCountFor(agent);
    }

    @Override
    public int getTokenCountFor(final Team team)
    {
        return delegate.getTokenCountFor(team);
    }

    @Override
    public BitSet getWhiteAttackBoard()
    {
        return delegate.getWhiteAttackBoard();
    }

    @Override
    public ChessPosition getWhiteKingPosition()
    {
        return RaumschachPosition.findByIndex(delegate.getWhiteKingIndex());
    }

    @Override
    public ChessTeam getWhoseMove()
    {
        return delegate.getWhoseMove();
    }

    @Override
    public int hashCode()
    {
        return delegate.hashCode();
    }

    @Override
    public void incrementFiftyMoveCount()
    {
        delegate.incrementFiftyMoveCount();
    }

    @Override
    public void incrementMoveCount()
    {
        delegate.incrementMoveCount();
    }

    @Override
    public boolean isInCheck(final ChessTeam team)
    {
        return delegate.isInCheck(team);
    }

    @Override
    public boolean isStaleMate()
    {
        return delegate.isStaleMate();
    }

    @Override
    public boolean isUsable(final ChessPosition position)
    {
        return delegate.isUsable(position);
    }

    @Override
    public void placeInitialTokens(final List<Agent> agents)
    {
        delegate.placeInitialTokens(agents);

        {
            final Agent agent = agents.get(0);

            placeToken(RaumschachPosition.a1A, DefaultChessToken.WHITE_ROOK.withAgent(agent));
            placeToken(RaumschachPosition.b1A, DefaultChessToken.WHITE_KNIGHT.withAgent(agent));
            placeToken(RaumschachPosition.c1A, DefaultChessToken.WHITE_KING.withAgent(agent));
            placeToken(RaumschachPosition.d1A, DefaultChessToken.WHITE_KNIGHT.withAgent(agent));
            placeToken(RaumschachPosition.e1A, DefaultChessToken.WHITE_ROOK.withAgent(agent));

            int start = RaumschachPosition.a2A.getIndex();

            for (int i = start; i < (start + 5); i++)
            {
                placeToken(i, (ChessToken)DefaultChessToken.WHITE_PAWN.withAgent(agent));
            }

            placeToken(RaumschachPosition.a1B, DefaultChessToken.WHITE_BISHOP.withAgent(agent));
            placeToken(RaumschachPosition.b1B, DefaultChessToken.WHITE_UNICORN.withAgent(agent));
            placeToken(RaumschachPosition.c1B, DefaultChessToken.WHITE_QUEEN.withAgent(agent));
            placeToken(RaumschachPosition.d1B, DefaultChessToken.WHITE_BISHOP.withAgent(agent));
            placeToken(RaumschachPosition.e1B, DefaultChessToken.WHITE_UNICORN.withAgent(agent));

            start = RaumschachPosition.a2B.getIndex();

            for (int i = start; i < (start + 5); i++)
            {
                placeToken(i, (ChessToken)DefaultChessToken.WHITE_PAWN.withAgent(agent));
            }
        }

        {
            final Agent agent = agents.get(1);

            int start = RaumschachPosition.a4D.getIndex();

            for (int i = start; i < (start + 5); i++)
            {
                placeToken(i, (ChessToken)DefaultChessToken.BLACK_PAWN.withAgent(agent));
            }

            placeToken(RaumschachPosition.a5D, DefaultChessToken.BLACK_BISHOP.withAgent(agent));
            placeToken(RaumschachPosition.b5D, DefaultChessToken.BLACK_UNICORN.withAgent(agent));
            placeToken(RaumschachPosition.c5D, DefaultChessToken.BLACK_QUEEN.withAgent(agent));
            placeToken(RaumschachPosition.d5D, DefaultChessToken.BLACK_BISHOP.withAgent(agent));
            placeToken(RaumschachPosition.e5D, DefaultChessToken.BLACK_UNICORN.withAgent(agent));

            start = RaumschachPosition.a4E.getIndex();

            for (int i = start; i < (start + 5); i++)
            {
                placeToken(i, (ChessToken)DefaultChessToken.BLACK_PAWN.withAgent(agent));
            }

            placeToken(RaumschachPosition.a5E, DefaultChessToken.BLACK_ROOK.withAgent(agent));
            placeToken(RaumschachPosition.b5E, DefaultChessToken.BLACK_KNIGHT.withAgent(agent));
            placeToken(RaumschachPosition.c5E, DefaultChessToken.BLACK_KING.withAgent(agent));
            placeToken(RaumschachPosition.d5E, DefaultChessToken.BLACK_KNIGHT.withAgent(agent));
            placeToken(RaumschachPosition.e5E, DefaultChessToken.BLACK_ROOK.withAgent(agent));
        }

        fireDoActionPropertyChange(null, null);
    }

    @Override
    public void placeToken(final Integer index, final ChessToken token)
    {
        delegate.placeToken(index, token);
    }

    @Override
    public void placeToken(final Position<?> position, final Token token)
    {
        delegate.placeToken(position, token);
    }

    @Override
    public void removeDoActionListener(final PropertyChangeListener listener)
    {
        delegate.removeDoActionListener(listener);
    }

    @Override
    public void removeToken(final Integer index)
    {
        delegate.removeToken(index);
    }

    @Override
    public void removeToken(final Position<?> position)
    {
        delegate.removeToken(position);
    }

    @Override
    public void removeUndoActionListener(final PropertyChangeListener listener)
    {
        delegate.removeUndoActionListener(listener);
    }

    @Override
    public void setInCheck(final ChessTeam team, final boolean isInCheck)
    {
        delegate.setInCheck(team, isInCheck);
    }

    @Override
    public void setStaleMate(final boolean isStaleMate)
    {
        delegate.setStaleMate(isStaleMate);
    }

    @Override
    public void setWhoseMove(final ChessTeam whoseMove)
    {
        delegate.setWhoseMove(whoseMove);
    }

    @Override
    public String toString()
    {
        final StringBuilder sb = new StringBuilder();

        final Dimensions dimensions = getDimensions();

        for (int level = 0; level < dimensions.getLevelCount(); level++)
        {
            sb.append("Level ").append((char)('A' + level)).append("\n");
            sb.append("   0 1 2 3 4\n");

            for (int rank = 0; rank < dimensions.getRankCount(); rank++)
            {
                sb.append(rank).append(" |");

                for (int file = 0; file < dimensions.getFileCount(); file++)
                {
                    final ChessPosition position = getPositionFor(file, rank, level);
                    final Token token = getTokenAt(position);

                    if (token == null)
                    {
                        sb.append(" ");
                    }
                    else
                    {
                        sb.append(token.getName().substring(0, 1));
                    }

                    sb.append("|");
                }

                if (rank < (dimensions.getRankCount() - 1))
                {
                    sb.append("\n");
                }
            }

            if (level < (dimensions.getLevelCount() - 1))
            {
                sb.append("\n");
            }
        }

        return sb.toString();
    }

    @Override
    public void zeroFiftyMoveCount()
    {
        delegate.zeroFiftyMoveCount();
    }
}

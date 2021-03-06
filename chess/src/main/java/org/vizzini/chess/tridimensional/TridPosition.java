package org.vizzini.chess.tridimensional;

import java.util.Map;
import java.util.TreeMap;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.vizzini.chess.ChessPosition;

/**
 * Provides a pseudo-enumeration of positions for tridimensional chess.
 */
public final class TridPosition implements ChessPosition
{
    /** Fixed board position. */
    public static final TridPosition b2B = new TridPosition("b2B", 1, 1, 1);

    /** Fixed board position. */
    public static final TridPosition c2B = new TridPosition("c2B", 2, 1, 1);

    /** Fixed board position. */
    public static final TridPosition d2B = new TridPosition("d2B", 3, 1, 1);

    /** Fixed board position. */
    public static final TridPosition e2B = new TridPosition("e2B", 4, 1, 1);

    /** Fixed board position. */
    public static final TridPosition b3B = new TridPosition("b3B", 1, 2, 1);

    /** Fixed board position. */
    public static final TridPosition c3B = new TridPosition("c3B", 2, 2, 1);

    /** Fixed board position. */
    public static final TridPosition d3B = new TridPosition("d3B", 3, 2, 1);

    /** Fixed board position. */
    public static final TridPosition e3B = new TridPosition("e3B", 4, 2, 1);

    /** Fixed board position. */
    public static final TridPosition b4B = new TridPosition("b4B", 1, 3, 1);

    /** Fixed board position. */
    public static final TridPosition c4B = new TridPosition("c4B", 2, 3, 1);

    /** Fixed board position. */
    public static final TridPosition d4B = new TridPosition("d4B", 3, 3, 1);

    /** Fixed board position. */
    public static final TridPosition e4B = new TridPosition("e4B", 4, 3, 1);

    /** Fixed board position. */
    public static final TridPosition b5B = new TridPosition("b5B", 1, 4, 1);

    /** Fixed board position. */
    public static final TridPosition c5B = new TridPosition("c5B", 2, 4, 1);

    /** Fixed board position. */
    public static final TridPosition d5B = new TridPosition("d5B", 3, 4, 1);

    /** Fixed board position. */
    public static final TridPosition e5B = new TridPosition("e5B", 4, 4, 1);

    /** Fixed board position. */
    public static final TridPosition b2D = new TridPosition("b2D", 1, 1, 3);

    /** Fixed board position. */
    public static final TridPosition c2D = new TridPosition("c2D", 2, 1, 3);

    /** Fixed board position. */
    public static final TridPosition d2D = new TridPosition("d2D", 3, 1, 3);

    /** Fixed board position. */
    public static final TridPosition e2D = new TridPosition("e2D", 4, 1, 3);

    /** Fixed board position. */
    public static final TridPosition b3D = new TridPosition("b3D", 1, 2, 3);

    /** Fixed board position. */
    public static final TridPosition c3D = new TridPosition("c3D", 2, 2, 3);

    /** Fixed board position. */
    public static final TridPosition d3D = new TridPosition("d3D", 3, 2, 3);

    /** Fixed board position. */
    public static final TridPosition e3D = new TridPosition("e3D", 4, 2, 3);

    /** Fixed board position. */
    public static final TridPosition b4D = new TridPosition("b4D", 1, 3, 3);

    /** Fixed board position. */
    public static final TridPosition c4D = new TridPosition("c4D", 2, 3, 3);

    /** Fixed board position. */
    public static final TridPosition d4D = new TridPosition("d4D", 3, 3, 3);

    /** Fixed board position. */
    public static final TridPosition e4D = new TridPosition("e4D", 4, 3, 3);

    /** Fixed board position. */
    public static final TridPosition b5D = new TridPosition("b5D", 1, 4, 3);

    /** Fixed board position. */
    public static final TridPosition c5D = new TridPosition("c5D", 2, 4, 3);

    /** Fixed board position. */
    public static final TridPosition d5D = new TridPosition("d5D", 3, 4, 3);

    /** Fixed board position. */
    public static final TridPosition e5D = new TridPosition("e5D", 4, 4, 3);

    /** Fixed board position. */
    public static final TridPosition b2F = new TridPosition("b2F", 1, 1, 5);

    /** Fixed board position. */
    public static final TridPosition c2F = new TridPosition("c2F", 2, 1, 5);

    /** Fixed board position. */
    public static final TridPosition d2F = new TridPosition("d2F", 3, 1, 5);

    /** Fixed board position. */
    public static final TridPosition e2F = new TridPosition("e2F", 4, 1, 5);

    /** Fixed board position. */
    public static final TridPosition b3F = new TridPosition("b3F", 1, 2, 5);

    /** Fixed board position. */
    public static final TridPosition c3F = new TridPosition("c3F", 2, 2, 5);

    /** Fixed board position. */
    public static final TridPosition d3F = new TridPosition("d3F", 3, 2, 5);

    /** Fixed board position. */
    public static final TridPosition e3F = new TridPosition("e3F", 4, 2, 5);

    /** Fixed board position. */
    public static final TridPosition b4F = new TridPosition("b4F", 1, 3, 5);

    /** Fixed board position. */
    public static final TridPosition c4F = new TridPosition("c4F", 2, 3, 5);

    /** Fixed board position. */
    public static final TridPosition d4F = new TridPosition("d4F", 3, 3, 5);

    /** Fixed board position. */
    public static final TridPosition e4F = new TridPosition("e4F", 4, 3, 5);

    /** Fixed board position. */
    public static final TridPosition b5F = new TridPosition("b5F", 1, 4, 5);

    /** Fixed board position. */
    public static final TridPosition c5F = new TridPosition("c5F", 2, 4, 5);

    /** Fixed board position. */
    public static final TridPosition d5F = new TridPosition("d5F", 3, 4, 5);

    /** Fixed board position. */
    public static final TridPosition e5F = new TridPosition("e5F", 4, 4, 5);

    /** Attack board position. */
    public static final TridPosition a1A = new TridPosition("a1A", 0, 0, 0);

    /** Attack board position. */
    public static final TridPosition b1A = new TridPosition("b1A", 1, 0, 0);

    /** Attack board position. */
    public static final TridPosition a2A = new TridPosition("a2A", 0, 1, 0);

    /** Attack board position. */
    public static final TridPosition b2A = new TridPosition("b2A", 1, 1, 0);

    /** Attack board position. */
    public static final TridPosition e1A = new TridPosition("e1A", 4, 0, 0);

    /** Attack board position. */
    public static final TridPosition f1A = new TridPosition("f1A", 5, 0, 0);

    /** Attack board position. */
    public static final TridPosition e2A = new TridPosition("e2A", 4, 1, 0);

    /** Attack board position. */
    public static final TridPosition f2A = new TridPosition("f2A", 5, 1, 0);

    /** Attack board position. */
    public static final TridPosition a5A = new TridPosition("a5A", 0, 4, 0);

    /** Attack board position. */
    public static final TridPosition b5A = new TridPosition("b5A", 1, 4, 0);

    /** Attack board position. */
    public static final TridPosition a6A = new TridPosition("a6A", 0, 5, 0);

    /** Attack board position. */
    public static final TridPosition b6A = new TridPosition("b6A", 1, 5, 0);

    /** Attack board position. */
    public static final TridPosition e5A = new TridPosition("e5A", 4, 4, 0);

    /** Attack board position. */
    public static final TridPosition f5A = new TridPosition("f5A", 5, 4, 0);

    /** Attack board position. */
    public static final TridPosition e6A = new TridPosition("e6A", 4, 5, 0);

    /** Attack board position. */
    public static final TridPosition f6A = new TridPosition("f6A", 5, 5, 0);

    /** Attack board position. */
    public static final TridPosition a1C = new TridPosition("a1C", 0, 0, 2);

    /** Attack board position. */
    public static final TridPosition b1C = new TridPosition("b1C", 1, 0, 2);

    /** Attack board position. */
    public static final TridPosition a2C = new TridPosition("a2C", 0, 1, 2);

    /** Attack board position. */
    public static final TridPosition b2C = new TridPosition("b2C", 1, 1, 2);

    /** Attack board position. */
    public static final TridPosition e1C = new TridPosition("e1C", 4, 0, 2);

    /** Attack board position. */
    public static final TridPosition f1C = new TridPosition("f1C", 5, 0, 2);

    /** Attack board position. */
    public static final TridPosition e2C = new TridPosition("e2C", 4, 1, 2);

    /** Attack board position. */
    public static final TridPosition f2C = new TridPosition("f2C", 5, 1, 2);

    /** Attack board position. */
    public static final TridPosition a5C = new TridPosition("a5C", 0, 4, 2);

    /** Attack board position. */
    public static final TridPosition b5C = new TridPosition("b5C", 1, 4, 2);

    /** Attack board position. */
    public static final TridPosition a6C = new TridPosition("a6C", 0, 5, 2);

    /** Attack board position. */
    public static final TridPosition b6C = new TridPosition("b6C", 1, 5, 2);

    /** Attack board position. */
    public static final TridPosition e5C = new TridPosition("e5C", 4, 4, 2);

    /** Attack board position. */
    public static final TridPosition f5C = new TridPosition("f5C", 5, 4, 2);

    /** Attack board position. */
    public static final TridPosition e6C = new TridPosition("e6C", 4, 5, 2);

    /** Attack board position. */
    public static final TridPosition f6C = new TridPosition("f6C", 5, 5, 2);

    /** Attack board position. */
    public static final TridPosition a1E = new TridPosition("a1E", 0, 0, 4);

    /** Attack board position. */
    public static final TridPosition b1E = new TridPosition("b1E", 1, 0, 4);

    /** Attack board position. */
    public static final TridPosition a2E = new TridPosition("a2E", 0, 1, 4);

    /** Attack board position. */
    public static final TridPosition b2E = new TridPosition("b2E", 1, 1, 4);

    /** Attack board position. */
    public static final TridPosition e1E = new TridPosition("e1E", 4, 0, 4);

    /** Attack board position. */
    public static final TridPosition f1E = new TridPosition("f1E", 5, 0, 4);

    /** Attack board position. */
    public static final TridPosition e2E = new TridPosition("e2E", 4, 1, 4);

    /** Attack board position. */
    public static final TridPosition f2E = new TridPosition("f2E", 5, 1, 4);

    /** Attack board position. */
    public static final TridPosition a5E = new TridPosition("a5E", 0, 4, 4);

    /** Attack board position. */
    public static final TridPosition b5E = new TridPosition("b5E", 1, 4, 4);

    /** Attack board position. */
    public static final TridPosition a6E = new TridPosition("a6E", 0, 5, 4);

    /** Attack board position. */
    public static final TridPosition b6E = new TridPosition("b6E", 1, 5, 4);

    /** Attack board position. */
    public static final TridPosition e5E = new TridPosition("e5E", 4, 4, 4);

    /** Attack board position. */
    public static final TridPosition f5E = new TridPosition("f5E", 5, 4, 4);

    /** Attack board position. */
    public static final TridPosition e6E = new TridPosition("e6E", 4, 5, 4);

    /** Attack board position. */
    public static final TridPosition f6E = new TridPosition("f6E", 5, 5, 4);

    /** Attack board position. */
    public static final TridPosition a1G = new TridPosition("a1G", 0, 0, 6);

    /** Attack board position. */
    public static final TridPosition b1G = new TridPosition("b1G", 1, 0, 6);

    /** Attack board position. */
    public static final TridPosition a2G = new TridPosition("a2G", 0, 1, 6);

    /** Attack board position. */
    public static final TridPosition b2G = new TridPosition("b2G", 1, 1, 6);

    /** Attack board position. */
    public static final TridPosition e1G = new TridPosition("e1G", 4, 0, 6);

    /** Attack board position. */
    public static final TridPosition f1G = new TridPosition("f1G", 5, 0, 6);

    /** Attack board position. */
    public static final TridPosition e2G = new TridPosition("e2G", 4, 1, 6);

    /** Attack board position. */
    public static final TridPosition f2G = new TridPosition("f2G", 5, 1, 6);

    /** Attack board position. */
    public static final TridPosition a5G = new TridPosition("a5G", 0, 4, 6);

    /** Attack board position. */
    public static final TridPosition b5G = new TridPosition("b5G", 1, 4, 6);

    /** Attack board position. */
    public static final TridPosition a6G = new TridPosition("a6G", 0, 5, 6);

    /** Attack board position. */
    public static final TridPosition b6G = new TridPosition("b6G", 1, 5, 6);

    /** Attack board position. */
    public static final TridPosition e5G = new TridPosition("e5G", 4, 4, 6);

    /** Attack board position. */
    public static final TridPosition f5G = new TridPosition("f5G", 5, 4, 6);

    /** Attack board position. */
    public static final TridPosition e6G = new TridPosition("e6G", 4, 5, 6);

    /** Attack board position. */
    public static final TridPosition f6G = new TridPosition("f6G", 5, 5, 6);

    /** Map of index to position. */
    private static final Map<Integer, TridPosition> INDEX_TO_POSITION = new TreeMap<Integer, TridPosition>();

    static
    {
        INDEX_TO_POSITION.put(0, a1A);
        INDEX_TO_POSITION.put(1, b1A);
        INDEX_TO_POSITION.put(4, e1A);
        INDEX_TO_POSITION.put(5, f1A);
        INDEX_TO_POSITION.put(6, a2A);
        INDEX_TO_POSITION.put(7, b2A);
        INDEX_TO_POSITION.put(10, e2A);
        INDEX_TO_POSITION.put(11, f2A);
        INDEX_TO_POSITION.put(24, a5A);
        INDEX_TO_POSITION.put(25, b5A);
        INDEX_TO_POSITION.put(28, e5A);
        INDEX_TO_POSITION.put(29, f5A);
        INDEX_TO_POSITION.put(30, a6A);
        INDEX_TO_POSITION.put(31, b6A);
        INDEX_TO_POSITION.put(34, e6A);
        INDEX_TO_POSITION.put(35, f6A);
        INDEX_TO_POSITION.put(43, b2B);
        INDEX_TO_POSITION.put(44, c2B);
        INDEX_TO_POSITION.put(45, d2B);
        INDEX_TO_POSITION.put(46, e2B);
        INDEX_TO_POSITION.put(49, b3B);
        INDEX_TO_POSITION.put(50, c3B);
        INDEX_TO_POSITION.put(51, d3B);
        INDEX_TO_POSITION.put(52, e3B);
        INDEX_TO_POSITION.put(55, b4B);
        INDEX_TO_POSITION.put(56, c4B);
        INDEX_TO_POSITION.put(57, d4B);
        INDEX_TO_POSITION.put(58, e4B);
        INDEX_TO_POSITION.put(61, b5B);
        INDEX_TO_POSITION.put(62, c5B);
        INDEX_TO_POSITION.put(63, d5B);
        INDEX_TO_POSITION.put(64, e5B);
        INDEX_TO_POSITION.put(72, a1C);
        INDEX_TO_POSITION.put(73, b1C);
        INDEX_TO_POSITION.put(76, e1C);
        INDEX_TO_POSITION.put(77, f1C);
        INDEX_TO_POSITION.put(78, a2C);
        INDEX_TO_POSITION.put(79, b2C);
        INDEX_TO_POSITION.put(82, e2C);
        INDEX_TO_POSITION.put(83, f2C);
        INDEX_TO_POSITION.put(96, a5C);
        INDEX_TO_POSITION.put(97, b5C);
        INDEX_TO_POSITION.put(100, e5C);
        INDEX_TO_POSITION.put(101, f5C);
        INDEX_TO_POSITION.put(102, a6C);
        INDEX_TO_POSITION.put(103, b6C);
        INDEX_TO_POSITION.put(106, e6C);
        INDEX_TO_POSITION.put(107, f6C);
        INDEX_TO_POSITION.put(115, b2D);
        INDEX_TO_POSITION.put(116, c2D);
        INDEX_TO_POSITION.put(117, d2D);
        INDEX_TO_POSITION.put(118, e2D);
        INDEX_TO_POSITION.put(121, b3D);
        INDEX_TO_POSITION.put(122, c3D);
        INDEX_TO_POSITION.put(123, d3D);
        INDEX_TO_POSITION.put(124, e3D);
        INDEX_TO_POSITION.put(127, b4D);
        INDEX_TO_POSITION.put(128, c4D);
        INDEX_TO_POSITION.put(129, d4D);
        INDEX_TO_POSITION.put(130, e4D);
        INDEX_TO_POSITION.put(133, b5D);
        INDEX_TO_POSITION.put(134, c5D);
        INDEX_TO_POSITION.put(135, d5D);
        INDEX_TO_POSITION.put(136, e5D);
        INDEX_TO_POSITION.put(144, a1E);
        INDEX_TO_POSITION.put(145, b1E);
        INDEX_TO_POSITION.put(148, e1E);
        INDEX_TO_POSITION.put(149, f1E);
        INDEX_TO_POSITION.put(150, a2E);
        INDEX_TO_POSITION.put(151, b2E);
        INDEX_TO_POSITION.put(154, e2E);
        INDEX_TO_POSITION.put(155, f2E);
        INDEX_TO_POSITION.put(168, a5E);
        INDEX_TO_POSITION.put(169, b5E);
        INDEX_TO_POSITION.put(172, e5E);
        INDEX_TO_POSITION.put(173, f5E);
        INDEX_TO_POSITION.put(174, a6E);
        INDEX_TO_POSITION.put(175, b6E);
        INDEX_TO_POSITION.put(178, e6E);
        INDEX_TO_POSITION.put(179, f6E);
        INDEX_TO_POSITION.put(187, b2F);
        INDEX_TO_POSITION.put(188, c2F);
        INDEX_TO_POSITION.put(189, d2F);
        INDEX_TO_POSITION.put(190, e2F);
        INDEX_TO_POSITION.put(193, b3F);
        INDEX_TO_POSITION.put(194, c3F);
        INDEX_TO_POSITION.put(195, d3F);
        INDEX_TO_POSITION.put(196, e3F);
        INDEX_TO_POSITION.put(199, b4F);
        INDEX_TO_POSITION.put(200, c4F);
        INDEX_TO_POSITION.put(201, d4F);
        INDEX_TO_POSITION.put(202, e4F);
        INDEX_TO_POSITION.put(205, b5F);
        INDEX_TO_POSITION.put(206, c5F);
        INDEX_TO_POSITION.put(207, d5F);
        INDEX_TO_POSITION.put(208, e5F);
        INDEX_TO_POSITION.put(216, a1G);
        INDEX_TO_POSITION.put(217, b1G);
        INDEX_TO_POSITION.put(220, e1G);
        INDEX_TO_POSITION.put(221, f1G);
        INDEX_TO_POSITION.put(222, a2G);
        INDEX_TO_POSITION.put(223, b2G);
        INDEX_TO_POSITION.put(226, e2G);
        INDEX_TO_POSITION.put(227, f2G);
        INDEX_TO_POSITION.put(240, a5G);
        INDEX_TO_POSITION.put(241, b5G);
        INDEX_TO_POSITION.put(244, e5G);
        INDEX_TO_POSITION.put(245, f5G);
        INDEX_TO_POSITION.put(246, a6G);
        INDEX_TO_POSITION.put(247, b6G);
        INDEX_TO_POSITION.put(250, e6G);
        INDEX_TO_POSITION.put(251, f6G);
    }

    /** Maximum X coordinate value. */
    public static final int MAX_X = 6;

    /** Maximum Y coordinate value. */
    public static final int MAX_Y = 6;

    /** Maximum Z coordinate value. */
    public static final int MAX_Z = 7;

    /** Values. */
    private static final TridPosition[] VALUES;

    static
    {
        VALUES = INDEX_TO_POSITION.values().toArray(new TridPosition[112]);
    }

    /**
     * @param x X coordinate.
     * @param y Y coordinate.
     * @param z Z coordinate.
     * 
     * @return the index.
     */
    public static Integer computeIndex(final int x, final int y, final int z)
    {
        Integer answer = null;

        if ((0 <= x) && (x < MAX_X) && (0 <= y) && (y < MAX_Y) && (0 <= z) && (z < MAX_Z))
        {
            answer = x + ((y + (z * MAX_Y)) * MAX_X);
        }

        return answer;
    }

    /**
     * @param x X coordinate.
     * @param y Y coordinate.
     * @param z Z coordinate.
     * 
     * @return the position for the given parameters.
     */
    public static TridPosition findByCoordinates(final int x, final int y, final int z)
    {
        return findByIndex(computeIndex(x, y, z));
    }

    /**
     * @param index Index.
     * 
     * @return the position for the given parameter.
     */
    public static TridPosition findByIndex(final Integer index)
    {
        TridPosition answer = null;

        if (index != null)
        {
            answer = INDEX_TO_POSITION.get(index);
        }

        return answer;
    }

    /**
     * @return values.
     */
    public static TridPosition[] values()
    {
        return VALUES;
    }

    /** Index. */
    private final int index;

    /** Name. */
    private final String name;

    /** X coordinate. */
    private final int x;

    /** Y coordinate. */
    private final int y;

    /** Z coordinate. */
    private final int z;

    /**
     * Construct this object.
     * 
     * @param name Name.
     * @param x X coordinate.
     * @param y Y coordinate.
     * @param z Z coordinate.
     */
    @SuppressWarnings("hiding")
    private TridPosition(final String name, final int x, final int y, final int z)
    {
        this.name = name;
        this.x = x;
        this.y = y;
        this.z = z;
        this.index = computeIndex(x, y, z);
    }

    @Override
    public int getFile()
    {
        return x;
    }

    @Override
    public int getIndex()
    {
        return index;
    }

    @Override
    public int getLevel()
    {
        return z;
    }

    @Override
    public int getRank()
    {
        return y;
    }

    @Override
    public Integer getX()
    {
        return x;
    }

    @Override
    public Integer getY()
    {
        return y;
    }

    @Override
    public Integer getZ()
    {
        return z;
    }

    @Override
    public String name()
    {
        return name;
    }

    @Override
    public String toString()
    {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }
}

/*
 * Provides a problem definition for finding the Fibonnacci sequence.
 * 
 * @param popSize Population size.
 * @param generationCount Generation count.
 * @param backCount Back count for stopping.
 */
function FibonnacciProblem(popSize, generationCount, backCount)
{
    this.createGA = function()
    {
        LOGGER.info("popSize = " + popSize);
        LOGGER.info("generationCount = " + generationCount);
        LOGGER.info("backCount = " + backCount);

        var genes = this.createGenes();
        var genomeLength = 10;
        var genomeFactory = new GenomeFactory(genes, genomeLength);
        var population = GAUtilities.createPopulation(popSize, genomeFactory);
        var comparator = GenomeComparator;
        var selectionCount = Math.floor(0.20 * popSize);
        var selector = new Selector(selectionCount,
                SelectionOperator.randomSelect);
        var operators = [
                new Operator(0.05, 1, new Copier(CopyOperator.copy)),
                new Operator(0.75, 2, new Crossoverer(
                        CrossoverOperator.twoPointConstantLength)),
                new Operator(0.20, 1, new Mutator(genes,
                        MutationOperator.mutate)), ];

        var ga = new GeneticAlgorithm(population, this.evaluator,
                generationCount, comparator, selector, operators,
                genomeFactory, backCount);

        return ga;
    }

    this.createGenes = function()
    {
        var genes = [];

        // Genes are numbers in [0, 100).
        for (var i = 0; i < 100; i++)
        {
            genes[i] = i;
        }

        return genes;
    }

    this.evaluator =
    {
        SEQUENCE: [ 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, ],

        idealEvaluation: 10.0,

        getIdealEvaluation: function()
        {
            return this.idealEvaluation;
        },

        evaluate: function(population)
        {
            for (var i = 0; i < population.length; i++)
            {
                var genome = population[i];
                genome.fitness = 0;

                // Count the number of genes which match the answer.
                for (var j = 0; j < genome.length; j++)
                {
                    if (genome[j] == this.SEQUENCE[j])
                    {
                        genome.fitness++;
                    }
                }
            }
        },
    }
}

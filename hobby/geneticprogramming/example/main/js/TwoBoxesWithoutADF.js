define([ "Arithmetic", "GenomeComparator", "Terminal", "process/CopyOperator", "process/CrossoverOperator",
        "process/GeneticAlgorithm", "process/GenomeFactory", "process/NumericEvaluator", "process/Operator",
        "process/PopulationGenerator", "process/SelectionOperator" ], function(Arithmetic, GenomeComparator, Terminal,
        CopyOperator, CrossoverOperator, GeneticAlgorithm, GenomeFactory, NumericEvaluator, Operator,
        PopulationGenerator, SelectionOperator)
{
    "use strict";
    function TwoBoxesWithoutADF(store, popSize, generationCount)
    {
        InputValidator.validateNotNull("store", store);
        InputValidator.validateNotNull("popSize", popSize);
        InputValidator.validateNotNull("generationCount", generationCount);

        LOGGER.info("popSize = " + popSize);
        LOGGER.info("generationCount = " + generationCount);

        var fitnessCases;
        var functions;
        var maxDepth = 6;
        var terminals;

        this.createEvaluator = function()
        {
            var fitnessCases = this.fitnessCases();
            var errorThreshold = 0.01;
            var idealGenomeLength = 11;

            return new NumericEvaluator(fitnessCases, errorThreshold);
        };

        this.createGeneticAlgorithm = function()
        {
            var population = this.createPopulation();
            var evaluator = this.createEvaluator();
            var comparator = GenomeComparator;
            var selector = this.createSelector();
            var operators = this.createOperators();
            var genomeFactory = this.createGenomeFactory();

            return new GeneticAlgorithm(store, population, evaluator, generationCount, comparator, selector, operators,
                    genomeFactory);
        };

        this.createGenomeFactory = function()
        {
            return new GenomeFactory.Full(this.functions(), this.terminals(), maxDepth);
        };

        this.createOperators = function()
        {
            var operators = [];
            operators.push(new Operator(0.05, 1, new CopyOperator.Copier(CopyOperator.copy)));
            operators.push(new Operator(0.95, 2, new CrossoverOperator.Crossoverer(CrossoverOperator.crossover)));

            return operators;
        };

        this.createPopulation = function()
        {
            var populationGenerator = new PopulationGenerator(this.functions(), this.terminals(), maxDepth, popSize);

            return populationGenerator.generate();
        };

        this.createSelector = function()
        {
            var selectionCount = Math.floor(0.50 * popSize);

            return new SelectionOperator.Selector(selectionCount, SelectionOperator.fitnessProportionalSelect);
        };

        this.fitnessCases = function()
        {
            if (!fitnessCases)
            {
                fitnessCases = [];

                fitnessCases.push(
                {
                    input:
                    {
                        L0: 3,
                        W0: 4,
                        H0: 7,
                        L1: 2,
                        W1: 5,
                        H1: 3,
                    },
                    output: 54,
                });

                fitnessCases.push(
                {
                    input:
                    {
                        L0: 7,
                        W0: 10,
                        H0: 9,
                        L1: 10,
                        W1: 3,
                        H1: 1,
                    },
                    output: 600,
                });

                fitnessCases.push(
                {
                    input:
                    {
                        L0: 10,
                        W0: 9,
                        H0: 4,
                        L1: 8,
                        W1: 1,
                        H1: 6,
                    },
                    output: 312,
                });

                fitnessCases.push(
                {
                    input:
                    {
                        L0: 3,
                        W0: 9,
                        H0: 5,
                        L1: 1,
                        W1: 6,
                        H1: 4,
                    },
                    output: 111,
                });

                fitnessCases.push(
                {
                    input:
                    {
                        L0: 4,
                        W0: 3,
                        H0: 2,
                        L1: 7,
                        W1: 6,
                        H1: 1,
                    },
                    output: -18,
                });

                fitnessCases.push(
                {
                    input:
                    {
                        L0: 3,
                        W0: 3,
                        H0: 1,
                        L1: 9,
                        W1: 5,
                        H1: 4,
                    },
                    output: -171,
                });

                fitnessCases.push(
                {
                    input:
                    {
                        L0: 5,
                        W0: 9,
                        H0: 9,
                        L1: 1,
                        W1: 7,
                        H1: 6,
                    },
                    output: 363,
                });

                fitnessCases.push(
                {
                    input:
                    {
                        L0: 1,
                        W0: 2,
                        H0: 9,
                        L1: 3,
                        W1: 9,
                        H1: 2,
                    },
                    output: -36,
                });

                fitnessCases.push(
                {
                    input:
                    {
                        L0: 2,
                        W0: 6,
                        H0: 8,
                        L1: 2,
                        W1: 6,
                        H1: 10,
                    },
                    output: -24,
                });

                fitnessCases.push(
                {
                    input:
                    {
                        L0: 8,
                        W0: 1,
                        H0: 10,
                        L1: 7,
                        W1: 5,
                        H1: 1,
                    },
                    output: 45,
                });
            }

            return fitnessCases;
        };

        this.functions = function()
        {
            if (!functions)
            {
                functions = [];

                functions.push(Arithmetic.Add);
                functions.push(Arithmetic.Divide);
                functions.push(Arithmetic.Multiply);
                functions.push(Arithmetic.Subtract);
            }

            return functions;
        };

        this.objective = function()
        {
            return "Find an equation to produce the given outputs from the given inputs.";
        };

        this.terminals = function()
        {
            if (!terminals)
            {
                terminals = [];

                terminals.push(new Terminal.Variable("L0"));
                terminals.push(new Terminal.Variable("W0"));
                terminals.push(new Terminal.Variable("H0"));
                terminals.push(new Terminal.Variable("L1"));
                terminals.push(new Terminal.Variable("W1"));
                terminals.push(new Terminal.Variable("H1"));
            }

            return terminals;
        };
    }

    return TwoBoxesWithoutADF;
});

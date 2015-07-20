// require("ArrayAugments");
// require("MathAugments");

/*
 * Provides a mutation operator.
 */
var MutationOperator =
{
    deleteGene: function(genes, genome)
    {
        if (genome.length < 2)
        {
            // Degenerate case.
            var answer = genome.slice();
            answer.creator = genome.creator;

            return answer;
        }
        else
        {
            var index = Math.Vizzini.randomIntFromRange(0, genome.length);

            var answer = genome.slice();
            var deleteCount = 1;

            answer.splice(index, deleteCount);

            return MutationOperator.assignCreator(answer, "deleteGene");
        }
    },

    insertGene: function(genes, genome)
    {
        var index = Math.Vizzini.randomIntFromRange(0, genome.length);

        var answer = genome.slice();
        var deleteCount = 0;
        var gene = Array.Vizzini.randomElement(genes);

        answer.splice(index, deleteCount, gene);

        return MutationOperator.assignCreator(answer, "insertGene");
    },

    mutate: function(genes, genome)
    {
        var index = Math.Vizzini.randomIntFromRange(0, genome.length);
        var answer = genome.slice();

        answer[index] = Array.Vizzini.randomElement(genes);

        return MutationOperator.assignCreator(answer, "mutate");
    },

    assignCreator: function(genome, suffix)
    {
        genome.creator = "MutationOperator." + suffix;

        return genome;
    },
}

function Mutator(genes, mutateFunction)
{
    InputValidator.validateNotEmpty("genes", genes);
    InputValidator.validateNotNull("mutateFunction", mutateFunction);

    this.getGenes = function()
    {
        return genes;
    }

    this.execute = function(genome)
    {
        return mutateFunction(genes, genome);
    }
}

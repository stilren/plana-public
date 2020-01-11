using System.IO;
using web.Models;
using web.Services;
using Xunit;
using static test.Helpers;

namespace test
{
    public class UnitTest1
    {
        [Fact]
        public void StopsIfCannotFindBetterSolution()
        {
            var assService = new AssignmentService();
            var pathname = Path.Combine(Directory.GetCurrentDirectory(), $"correctNumberOfIterations.json");
            var problemStatement = ReadFromJsonFile<ProblemStatement>(pathname);
            var (solution, metaData) = assService.Solve(problemStatement, true);
            Assert.True(solution.IsPerfect); //This may fail if we are unlucky with ordering of userToTradeWithPrioArr
        }

        [Fact]
        public void AllChoresMustBeGivenOutInInitialSolution()
        {
            var assService = new AssignmentService();
            var pathname = Path.Combine(Directory.GetCurrentDirectory(), $"initialSolutionBug.json");
            var problemStatement = ReadFromJsonFile<ProblemStatement>(pathname);
            var (solution, metaData) = assService.Solve(problemStatement, true);
            Assert.Equal(2, metaData.InititalSolution.TotalDiff);
        }


        [Fact]
        public void actualAndShareAddsUp()
        {
            var assService = new AssignmentService();
            var pathname = Path.Combine(Directory.GetCurrentDirectory(), $"actualAndShareDoesNotAddUp.json");
            var problemStatement = ReadFromJsonFile<ProblemStatement>(pathname);
            var (solution, _) = assService.Solve(problemStatement, true);
            Assert.False(solution.IsPerfect);
        }
    }
}

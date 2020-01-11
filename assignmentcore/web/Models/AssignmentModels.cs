using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace web.Models
{
    public class ChoreCore
    {
        public string choreId { get; set; }
        public List<EffortRating> effortRatings { get; set; }
        public string lockedToUserId { get; set; }
        public int effort => this.effortRatings.Min(e => e.effort);
    }

    public class UserCore
    {
        public string userId { get; set; }
        public double shareOfChoresPercent { get; set; }
        public ChoreCore[] lockedChores { get; internal set; }
        public double percentAfterMyLockedChores { get; internal set; }
    }

    public class ProblemStatement
    {
        public IEnumerable<ChoreCore> chores { get; set; }
        public IEnumerable<UserCore> users { get; set; }
        public bool CustomShareOfChores { get; set; } = false;
    }

    public class Chore : ChoreCore
    {
        public string assigneeId { get; set; }
        public List<MoveCost> moveCosts { get; set; } = new List<MoveCost>();
        public int EffortDiffForUser(string userID) => this.effortRatings.First(e => e.userId == userID).effort - this.effort;
        public int MoveCostToUser(string userId) => this.moveCosts.First(m => m.userId == userId).moveCost;
    }

    public class MoveCost
    {
        public string userId { get; set; }
        public int moveCost { get; set; }
    }

    public class EffortRating
    {
        public string userId { get; set; }
        public int effort { get; set; }
    }

    public class User : UserCore
    {
        public int ShareOfChoresEffort { get; set; } = 0;
        public List<Chore> AssignedChores { get; set; } = new List<Chore>();
        public int CurrentActualEffort => this.AssignedChores.Sum(c => c.effort);
        public int CurrentPercivedEffort => this.AssignedChores.Sum(c => c.effortRatings.First(e => e.userId == this.userId).effort);
        public int EffortDiff => CurrentPercivedEffort - CurrentActualEffort;
    }

    public class Solution
    {
        public int MaximumDiff { get; set; }
        public int TotalDiff { get; set; }
        public List<KeyValuePair<string, string>> choreToUserMap { get; set; }
        public bool IsPerfect => (MaximumDiff == 0 && TotalDiff == 0);
    }

    public class MetaData
    {
        public int TradesToFindBestSolution { get; set; }
        public int IterationsToFindBestSolution { get; set; }
        public Solution InititalSolution { get; set; }
    }
}


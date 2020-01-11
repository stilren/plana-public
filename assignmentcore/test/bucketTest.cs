using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using web.Models;
using web.Services;
using Xunit;

namespace test
{
    public class bucketTest
    {
        [Fact]
        public void Test()
        {
            var problemStatement = new ProblemStatement
            {
                chores = new List<ChoreCore>
                {
                    createChore("c1", 1, 2, 3),
                    createChore("c2", 2, 2, 3),
                    createChore("c3", 1, 1, 1),
                    createChore("c4", 3, 2, 2),
                    createChore("c5", 1, 2, 1),
                    createChore("c6", 1, 2, 2),
                    createChore("c7", 2, 1, 2)
                },
                users = new List<UserCore>
                {
                    new UserCore
                    {
                        userId = "u1",
                        shareOfChoresPercent=0.33333
                    },
                    new UserCore
                    {
                        userId = "u2",
                        shareOfChoresPercent=0.111111
                    },
                    new UserCore
                    {
                        userId = "u3",
                        shareOfChoresPercent=0.666666
                    },
                }
            };

            var assService = new AssignmentService();
            var result1 = assService.GetBuckets(problemStatement.users, problemStatement.chores);
            Assert.Equal(3, result1.Count());
        }

        [Fact]
        public void LockedTest()
        {
            var problemStatement = new ProblemStatement
            {
                chores = new List<ChoreCore>
                {
                    createChore("c1", 1, 2, 3,"u2"),
                    createChore("c2", 2, 2, 3, "u2"),
                    createChore("c3", 1, 1, 1, "u2"),
                    createChore("c4", 2, 3, 3),
                    createChore("c7", 2, 1, 2)
                },
                users = new List<UserCore>
                {
                    new UserCore
                    {
                        userId = "u1",
                        shareOfChoresPercent=0.2
                    },
                    new UserCore
                    {
                        userId = "u2",
                        shareOfChoresPercent=0.3
                    },
                    new UserCore
                    {
                        userId = "u3",
                        shareOfChoresPercent=0.5
                    },
                }
            };

            var assService = new AssignmentService();
            var result1 = assService.Solve(problemStatement);
            Assert.True(result1.Item1.IsPerfect);
        }

        [Fact]
        public void LockedTest2()
        {
            var problemStatement = new ProblemStatement
            {
                chores = new List<ChoreCore>
                {
                    createChore("c1", 1, 2, 3, 3,"u2"),
                    createChore("c2", 2, 2, 3, 3),
                    createChore("c3", 1, 1, 1, 3),
                    createChore("c4", 2, 3, 3, 2),
                    createChore("c7", 2, 1, 2, 3)
                },
                users = new List<UserCore>
                {
                    new UserCore
                    {
                        userId = "u1",
                        shareOfChoresPercent=0.2
                    },
                    new UserCore
                    {
                        userId = "u2",
                        shareOfChoresPercent=0.3
                    },
                    new UserCore
                    {
                        userId = "u3",
                        shareOfChoresPercent=0.4
                    },
                    new UserCore
                    {
                        userId = "u4",
                        shareOfChoresPercent=0.1
                    },
                }
            };

            var assService = new AssignmentService();
            var result1 = assService.Solve(problemStatement);
            Assert.Equal(1, result1.Item1.TotalDiff);
        }

        private ChoreCore createChore(string choreName, int e1, int e2, int e3, string lockedTo = null)
        {
            return new ChoreCore
            {
                lockedToUserId = lockedTo,
                choreId = choreName,
                effortRatings = new List<EffortRating>
                        {
                            new EffortRating()
                            {
                                effort = e1,
                                userId = "u1"
                            },
                            new EffortRating()
                            {
                                effort = e2,
                                userId = "u2"
                            },
                            new EffortRating()
                            {
                                effort = e3,
                                userId = "u3"
                            }
                        }
            };
        }

        private ChoreCore createChore(string choreName, int e1, int e2, int e3, int e4, string lockedTo = null)
        {
            return new ChoreCore
            {
                lockedToUserId = lockedTo,
                choreId = choreName,
                effortRatings = new List<EffortRating>
                        {
                            new EffortRating()
                            {
                                effort = e1,
                                userId = "u1"
                            },
                            new EffortRating()
                            {
                                effort = e2,
                                userId = "u2"
                            },
                            new EffortRating()
                            {
                                effort = e3,
                                userId = "u3"
                            },
                            new EffortRating()
                            {
                                effort = e4,
                                userId = "u4"
                            }
                        }
            };
        }
    }
}

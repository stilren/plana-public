using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using web.Helpers;
using web.Models;

namespace web.Services
{
    public interface IAssignmentService
    {
        (Solution, MetaData) Solve(ProblemStatement problemStatement, bool print = false);
    }
    public class AssignmentService : IAssignmentService
    {
        public (Solution, MetaData) Solve(ProblemStatement problemStatement, bool print = false)
        {
            //clean data - users might not have effort ratings - add locked chores to user - and shares might be missing
            foreach (var chore in problemStatement.chores)
            {
                foreach (var user in problemStatement.users)
                {
                    var effortRating = chore.effortRatings.FirstOrDefault(e => e.userId == user.userId);
                    if (effortRating == null)
                    {
                        chore.effortRatings.Add(new EffortRating
                        {
                            userId = user.userId,
                            effort = chore.effortRatings.Min(e => e.effort)
                        });
                    }

                    if (!problemStatement.CustomShareOfChores)
                    {
                        user.shareOfChoresPercent = 1.0 / (double)problemStatement.users.Count();
                    }

                    user.lockedChores = problemStatement.chores.Where(c => c.lockedToUserId == user.userId).ToArray();
                    var exactActualEffort = problemStatement.chores.Sum(c => c.effort) * user.shareOfChoresPercent;
                    var percentAfterMyLockedChores = (1 - (user.lockedChores.Sum(c => c.effort) / exactActualEffort)) * user.shareOfChoresPercent;
                    user.percentAfterMyLockedChores = percentAfterMyLockedChores > 0 ? percentAfterMyLockedChores : 0;

                }
            }

            //Adjust problem after locked chores
            var usersToSolve = problemStatement.users.Where(u => u.percentAfterMyLockedChores > 0);
            var usersFullOfChores = problemStatement.users.Where(u => u.percentAfterMyLockedChores == 0);
            var choresToSolve = problemStatement.chores.Select(c => c);
            var sumOfSharePercentAfterLocked = problemStatement.users.Sum(u => u.percentAfterMyLockedChores);
            var adjustRatio = 1 / sumOfSharePercentAfterLocked;
            foreach (var user in usersToSolve)
            {
                user.shareOfChoresPercent = user.percentAfterMyLockedChores * adjustRatio;
            }
            foreach (var chore in choresToSolve)
            {
                chore.effortRatings = chore.effortRatings.Where(e => !usersFullOfChores.Any(u => u.userId == e.userId)).ToList();
            }

            choresToSolve = choresToSolve.Where(c => string.IsNullOrEmpty(c.lockedToUserId));
            var solutions = new List<Solution>();
            if (choresToSolve.Count() != 0)
            {
                var bucketsPermutations = GetBuckets(usersToSolve, choresToSolve);
                foreach (var buckets in bucketsPermutations)
                {
                    Debug.WriteLine($"Solving for permutation {buckets.Select(kvp => kvp.Value).ToArray()}:");
                    var (solution, metadata) = SolveForBuckets(choresToSolve.ToArray(), usersToSolve.ToArray(), buckets, print);
                    if (solution.IsPerfect)
                    {
                        return (solution, metadata);
                    }
                    solutions.Add(solution);
                }
            }
            else
            {
                //All chores locked, just add a empty solution
                solutions.Add(new Solution
                {
                    choreToUserMap = new List<KeyValuePair<string, string>>()
                });
            }
            var bestSolution = solutions.OrderBy(s => s.TotalDiff).ThenBy(s => s.MaximumDiff).First();
            foreach (var user in problemStatement.users)
            {
                foreach (var chore in user.lockedChores)
                {
                    bestSolution.choreToUserMap.Add(new KeyValuePair<string, string>(user.userId, chore.choreId));
                }
            }
            return (bestSolution, null);
        }

        public IEnumerable<IEnumerable<KeyValuePair<string, int>>> GetBuckets(IEnumerable<UserCore> users, IEnumerable<ChoreCore> chores)
        {
            var result = new List<IEnumerable<KeyValuePair<string, int>>>();
            var effortSum = chores.Sum(c => c.effortRatings.Min(e => e.effort));
            var baseEfforts = new List<KeyValuePair<string, int>>();
            var canGetMore = new List<string>();
            foreach (var user in users)
            {
                var effortShare = user.shareOfChoresPercent * effortSum;
                if (effortShare % 1 != 0)
                {
                    canGetMore.Add(user.userId);
                }
                baseEfforts.Add(new KeyValuePair<string, int>(user.userId, (int)Math.Floor(effortShare)));
            }

            if (!canGetMore.Any())
            {
                result.Add(new List<KeyValuePair<string, int>>(baseEfforts));
                return result;
            }

            var residualSum = effortSum - baseEfforts.Sum(bE => bE.Value);
            var residuals = canGetMore.Select(u => 0).ToArray();
            var j = 0;
            for (int i = 0; i < residualSum; i++)
            {
                residuals[i] += 1;
                j++;
                if (j > residuals.Length) j = 0;
            }
            var residualPermutations = residuals.GetDistinctPermutations();

            foreach (var permutation in residualPermutations)
            {
                var residualArr = permutation.ToArray();
                var buckets = new List<KeyValuePair<string, int>>(baseEfforts);
                foreach (var item in canGetMore.Select((userId, i) => (userId, i)))
                {
                    buckets = buckets.Select(kvp =>
                      {
                          if (kvp.Key != item.userId) return kvp;
                          return new KeyValuePair<string, int>(item.userId, kvp.Value + residualArr[item.i]);
                      }).ToList();
                }
                result.Add(buckets);
            }


            return result;
        }

        private static (Solution, MetaData) SolveForBuckets(ChoreCore[] coreChores, UserCore[] coreUsers, IEnumerable<KeyValuePair<string, int>> buckets, bool print = false)
        {
            var metaData = new MetaData();
            var foundSolutions = new List<Solution>();
            Solution bestSolution;
            var chores = coreChores.Select(c => new Chore
            {
                choreId = c.choreId,
                effortRatings = c.effortRatings
            }).ToArray();
            var users = coreUsers.Select(u => new User
            {
                userId = u.userId
            }).ToArray();
            #region CalculateMoveCosts
            foreach (var chore in chores)
            {
                foreach (var effortRatring in chore.effortRatings)
                {
                    var moveCost = new MoveCost
                    {
                        moveCost = effortRatring.effort - chore.effort,
                        userId = effortRatring.userId
                    };
                    chore.moveCosts.Add(moveCost);
                }
            };
            #endregion
            #region Calculate Share of chores per person
            for (int i = 0; i < users.Count(); i++)
            {
                users[i].ShareOfChoresEffort = buckets.Single(kvp => kvp.Key == users[i].userId).Value;
            }
            #endregion
            #region Find first solution
            var prioChores = chores.OrderByDescending(c => c.effort).ThenByDescending(c => c.moveCosts.Sum(m => m.moveCost));
            foreach (var chore in prioChores)
            {
                var userIdsByEffortRating = chore.effortRatings.OrderBy(e => e.effort).Select(e => e.userId).ToList();
                foreach (var idToTry in userIdsByEffortRating)
                {
                    var userToTry = users.First(u => u.userId == idToTry);
                    if (userToTry.CurrentActualEffort + chore.effort <= userToTry.ShareOfChoresEffort)
                    {
                        AssignChore(userToTry, chore);
                        break;
                    }
                }
            }
            foreach (var chore in chores)
            {
                if (string.IsNullOrEmpty(chore.assigneeId))
                {
                    var userToGiveChore = users.OrderBy(u => u.EffortDiff).ThenBy(u => u.CurrentActualEffort).First();
                    AssignChore(userToGiveChore, chore);
                }
            }
            bestSolution = CreateSolution(users);
            metaData.InititalSolution = CreateSolution(users);
            foundSolutions.Add(metaData.InititalSolution);
            #endregion
            if (print)
            {
                Debug.WriteLine("Initial Solution:");
                //PrintSolution(chores, users);
            }
            #region Find best solution
            var cannotImproveUsers = new List<string>();
            int userTurn = -1;
            for (int i = 0; i < 50; i++)
            {
                metaData.IterationsToFindBestSolution += 1;
                userTurn = userTurn == users.Length - 1 ? 0 : userTurn + 1;

                Debug.WriteLine($"Incoming solution total diff {foundSolutions.Last().TotalDiff} and max diff {foundSolutions.Last().MaximumDiff}");
                if (cannotImproveUsers.Count() == users.Count())
                {
                    Debug.WriteLine("Cannot imporove any more!");
                    //PrintSolution(chores, users);
                    break;
                };

                var userToPlay = users[userTurn];
                if (userToPlay.EffortDiff == 0 && userToPlay.CurrentActualEffort == userToPlay.ShareOfChoresEffort)
                {
                    cannotImproveUsers.Add(userToPlay.userId);
                    continue;
                }
                var choreToGiveAway = userToPlay.AssignedChores
                    .OrderByDescending(c => c.EffortDiffForUser(userToPlay.userId))
                    .ThenBy(c => c.effort)
                    .FirstOrDefault();

                if (choreToGiveAway == null)
                {
                    cannotImproveUsers.Add(userToPlay.userId);
                    break;
                }

                Debug.WriteLine($"User {userToPlay.userId} wants to give away {choreToGiveAway.choreId}");
                var userToTradeWithPrioArr = choreToGiveAway.moveCosts
                    .Where(m => m.userId != userToPlay.userId)
                    .Where(m => m.moveCost == 0)
                    .OrderBy(m => Guid.NewGuid())
                    .Select(m => users.First(u => u.userId == m.userId)).ToList();

                if (userToTradeWithPrioArr.Count == 0)
                {
                    cannotImproveUsers.Add(userToPlay.userId);
                    continue;
                }

                var trade = "";
                foreach (var userToTradeWith in userToTradeWithPrioArr)
                {
                    var choresToTakePrio = userToTradeWith.AssignedChores
                        .Where(c => c.EffortDiffForUser(userToPlay.userId) <= choreToGiveAway.EffortDiffForUser(userToPlay.userId))
                        .OrderByDescending(c => c.effort)
                        .ThenBy(c => c.moveCosts.Sum(m => m.moveCost));



                    if (!choresToTakePrio.Any())
                    {
                        continue;
                    }


                    metaData.TradesToFindBestSolution += 1;
                    var choresToTake = new List<Chore>();
                    var choresToGive = new List<Chore> { choreToGiveAway };
                    if (choresToTakePrio.Any(c => c.effort == choreToGiveAway.effort))
                    {
                        //Make 1v1 trade
                        choresToTake.Add(choresToTakePrio.First(c => c.effort == choreToGiveAway.effort));
                    }
                    else if (!choresToTakePrio.Any(c => c.effort < choreToGiveAway.effort))
                    {
                        //Try make many v 1 trade
                        var choreToTake = choresToTakePrio.First();
                        var additionalChoresToGivePrio = userToPlay.AssignedChores
                            .Where(c => c.choreId != choreToGiveAway.choreId)
                            .Where(c => c.effort < choreToTake.effort)
                            .Where(c => c.MoveCostToUser(userToTradeWith.userId) == 0)
                            .OrderByDescending(c => c.effort)
                            .ThenBy(c => c.moveCosts.Sum(m => m.moveCost));

                        foreach (var chore in additionalChoresToGivePrio)
                        {
                            choresToGive.Add(chore);
                            if (choresToGive.Sum(c => c.effort) == choreToTake.effort) break;
                        }
                        choresToTake.Add(choreToTake);
                    }
                    else
                    {
                        //Try make 1 v many trade
                        foreach (var choreToTake in choresToTakePrio)
                        {
                            choresToTake.Add(choreToTake);
                            var choresTakenSum = choresToTake.Sum(ch => ch.effort);
                            if (choresTakenSum == choreToGiveAway.effort) break;
                        }
                    }

                    if (choresToGive.Sum(c => c.effort) != choresToTake.Sum(c => c.effort)) break;

                    foreach (var chore in choresToGive)
                    {
                        Debug.WriteLine($"Giving chore {chore.choreId} ({chore.effort}) from {userToPlay.userId} to {userToTradeWith.userId}");
                        AssignChore(userToTradeWith, chore, userToPlay);
                    }
                    foreach (var chore in choresToTake)
                    {
                        Debug.WriteLine($"Giving chore {chore.choreId} ({chore.effort}) from {userToTradeWith.userId} to {userToPlay.userId}");
                        AssignChore(userToPlay, chore, userToTradeWith);
                    }

                    trade = "heaj";
                    cannotImproveUsers = new List<string>();
                    break;
                }

                if (trade == "")
                {
                    cannotImproveUsers.Add(userToPlay.userId);
                    continue;
                }

                var solution = CreateSolution(users);
                foundSolutions.Add(solution);
                if (solution.IsPerfect)
                {
                    Debug.WriteLine("Found perfect solution!");
                    //PrintSolution(chores, users);
                    break;
                }
            }
            #endregion
            bestSolution = foundSolutions.OrderBy(s => s.TotalDiff).ThenBy(s => s.MaximumDiff).First();
            return (bestSolution, metaData);
        }

        private static void AssignChore(User userTo, Chore chore, User userFrom = null)
        {
            userTo.AssignedChores.Add(chore);
            chore.assigneeId = userTo.userId;
            if (userFrom != null)
            {
                userFrom.AssignedChores.Remove(chore);
            }
        }

        private static Solution CreateSolution(User[] users)
        {
            var myDict = new List<KeyValuePair<string, string>>();
            foreach (var u in users)
            {
                foreach (var c in u.AssignedChores)
                {
                    myDict.Add(new KeyValuePair<string, string>(u.userId, c.choreId));
                }
            }
            return new Solution
            {
                choreToUserMap = myDict,
                TotalDiff = users.Sum(u => (u.CurrentPercivedEffort - u.CurrentActualEffort)),
                MaximumDiff = users.Max(u => (u.CurrentPercivedEffort - u.CurrentActualEffort))
            };
        }
    }
}

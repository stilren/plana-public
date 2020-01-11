import { ProblemStatement, Solution } from "./assignmentModels";
import { Agent } from "https";

export const assignmentApi = {
  assign
};

const uri = process.env["ASSIGNMENT_API"];
function assign(problemStatement: ProblemStatement) {
  var env = process.env.NODE_ENV;
  const requestOptions = {
    method: "POST",
    headers: Object.assign({ "Content-Type": "application/json" }),
    body: JSON.stringify(problemStatement)
    // agent: new Agent({ rejectUnauthorized: false }) //Todo - dont do this in production
  };

  return fetch(`${uri}/api/assignment`, requestOptions)
    .then(handleResponse)
    .then((solution: Solution) => {
      return solution;
    });
}

function handleResponse(response: Response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
}

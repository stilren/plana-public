import { CurrentUser, Context } from "../types";

const getUser = async (req, res, next, ctx: Context) => {
  let currentUser: CurrentUser = {
    id: "",
    email: "",
    households: []
  };
  if (req.user == null && process.env["ENVIRONMENT"] === "dev") {
    console.log("Using default user");
    ctx.currentUser = {
      id: "ck0jk6ubl001l07023z3705my",
      email: "sebastian.wassberg@gmail.com",
      households: ["ck0jk71bl00260702vep8nsbz", "ck0jl7jbo00j207023vbpdsjz"]
    };
    next();
  }
  const googleId = req.user.sub.split(`|`)[1];
  const userIdPromise = ctx.prisma.user({ googleId: googleId });
  const householdsPromise = ctx.prisma
    .user({ googleId: googleId })
    .households();
  Promise.all([userIdPromise, householdsPromise]).then(val => {
    if (val[0] === null) {
      console.log("New user detected");
      next();
    }
    currentUser.id = val[0].id;
    currentUser.email = val[0].email;
    currentUser.households = val[1].map(h => h.id);
    ctx.currentUser = currentUser;
    next();
  });
};

export default getUser;

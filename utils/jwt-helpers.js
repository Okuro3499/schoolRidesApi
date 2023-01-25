import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";

function jwtTokens({user_id, role_id, first_name, last_name, email, role_name, }) {
  const user = {user_id, role_id, first_name, last_name, email,  role_name};
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "60min",
  });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "60min",
  });
  var users = jwt_decode(accessToken);

  return { users, accessToken, refreshToken };
}

export { jwtTokens };

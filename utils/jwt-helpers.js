import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";

function jwtTokens({user_id, role_id, first_name, last_name, email, user_photo_url, role_name, role_description, home_address, phone_number}) {
  const user = {user_id, role_id, first_name, last_name, email, user_photo_url, role_name, role_description, home_address, phone_number};
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

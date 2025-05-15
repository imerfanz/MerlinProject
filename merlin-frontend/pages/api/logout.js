const cookie = require("cookie");

async function logout(req, res) {
  try {
    if (req.method !== "POST") {
      throw new Error( "Method not allowed: POST required");
    }
    await res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: -1, // Set expiration to past date
        sameSite: "strict",
        path: "/",
      })
    );
    res.status(200).send("logged out");
  } catch (error) {
    console.log( "error message : " , error);
    res.status(500).send("not logged out");
  }
}

export default logout;

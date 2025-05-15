const cookie = require("cookie");

async function loginPersist(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ message: "Method not allowed: POST required" });
  }
  if (!req.headers.cookie) {
    return res.status(403).json({ user : null })
  }
  const { token } = cookie.parse(req.headers.cookie);
  const userObject = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/token` , {
    method : "POST",
    headers:{
        "Content-Type" : "application/json"
    },
    body: JSON.stringify({
        jwt : token
    })
  })
  const user = userObject.status === 200 ? await userObject.json() : null;
  if (user) {
    const { __v , passwordHash , ...response } = user; 
    res.status(200).json({ user : response });
  }
  res.status(200).json({ user : null });
}

export default loginPersist;

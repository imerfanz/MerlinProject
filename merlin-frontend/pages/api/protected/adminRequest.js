const cookie = require("cookie");

async function AdminRequest(req, res) {
  try {
    const data = { ...req.body } || {};
    //console.log("data :" , data);
    const path = req.query.path;
    console.log("cookie : ", req.headers.cookie);
    if (!req.headers.cookie) {
      throw new Error("no token");
    }
    const { token } = cookie.parse(req.headers.cookie);

    if (!token) {
      return res.status(403).send("No token!");
    }

    const dataToSend = {
      token: token,
      ...(data && data),
    };

    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${path}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization : `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend),
      }
    );
    const status = await backendResponse.status;
    const response = await backendResponse.text();
    try {
      const parsed = JSON.parse(response);
      console.log("can be parsed");
      res.status(status).send(parsed);
    } catch (error) {
      console.log("text");
      res.status(status).send(response);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("API error");
  }
}

export default AdminRequest;

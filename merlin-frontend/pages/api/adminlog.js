// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const cookie = require('cookie');

async function loginFunc(req, res) {
  // Validate request method and body
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed: POST required' });
  }
  console.log("req");
  const { username, password, password2 } = req.body;
  if (!username || !password || !password2) {
    return res.status(400).json({ message: 'Missing required fields: phone and password' });
  }

  try {
    // Construct the API request URL
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/log`;

    // Prepare the request body
    const requestBody = JSON.stringify({ username, password, password2 });

    // Send the login request to the backend
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: requestBody,
    });

    // Check for successful response
    if (!response.ok) {
      const errorText = await response.text();
      if(response.status == 404 ) return res.status(404).send(errorText);
      throw new Error(errorText);
    }

    // Parse the login response
    const data = await response.json();
    console.log(data.token);

    // Send the formatted response back to the frontend
    res.setHeader('Set-Cookie', cookie.serialize('token' , data.token , {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge : 60 * 60 * 24 * 1,
      sameSite: 'strict',
      path: '/',
    }))
    res.status(200).json({ message: data.message });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message); // Generic error for security purposes
  }
}

export default loginFunc;
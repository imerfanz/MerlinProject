// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const cookie = require('cookie');
async function loginFunc(req, res) {
  // Validate request method and body
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed: POST required' });
  }

  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ message: 'Missing required fields: phone and password' });
  }

  try {
    // Construct the API request URL
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/log`;

    // Prepare the request body
    const requestBody = JSON.stringify({ phone, password });

    // Send the login request to the backend
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: requestBody,
    });

    // Check for successful response
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    // Parse the login response
    const data = await response.json();

    // Extract user data with optional fields handling
    const userObject = data.object || {}; // Use empty object if data.object is undefined
    const responseObject = {
      _id: userObject._id,
      name: userObject.name,
      phone: userObject.phone,
      lastname: userObject.lastname,
      state: userObject.state,
      city: userObject.city,
      postalCode: userObject.postalCode,
      invitedBy: userObject.invitedBy,
      notifications: userObject.notifications,
      affiliates: userObject.affiliates,
      createdAt: userObject.createdAt, // Assuming it's a typo for 'createdAt'
      balance : userObject.balance,
    };

    // Send the formatted response back to the frontend
    res.setHeader('Set-Cookie', cookie.serialize('token' , data.token , {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge : 60 * 60 * 24 * 3,
      sameSite: 'strict',
      path: '/',
    }))
    res.status(200).json({ message: data.message, object: responseObject });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message); // Generic error for security purposes
  }
}

export default loginFunc;
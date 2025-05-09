
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));

// Start Login - Redirect to Microsoft Login
app.get('/auth/azure', (req, res) => {
  const authorizeUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/authorize` +
    `?client_id=${process.env.CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}` +
    `&response_mode=query` +
    `&scope=openid%20profile%20email%20offline_access`;

  res.redirect(authorizeUrl);
});

// Callback - After Login
app.get('/auth/azure/callback', async (req, res) => {
  const code = req.query.code;

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(`https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`, 
    new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      scope: 'openid profile email offline_access https://graph.microsoft.com/User.Read',
      code: code,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
      client_secret: process.env.CLIENT_SECRET,
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const accessToken = tokenResponse.data.access_token;

    // Fetch User Info
    const userResponse = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const user = userResponse.data;

    // Fetch projects and roles here (dummy example):
    const projects = [
      { id: 1, name: 'Project 1' },
      { id: 2, name: 'Project 2' }
    ];
    const roles = [
      { role: 'Admin' },
      { role: 'Member' }
    ];

    // Send user data and projects/roles to frontend
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?name=${encodeURIComponent(user.displayName)}&email=${encodeURIComponent(user.mail || user.userPrincipalName)}&access_token=${accessToken}`);

  } catch (err) {
    console.error(err);
    res.status(500).send('Authentication Failed');
  }
});
// Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

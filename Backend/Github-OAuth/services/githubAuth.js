const axios = require('axios');


const getAccessToken = async (code) => {
  try {
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code,
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    return response.data.access_token;
  } catch (error) {
    throw new Error('Failed to get access token from GitHub');
  }
};


const getUserProfile = async (accessToken) => {
  try {
    const response = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${accessToken}`,
        'User-Agent': 'GitHub-OAuth-App',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('Failed to get user profile from GitHub');
  }
};


const getUserEmail = async (accessToken) => {
  try {
    const response = await axios.get('https://api.github.com/user/emails', {
      headers: {
        'Authorization': `token ${accessToken}`,
        'User-Agent': 'GitHub-OAuth-App',
      },
    });

    const primaryEmail = response.data.find(email => email.primary);
    return primaryEmail ? primaryEmail.email : response.data[0]?.email;
  } catch (error) {
    return null;
  }
};

module.exports = {
  getAccessToken,
  getUserProfile,
  getUserEmail,
};
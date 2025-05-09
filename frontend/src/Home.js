import React from 'react';

const Home = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/azure';  // Trigger Azure login
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Login using Azure DevOps (Microsoft)</h1>
      <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Login with Microsoft
      </button>
    </div>
  );
};

export default Home;


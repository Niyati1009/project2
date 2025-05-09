

import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch user profile info
    const fetchUserProfile = async () => {
      try {
        const accessToken = 'C839tgiWcHQDYvHFTfV5XpmYOedvzLxREWdgy3iPEDiy3lLNfu1xJQQJ99BDACAAAAAAAAAAAAASAZDO1veG '; // You get this after OAuth login

        const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        });

        if (!userResponse.ok) {
          throw new Error(`HTTP error! status: ${userResponse.status}`);
        }

        const userData = await userResponse.json();
        setUser({
          name: userData.displayName,
          email: userData.mail || userData.userPrincipalName, // sometimes 'mail' is null
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    // Fetch projects info
    const fetchProjects = async () => {
      try {
        const personalAccessToken = 'C839tgiWcHQDYvHFTfV5XpmYOedvzLxREWdgy3iPEDiy3lLNfu1xJQQJ99BDACAAAAAAAAAAAAASAZDO1veG ';
        const organization = 'niyatisharma1009';

        const projectsResponse = await fetch(`https://dev.azure.com/${organization}/_apis/projects?api-version=7.1-preview.4`, {
          headers: {
            'Authorization': 'Basic ' + btoa(':' + personalAccessToken),
            'Content-Type': 'application/json',
          }
        });

        if (!projectsResponse.ok) {
          throw new Error(`HTTP error! status: ${projectsResponse.status}`);
        }

        const projectsData = await projectsResponse.json();
        setProjects(projectsData.value);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchUserProfile();
    fetchProjects();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>

      <section style={{ marginBottom: '30px' }}>
        <h2>User Info</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </section>

      <section>
        <h2>Projects</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <h3>{project.name}</h3>
              <p>State: {project.state}</p>
              <p>Visibility: {project.visibility}</p>
              <p>Last Updated: {new Date(project.lastUpdateTime).toLocaleString()}</p>
              <a href={project.url} target="_blank" rel="noopener noreferrer">View Project API</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;



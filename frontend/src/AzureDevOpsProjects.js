

import React, { useEffect, useState } from 'react';

const AzureDevOpsProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const personalAccessToken = 'DYRBYtrz7YXhq6DSSJ7j0BZpTxfz9cipgIi5dDJC2vKafw3pgDtaJQQJ99BDACAAAAAAAAAAAAASAZDO4SEK'; // Replace this
        const organization = 'niyatisharma1009';

        // Fetch the projects
        const projectResponse = await fetch(`https://dev.azure.com/${organization}/_apis/projects?api-version=7.1-preview.4`, {
          headers: {
            'Authorization': 'Basic ' + btoa(':' + personalAccessToken),
            'Content-Type': 'application/json'
          }
        });

        if (!projectResponse.ok) {
          throw new Error(`HTTP error! status: ${projectResponse.status}`);
        }

        const projectData = await projectResponse.json();
        
        // For each project, fetch the teams
        const projectsWithTeams = await Promise.all(
          projectData.value.map(async (project) => {
            const teamResponse = await fetch(`https://dev.azure.com/${organization}/${project.id}/_apis/teams?api-version=7.1-preview.1`, {
              headers: {
                'Authorization': 'Basic ' + btoa(':' + personalAccessToken),
                'Content-Type': 'application/json'
              }
            });

            if (!teamResponse.ok) {
              console.error(`Error fetching teams for project ${project.name}:`, teamResponse.status);
              return { ...project, teams: [] }; // Add empty teams if error occurs
            }

            const teamData = await teamResponse.json();
            return { ...project, teams: teamData.value }; // Add teams to project object
          })
        );

        setProjects(projectsWithTeams); // Set projects with teams data
      } catch (error) {
        console.error('Error fetching projects or teams:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <h2>Azure DevOps Projects</h2>
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            <h3>{project.name}</h3>
            <p>State: {project.state}</p>
            <p>Visibility: {project.visibility}</p>
            <p>Last Updated: {new Date(project.lastUpdateTime).toLocaleString()}</p>

            {/* Displaying Teams */}
            <p>Teams: {project.teams.length > 0 ? project.teams.map(team => team.name).join(', ') : 'No teams available'}</p>

            <a href={project.url} target="_blank" rel="noopener noreferrer">View Project API</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AzureDevOpsProjects;

const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const project = JSON.parse(event.body);
    
    // Validate project data
    if (!project || !project.id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid project data' })
      };
    }

    const projectsStore = getStore('projects');
    await projectsStore.setJSON(project.id.toString(), project);

    console.log(`✅ Saved project: ${project.name} (ID: ${project.id})`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        project,
        message: 'Project saved successfully'
      })
    };
  } catch (error) {
    console.error('❌ Error saving project:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false,
        error: error.message 
      })
    };
  }
};

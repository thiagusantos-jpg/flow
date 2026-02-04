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

  try {
    const projectsStore = getStore('projects');
    const { blobs } = await projectsStore.list();
    
    const projects = [];
    for (const blob of blobs) {
      const data = await projectsStore.get(blob.key, { type: 'json' });
      if (data) {
        projects.push(data);
      }
    }

    console.log(`✅ Loaded ${projects.length} projects`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        projects,
        count: projects.length 
      })
    };
  } catch (error) {
    console.error('❌ Error loading projects:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false,
        error: error.message,
        projects: [] 
      })
    };
  }
};

// ==================== NETLIFY API INTEGRATION ====================
// Cole este código DENTRO do <script type="text/babel"> do seu index.html
// Logo no início, antes da declaração do ProjectManager

// Detectar ambiente (local ou produção)
const isProduction = window.location.hostname !== 'localhost';
const API_BASE = isProduction ? '/.netlify/functions' : 'http://localhost:8888/.netlify/functions';

console.log(`🌐 Ambiente: ${isProduction ? 'PRODUÇÃO' : 'LOCAL'}`);
console.log(`📡 API Base: ${API_BASE}`);

// ==================== FUNÇÕES DE API ====================

async function callNetlifyAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`❌ API Error (${endpoint}):`, error);
    throw error;
  }
}

// Carregar todos os projetos do Netlify
async function loadProjectsFromNetlify() {
  try {
    console.log('📥 Carregando projetos do Netlify...');
    const data = await callNetlifyAPI('get-projects');
    console.log(`✅ ${data.count} projetos carregados`);
    return data.projects || [];
  } catch (error) {
    console.error('❌ Erro ao carregar projetos:', error);
    return null;
  }
}

// Salvar projeto individual no Netlify
async function saveProjectToNetlify(project) {
  try {
    console.log(`💾 Salvando projeto "${project.name}" no Netlify...`);
    const data = await callNetlifyAPI('save-project', {
      method: 'POST',
      body: JSON.stringify(project)
    });
    console.log(`✅ Projeto salvo: ${project.name}`);
    return data;
  } catch (error) {
    console.error(`❌ Erro ao salvar projeto "${project.name}":`, error);
    return null;
  }
}

// Deletar projeto do Netlify
async function deleteProjectFromNetlify(projectId) {
  try {
    console.log(`🗑️ Deletando projeto ID ${projectId} do Netlify...`);
    const data = await callNetlifyAPI('delete-project', {
      method: 'POST',
      body: JSON.stringify({ id: projectId })
    });
    console.log(`✅ Projeto deletado: ${projectId}`);
    return data;
  } catch (error) {
    console.error(`❌ Erro ao deletar projeto ${projectId}:`, error);
    return null;
  }
}

// ==================== INSTRUÇÕES DE INTEGRAÇÃO ====================
// 
// Agora modifique estas funções no seu código React:
//
// 1. Função saveProjects (procure por "const saveProjects"):
/*
const saveProjects = async (newProjects) => {
  setProjects(newProjects);
  setSyncing(true);
  
  // Backup local (sempre)
  localStorage.setItem('projects', JSON.stringify(newProjects));
  
  // Salvar na nuvem Netlify
  try {
    for (const project of newProjects) {
      await saveProjectToNetlify(project);
    }
    console.log('☁️ Todos os projetos sincronizados com Netlify');
  } catch (error) {
    console.error('⚠️ Erro na sincronização:', error);
  } finally {
    setSyncing(false);
  }
};
*/

// 2. useEffect para carregar (procure por "useEffect(() =>"):
/*
useEffect(() => {
  const loadProjects = async () => {
    setSyncing(true);
    
    try {
      // Tentar carregar do Netlify primeiro
      const netlifyProjects = await loadProjectsFromNetlify();
      
      if (netlifyProjects && netlifyProjects.length > 0) {
        console.log('☁️ Usando dados do Netlify');
        setProjects(netlifyProjects);
        setSelectedProject(netlifyProjects[0].id);
        // Atualizar backup local
        localStorage.setItem('projects', JSON.stringify(netlifyProjects));
        setSyncing(false);
        return;
      }
      
      // Fallback: localStorage
      console.log('💾 Tentando localStorage...');
      const saved = localStorage.getItem('projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        setProjects(parsed);
        if (parsed.length > 0) {
          setSelectedProject(parsed[0].id);
          // Sincronizar para Netlify
          console.log('⬆️ Sincronizando localStorage → Netlify');
          for (const project of parsed) {
            await saveProjectToNetlify(project);
          }
        }
      } else {
        // Criar projeto demo
        createDemoProject();
      }
    } catch (error) {
      console.error('⚠️ Erro ao carregar:', error);
      // Fallback final: demo
      createDemoProject();
    } finally {
      setSyncing(false);
    }
  };
  
  loadProjects();
}, []);
*/

// 3. Função deleteProject (procure por "const deleteProject"):
/*
const deleteProject = async (id) => {
  const updated = projects.filter(p => p.id !== id);
  
  setSyncing(true);
  try {
    // Deletar do Netlify
    await deleteProjectFromNetlify(id);
    
    // Atualizar estado
    await saveProjects(updated);
    
    if (selectedProject === id) {
      setSelectedProject(updated[0]?.id || null);
    }
  } catch (error) {
    console.error('⚠️ Erro ao deletar:', error);
  } finally {
    setSyncing(false);
  }
};
*/

// 4. Adicionar estado de sincronização (no início do ProjectManager):
/*
const [syncing, setSyncing] = useState(false);
*/

// 5. Adicionar indicador visual no header (depois do logo):
/*
{syncing && (
  <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-lg animate-pulse">
    <Cloud className="w-4 h-4 text-cyan-400" />
    <span className="text-xs font-mono text-cyan-400">Sincronizando...</span>
  </div>
)}
{!syncing && (
  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg">
    <Cloud className="w-4 h-4 text-green-400" />
    <span className="text-xs font-mono text-green-400">☁️ Netlify</span>
  </div>
)}
*/

console.log('✅ Netlify API Integration carregado');

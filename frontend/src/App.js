
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import Dashboard from './Dashboard';
import AzureDevOpsProjects from './AzureDevOpsProjects';

function App() {
  return (
    <Router>
      <nav style={{ padding: '10px', backgroundColor: '#eee' }}>
        <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
        <Link to="/dashboard" style={{ marginRight: '10px' }}>Dashboard</Link>
        <Link to="/azureprojects">Azure Projects</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/azureprojects" element={<AzureDevOpsProjects />} />
      </Routes>
    </Router>
  );
}

export default App;

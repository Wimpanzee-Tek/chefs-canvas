import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import HomeView from './views/HomeView';
import RecipeDetailView from './views/RecipeDetailView';
import IngestionView from './views/IngestionView';
import SettingsView from './views/SettingsView';
import CookingModeView from './views/CookingModeView';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Cooking mode is full-screen, no layout */}
          <Route path="/cook/:id" element={<CookingModeView />} />

          {/* All other routes use the Layout wrapper */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<HomeView />} />
                <Route path="/recipe/:id" element={<RecipeDetailView />} />
                <Route path="/ingest" element={<IngestionView />} />
                <Route path="/settings" element={<SettingsView />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

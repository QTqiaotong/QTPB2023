import React, { useState, useEffect } from 'react';
import Story from './pages/Story';
import End from './pages/End';
import CityDetail from './pages/CityDetail';
import Globe from './pages/Globe';
import EnergyStation from './pages/EnergyStation';
import { EnergyProvider } from './context/EnergyContext';
import StarshipWidget from './components/game/StarshipWidget';
import Navbar from './components/Navbar';

import KeywordsParticle from './components/KeywordsParticle';
import PinkAnimationHome from './components/PinkAnimationHome';
import FirstsTimeline from './components/firsts/FirstsTimeline';
import HeroSection from './components/HeroSection';
import LettersModule from './components/letters/LettersModule';
import LettersIcon from './components/letters/LettersIcon';

export default function App() {
  const [page, setPage] = useState('home');
  const [selectedCity, setSelectedCity] = useState(null);
  const [activeTab, setActiveTab] = useState('keywords');

  // Sync tab state with URL hash for reload persistence
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['keywords', 'towhere', 'breaking', 'letters'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    // Initial load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSetTab = (tab) => {
    window.location.hash = tab;
    setActiveTab(tab);
  };

  const goTo = (p) => setPage(p);

  const goToCity = (cityName) => {
    setSelectedCity(cityName);
    setPage('city');
  };

  const goBackToGlobe = () => {
    setSelectedCity(null);
    setPage('globe');
  };

  return (
    <EnergyProvider>
      <div style={{ width: '100%', height: '100%', margin: 0, padding: 0 }}>
        {page === 'home' && (
          <>
            <Navbar
              activeTab={activeTab}
              setTab={handleSetTab}
              isDarkMode={['towhere', 'letters'].includes(activeTab)}
            />
            <LettersIcon
              onClick={() => handleSetTab('letters')}
              active={activeTab === 'letters'}
              isDarkMode={['towhere', 'letters'].includes(activeTab)}
            />
            <div className="page-content">
              {activeTab === 'keywords' && (
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '100vh',
                  overflow: 'hidden',
                  backgroundImage: 'url(/images/Background.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}>
                  {/* KeywordsParticle handles its own layering: Canvas at lowest, UI at highest */}
                  <KeywordsParticle />

                  {/* Middle layer: Interactive planets */}
                  <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
                    <HeroSection goTo={goTo} />
                  </div>
                </div>
              )}
              {activeTab === 'towhere' && <PinkAnimationHome goTo={goTo} goToCity={goToCity} />}
              {activeTab === 'breaking' && <FirstsTimeline />}
              {activeTab === 'letters' && <LettersModule />}
            </div>
          </>
        )}
        {page === 'story' && <Story goTo={goTo} />}
        {page === 'end' && <End goTo={goTo} />}
        {page === 'globe' && <Globe goTo={goTo} goToCity={goToCity} />}
        {page === 'city' && selectedCity && (
          <CityDetail cityName={selectedCity} goBack={goBackToGlobe} />
        )}
        {page === 'annual' && <EnergyStation goTo={goTo} />}

        {page === 'home' && activeTab === 'keywords' && (
          <StarshipWidget />
        )}
      </div>
    </EnergyProvider>
  );
}
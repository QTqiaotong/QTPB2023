import React from 'react';
import '../style.css';

const Navbar = ({ activeTab, setTab, isMobile }) => {
    const allTabs = [
        { id: 'towhere', label: 'Paths We Share' },
        { id: 'breaking', label: 'Milestones' },
        { id: 'prehistory', label: 'Prehistory' },
    ];

    const tabs = isMobile ? allTabs.filter(t => ['towhere', 'breaking', 'prehistory'].includes(t.id)) : allTabs;

    return (
        <nav className="fixed-navbar">
            <div className="navbar-container">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;

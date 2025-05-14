import { createContext, useContext, useState, useEffect } from 'react';

export const LeaderContext = createContext();

export const LeaderProvider = ({ children }) => {
    const [selectedLeader, setSelectedLeader] = useState(() => {
        // retrieve selected leader from localStorage on initial load
        const savedLeader = localStorage.getItem('selectedLeader');
        return savedLeader ? JSON.parse(savedLeader) : null; // return null if not available
    });

    // Save the selected leader to localStorage whenever it changes
    useEffect(() => {
        if (selectedLeader) {
            localStorage.setItem('selectedLeader', JSON.stringify(selectedLeader));
        }
    }, [selectedLeader]);

    return (
        <LeaderContext.Provider value={{ selectedLeader, setSelectedLeader }}>
            {children}
        </LeaderContext.Provider>
    );
};

// hook to access the Leader context
export const useLeader = () => {
    const context = useContext(LeaderContext);
    if (!context) {
        throw new Error('useLeader must be used within a LeaderProvider');
    }
    return context;
};

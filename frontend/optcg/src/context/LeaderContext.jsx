import { createContext, useContext, useState, useEffect } from 'react';
// depracated file
// instead of using leader provider to pass over the selected
//leader we are using the full power and advantages of react
// by using browser router and useParams to look at the URL
// in matches and determine the "selected" leader that way
// i figure ill leave this here as even tho its not the optimal way
// im still proud about how i solved the issue i had - even if there was technically a better
// made for react way of going about it /shrug this is just something i thought was creative
export const LeaderContext = createContext();


//using a context provider, we store in localstorage the leader  to recall it on reloads and new page instances, using browser local storage
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
    // we pass that localstorage instance of the leader to our context provider which we then wrap our app in
    //to pass that knowledge to its children, again not the BEST way sure
    // esspecially seeing as our app only has one page that needs this context provided to it
    // but i thought it was creative
    return (
        <LeaderContext.Provider value={{ selectedLeader, setSelectedLeader }}>
            {children}
        </LeaderContext.Provider>
    );
};

// custom hook to access the Leader context along with an error incase i was to build out more pages and forget to use it there properly
export const useLeader = () => {
    const context = useContext(LeaderContext);
    if (!context) {
        throw new Error('useLeader must be used within a LeaderProvider');
    }
    return context;
};


// just gonna leave this in here - have since moved to useParams

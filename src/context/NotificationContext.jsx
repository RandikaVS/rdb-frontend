import React, { useState, useContext, createContext } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notificationCount, setNotificationCount] = useState(0);
    const [notificationCountMessage, setNotificationCountMessage] = useState(0);
    const [notificationCountDocuments, setNotificationCountDocuments] = useState(0);
    const [notificationCountRepairs, setNotificationCountRepairs] = useState(0);
    const [notificationCountInspections, setNotificationCountInspections] = useState(0);
    const [notificationCountBills, setNotificationCountBills] = useState(0);
    const [notificationCountRent, setNotificationCountRent] = useState(0);
    const [pushedNotificationData, setPushedNotificationData] = useState(null);


    return (
        <NotificationContext.Provider
            value={{
                notificationCount,
                setNotificationCount,
                notificationCountMessage,
                setNotificationCountMessage,
                notificationCountDocuments,
                setNotificationCountDocuments,
                notificationCountRepairs,
                setNotificationCountRepairs,
                notificationCountInspections,
                setNotificationCountInspections,
                notificationCountBills,
                setNotificationCountBills,
                notificationCountRent,
                setNotificationCountRent,
                pushedNotificationData,
                setPushedNotificationData
            }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
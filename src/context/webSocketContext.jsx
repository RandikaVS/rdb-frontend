import io from 'socket.io-client';
import React, { useState, useEffect, useContext, createContext } from 'react';

import { useAuthContext } from 'src/auth/hooks'; // Assuming this path is correct and useAuthContext is a custom hook

// Create Context
const WebSocketContext = createContext(null);

// Context Provider Component
export const WebSocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const { user } = useAuthContext(); // Use the user from the auth context
	useEffect(() => {
		// Check if the user object is available
		if (user) {
			// Establish a new socket connection with user information
			const newSocket = io(import.meta.env.VITE_TMS_SERVER_URL, {
				query: {
					userId: user._id // Assuming the user object has an id. Adjust according to your user object structure
				}
			});

			// Update the socket state
			setSocket(newSocket);

			// Cleanup function to disconnect the socket when the component unmounts or the user changes
			return () => {
				newSocket.disconnect();
			};
		}
	}, [user]); // Depend on the user object to re-run the effect when it changes

	return (
		<WebSocketContext.Provider value={socket}>
			{children}
		</WebSocketContext.Provider>
	);
};

// Custom hook to use the WebSocket (Socket.IO) context
export const useWebSocket = () => useContext(WebSocketContext);

export default WebSocketProvider;



// import io from 'socket.io-client';
// import React, { useState, useEffect, useContext, createContext } from 'react';

// import { useAuthContext } from 'src/auth/hooks';
// /// Create Context
// const WebSocketContext = createContext(null);

// // Context Provider Component
// export const WebSocketProvider = ({ children }) => {
// 	const [socket, setSocket] = useState(null);
// 	const { user } = useAuthContext();
// 	useEffect(() => {
// 		// Connect to Socket.IO server
// 		// const newSocket = io(import.meta.env.VITE_TMS_SERVER_URL || 'http://localhost:5000');
// 		// const newSocket = io('http://localhost:5000');
// 		const { user } = useAuthContext();
// 		const newSocket = io('http://localhost:5000', {
// 			query: {
// 				user
// 			}
// 		});

// 		setSocket(newSocket);

// 		return () => {
// 			newSocket.disconnect();
// 		};
// 	}, []);

// 	return (
// 		<WebSocketContext.Provider value={socket}>
// 			{children}
// 		</WebSocketContext.Provider>
// 	);
// };

// // Custom hook to use the WebSocket (Socket.IO) context
// export const useWebSocket = () => useContext(WebSocketContext);

// export default WebSocketProvider;

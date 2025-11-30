import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (authUser) {
			const newSocket = io("http://localhost:5050", {
				query: {
					userId: authUser._id,
				},
				autoConnect: true,
				reconnection: true,
				reconnectionDelay: 1000,
				reconnectionAttempts: 5,
			});

			setSocket(newSocket);

			// socket.on() is used to listen to the events. can be used both on client and server side
			newSocket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			newSocket.on("connect", () => {
				console.log("Socket connected:", newSocket.id);
			});

			newSocket.on("disconnect", (reason) => {
				console.log("Socket disconnected:", reason);
			});

			return () => {
				console.log("Cleaning up socket");
				newSocket.close();
				setSocket(null);
			};
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser?._id]); // Only depend on the user ID, not the whole object

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};

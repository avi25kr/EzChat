import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { messages, setMessages } = useConversation();

	useEffect(() => {
		if (!socket) return;

		const handleNewMessage = (newMessage) => {
			newMessage.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play();
			// Get the latest messages from Zustand store
			const currentMessages = useConversation.getState().messages;
			const messagesArray = Array.isArray(currentMessages) ? currentMessages : [];
			setMessages([...messagesArray, newMessage]);
		};

		socket.on("newMessage", handleNewMessage);

		return () => {
			socket.off("newMessage", handleNewMessage);
		};
	}, [socket, setMessages]); // Remove messages from deps since we're using getState()
};
export default useListenMessages;

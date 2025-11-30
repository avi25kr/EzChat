import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { setMessages, selectedConversation } = useConversation();

	const sendMessage = async (message) => {
		setLoading(true);
		try {
			const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ message }),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			// Get the latest messages from Zustand store
			const currentMessages = useConversation.getState().messages;
			const messagesArray = Array.isArray(currentMessages) ? currentMessages : [];
			const updated = [...messagesArray, data];
			setMessages(updated);
		} catch (error) {
			console.error("Error sending message:", error);
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;

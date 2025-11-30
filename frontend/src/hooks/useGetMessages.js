import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				const res = await fetch(`/api/messages/${selectedConversation._id}`, {
					credentials: "include",
				});
				const data = await res.json();
				if (data.error) throw new Error(data.error);
				// Ensure we always set an array
				const messagesArray = Array.isArray(data) ? data : [];
				setMessages(messagesArray);
			} catch (error) {
				console.error("Error fetching messages:", error);
				toast.error(error.message);
				setMessages([]); // Set empty array on error
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?._id) {
			getMessages();
		} else {
			// Clear messages when no conversation is selected
			setMessages([]);
		}
	}, [selectedConversation?._id]); // Remove setMessages from deps - Zustand setters are stable

	return { messages, loading };
};
export default useGetMessages;

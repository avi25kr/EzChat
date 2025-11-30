import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);

	useEffect(() => {
		const getConversations = async () => {
			setLoading(true);
			try {
				const res = await fetch("/api/users", {
					credentials: "include",
				});
				
				console.log("Response status:", res.status);
				
				const data = await res.json();
				console.log("Users fetched:", data);
				console.log("Users array length:", Array.isArray(data) ? data.length : "Not an array");
				
				if (!res.ok) {
					throw new Error(data.error || "Failed to fetch users");
				}
				
				if (data.error) {
					throw new Error(data.error);
				}
				
				setConversations(Array.isArray(data) ? data : []);
			} catch (error) {
				console.error("Error fetching users:", error);
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		getConversations();
	}, []);

	return { loading, conversations };
};
export default useGetConversations;

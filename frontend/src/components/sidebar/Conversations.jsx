import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation";
import { useAuthContext } from "../../context/AuthContext";

const Conversations = () => {
	const { loading, conversations } = useGetConversations();
	const { authUser } = useAuthContext();
	
	console.log("Conversations component - conversations:", conversations);
	console.log("Conversations component - logged in user:", authUser?._id);
	
	// Filter out the logged-in user just in case
	const filteredConversations = conversations.filter(
		(conv) => conv._id !== authUser?._id
	);
	
	console.log("Filtered conversations:", filteredConversations);
	
	return (
		<div className='py-2 flex flex-col overflow-auto'>
			{filteredConversations.map((conversation, idx) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					emoji={getRandomEmoji()}
					lastIdx={idx === filteredConversations.length - 1}
				/>
			))}

			{loading ? <span className='loading loading-spinner mx-auto'></span> : null}
			{!loading && filteredConversations.length === 0 && (
				<p className='text-center text-gray-500 mt-4'>No other users found. Create another account to start chatting!</p>
			)}
		</div>
	);
};
export default Conversations;

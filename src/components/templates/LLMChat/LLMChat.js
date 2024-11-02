import { ChatListContainer } from './LLMChat.elements.js'
import ChatList from "../../organisms/ChatList/ChatList"
import SideBar from "../../organisms/SideBar/SideBar"
import { createLLMPageServices } from "../../services/LLMChatPage/LLMChatServices.js"
import store from '../../../redux/store.js'

export default function LLMChat({ state, services = createLLMPageServices(store) }) {
	const { sideBarState, chatListState } = state || {}
	const { sideBarServices, chatListServices } = services || {}
	return (<ChatListContainer><SideBar state={sideBarState} services={sideBarServices} /><ChatList state={chatListState} services={chatListServices} /></ChatListContainer>)
}
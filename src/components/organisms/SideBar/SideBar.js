import { SideBarContainer, IconContainer } from "./SideBar.elements"
import { BsLayoutSidebar } from 'react-icons/bs'
import { BiExport } from 'react-icons/bi'
import { MdLogout } from 'react-icons/md'
import OutlineButton from "../../atoms/OutlineButton/OutlineButton.js"
import ThreadList from "../../molecules/ThreadList/ThreadList"
import { handleExportButtonClick, noop } from "../../../utils/helpers.js"
import { VARIANTS } from '../../utils/constants.js'
import CustomSlider from "../../molecules/CustomSlider/CustomSlider.js"

export default function SideBar({ state, services, ...props }) {
	const { variant = VARIANTS.dark, temperature = 50, typingSpeed = 50, userId = 0, isSideBarOpen = true, maxwidth = 260, buttonText = "New Chat", logoutText = "Log Out", exportText = "Export to Text", threadIndex = 0, threads = [], threadListState, chatHistory = [], } = state || {}
	const { sideBarOpen = noop, newChat = noop, temperatureChange = noop, temperatureUpdate = noop, typingSpeedChange = noop, typingSpeedUpdate = noop, exportHandler = messages => handleExportButtonClick(messages), threadListServices, } = services || {}
	const threadID = threads[threadIndex]?.ThreadID
	const topButtonConfigs = [{
		state: { variant, text: buttonText, centered: false, maxheight: 44 },
		services: { onClick: () => newChat() },
		key: 'newChatButton'
	},
	{
		state: { variant, text: '', centered: true, maxwidth: 44, maxheight: 44, icon: <BsLayoutSidebar /> },
		services: { onClick: e => { e.stopPropagation(); sideBarOpen() } },
		className: !isSideBarOpen ? 'toggle-button' : '',
		key: 'toggleSideBarButton'
	}]
	const sliderConfigs = [{
		state: { title: "Temperature", value: temperature, },
		services: { onMouseUp: () => temperatureUpdate({ userId, threadID, temperature }), onChange: (_, temp) => temperatureChange(temp), },
	},
	{
		state: { title: "Typing Speed", value: typingSpeed, },
		services: { onMouseUp: () => typingSpeedUpdate({ userId, threadID, typingSpeed }), onChange: (_, typSpd) => typingSpeedChange(typSpd), },
	}]
	const bottomButtonConfigs = [{
		state: { variant, icon: <BiExport />, text: exportText, centered: false, maxheight: 44 },
		services: { onClick: () => exportHandler(chatHistory) },
		key: 'exportButton'
	},
	{
		state: { variant, icon: <MdLogout />, text: logoutText, centered: false, maxheight: 44 },
		services: { onClick: () => console.warn("Add logout feature") }, // Logout feature goes here
		key: 'logoutButton',
	}]
	return (
		<SideBarContainer $maxwidth={maxwidth} $isOpen={isSideBarOpen} {...props}>
			<section>
				<IconContainer>{topButtonConfigs.map(({ state, services, className, key }) => (<OutlineButton key={key} state={state} services={services} className={className} />))}</IconContainer>
				<ThreadList state={threadListState} services={threadListServices} />
			</section>
			<section>
				{sliderConfigs.map(({ state, services }, index) => (<CustomSlider key={state.title || index} state={state} services={services} />))}
				{bottomButtonConfigs.map(({ state, services, key }) => (<OutlineButton key={key} state={state} services={services} />))}
			</section>
		</SideBarContainer>
	)
}
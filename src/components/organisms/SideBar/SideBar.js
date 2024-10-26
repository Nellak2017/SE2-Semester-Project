import { SideBarContainer, IconContainer, SliderContainer, } from "./SideBar.elements"
import { BsLayoutSidebar } from 'react-icons/bs'
import { BiExport } from 'react-icons/bi'
import { MdLogout } from 'react-icons/md'
import OutlineButton from "../../atoms/OutlineButton/OutlineButton.js"
import ThreadList from "../../molecules/ThreadList/ThreadList"
import { handleExportButtonClick, noop } from "../../../utils/helpers.js"
import { VARIANTS } from '../../utils/constants.js'
import CustomSlider from "../../molecules/CustomSlider/CustomSlider.js"

export default function SideBar({ state, services, ...props }) {
	const {
		variant = VARIANTS.dark,
		temperature = 50,
		typingSpeed = 50,
		userId = 0,
		isSideBarOpen = true,
		maxwidth = 260,
		buttonText = "New Chat",
		logoutText = "Log Out",
		exportText = "Export to Text",
		threadIndex = 0,
		threads = [],
		threadListState,
	} = state || {}
	const { sideBarOpen = noop, newChat = noop, temperatureChange = noop, temperatureUpdate = noop, typingSpeedChange = noop, typingSpeedUpdate = noop, exportHandler = messages => handleExportButtonClick(messages), threadListServices, } = services || {}
	const threadID = threads[threadIndex]?.ThreadID
	const slidersConfig = [
		{
			state: { title: "Temperature", value: temperature, },
			services: { onMouseUp: () => temperatureUpdate({ userId, threadID, temperature }), onChange: (_, temp) => temperatureChange(temp), },
		},
		{
			state: { title: "Typing Speed", value: typingSpeed, },
			services: { onMouseUp: () => typingSpeedUpdate({ userId, threadID, typingSpeed }), onChange: (_, typSpd) => typingSpeedChange(typSpd), },
		},
	]
	return (
		<SideBarContainer $maxwidth={maxwidth} $isOpen={isSideBarOpen} {...props}>
			<section>
				<IconContainer>
					{/* TODO: Map through these buttons instead*/}
					<OutlineButton
						state={{ variant, text: buttonText, centered: false, maxheight: 44 }}
						services={{ onClick: () => newChat() }}
					/>
					<OutlineButton
						state={{ variant, text: '', centered: true, maxwidth: 44, maxheight: 44, icon: <BsLayoutSidebar />, }}
						services={{ onClick: e => { e.stopPropagation(); sideBarOpen() } }}
						className={!isSideBarOpen ? 'toggle-button' : ''}
					/>
				</IconContainer>
				<ThreadList state={threadListState} services={threadListServices} />
			</section>
			<section>
				{slidersConfig.map((slider, index) => (<CustomSlider key={slider.state.title || index} state={slider.state} services={slider.services} />))}
				{/* TODO: Map through the outline buttons*/}
				<OutlineButton
					state={{ variant, icon: <BiExport />, text: exportText, centered: false, maxheight: 44 }}
					services={{ onClick: () => exportHandler([{ author: 'dev', content: 'TODO: Add support for this' }]) }}
				// TODO: We need to use messages local variable with exportHandler for it to work
				/>
				<OutlineButton
					state={{ variant, icon: <MdLogout />, text: logoutText, centered: false, maxheight: 44 }}
				// services : TODO: Add logout feature
				/>
			</section>
		</SideBarContainer>
	)
}
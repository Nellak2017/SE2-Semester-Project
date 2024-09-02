/* eslint-disable max-lines-per-function */
import {
	SideBarContainer,
	IconContainer,
	SliderContainer,
} from "./SideBar.elements"
import { BsLayoutSidebar } from 'react-icons/bs'
import { BiExport } from 'react-icons/bi'
import { MdLogout } from 'react-icons/md'
import OutlineButton from "../../atoms/OutlineButton/OutlineButton.js"
import ThreadList from "../../molecules/ThreadList/ThreadList"
import Slider from '@mui/material/Slider'
import { handleExportButtonClick } from "../../../utils/helpers.js"
import { VARIANTS, SX_SLIDER, SLIDER_LENGTH } from '../../utils/constants.js'

// TODO: Add Event listeners
// TODO: Potentially add temperature sliders OR other thing like link to settings page

function SideBar({
	state,
	services,
	...props
}) {
	const {
		variant = VARIANTS.dark,
		threads = [],
		temperature = 50,
		typingSpeed = 50,
		threadIndex = 0,
		userId = 0,
		isSidebarOpen = true,
		threadListenerList = [() => { }], // TODO: Remove
		trashListenerList = [() => { }], // TODO: Remove
		maxwidth = 260,
		buttonText = "New Chat",
		logoutText = "Log Out",
		exportText = "Export to Text",
	} = state || {}
	const {
		sideBarOpen = () => { },
		newChat = () => { }, // TODO: In the thunk do this: highlightThread(threads, -1); setThreadIndex(0); setMessages([]); setIsNewChat(true);
		temperatureChange = () => { },
		temperatureUpdate = () => { },
		typingSpeedChange = () => { },
		typingSpeedUpdate = () => { },
		setThreadIndex = () => { },
		deleteThread = () => { },
		exportHandler = messages => handleExportButtonClick(messages)
	} = services || {}
	const handleNewChatClick = () => {
		newChat && newChat()
	}

	const threadListState = {
		variant,
		maxwidth,
		threads,
		threadListenerList,
		trashListenerList,
	}

	return (
		<SideBarContainer $maxwidth={maxwidth} $isOpen={isSidebarOpen} {...props}>
			<section>
				<IconContainer>
					<OutlineButton
						state={{ variant, text: buttonText, centered: false, maxheight: 44 }}
						services={{ onClick: handleNewChatClick }}
					/>
					<OutlineButton
						state={{
							variant,
							text: '',
							icon: <BsLayoutSidebar />,
							maxwidth: 44,
							maxheight: 44,
							centered: true,
						}}
						services={{ onClick: e => { e.stopPropagation(); sideBarOpen() } }}
						className={!isSidebarOpen ? 'toggle-button' : ''}
					/>
				</IconContainer>
				<ThreadList
					state={threadListState}
				/>
			</section>

			<section>
				<SliderContainer>
					<div>
						<h1>Temperature</h1>
						<Slider
							aria-label="Temperature"
							size="small"
							value={temperature}
							min={1}
							step={1}
							max={SLIDER_LENGTH}
							onMouseUp={() => temperatureUpdate({ userId, temperature })}
							onChange={(_, temperature) => temperatureChange(temperature)}
							sx={SX_SLIDER}
							defaultValue={temperature}
						/>
					</div>
				</SliderContainer>
				<SliderContainer>
					<div>
						<h1>Typing Speed</h1>
						<Slider
							aria-label="Typing Speed"
							size="small"
							value={typingSpeed}
							min={1}
							step={1}
							max={SLIDER_LENGTH}
							onMouseUp={() => typingSpeedUpdate({ userId, typingSpeed })}
							onChange={(_, typingSpeed) => typingSpeedChange(typingSpeed)}
							sx={SX_SLIDER}
							defaultValue={typingSpeed}
						/>
					</div>
				</SliderContainer>
				<OutlineButton
					state={{ variant, icon: <BiExport />, text: exportText, centered: false, maxheight: 44 }}
					services={{ onClick: exportHandler }}
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

export default SideBar
import { SideBarContainer, IconContainer, SliderContainer, } from "./SideBar.elements"
import { BsLayoutSidebar } from 'react-icons/bs'
import { BiExport } from 'react-icons/bi'
import { MdLogout } from 'react-icons/md'
import OutlineButton from "../../atoms/OutlineButton/OutlineButton.js"
import ThreadList from "../../molecules/ThreadList/ThreadList"
import Slider from '@mui/material/Slider'
import { handleExportButtonClick } from "../../../utils/helpers.js"
import { VARIANTS, SX_SLIDER, SLIDER_LENGTH } from '../../utils/constants.js'

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
	const { sideBarOpen = () => { }, newChat = () => { }, temperatureChange = () => { }, temperatureUpdate = () => { }, typingSpeedChange = () => { }, typingSpeedUpdate = () => { }, exportHandler = messages => handleExportButtonClick(messages), threadListServices, } = services || {}
	const threadID = threads[threadIndex]?.ThreadID
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
				{/* TODO: Don't repeat yourself with the SliderContainers, extract to a molecule then map through them */}
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
							onMouseUp={() => temperatureUpdate({ userId, threadID, temperature })}
							onChange={(_, temp) => temperatureChange(temp)}
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
							onMouseUp={() => typingSpeedUpdate({ userId, threadID, typingSpeed })}
							onChange={(_, typSpd) => typingSpeedChange(typSpd)}
							sx={SX_SLIDER}
							defaultValue={typingSpeed}
						/>
					</div>
				</SliderContainer>
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
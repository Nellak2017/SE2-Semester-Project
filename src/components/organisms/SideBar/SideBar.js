import { useState, useEffect } from "react"
import { VARIANTS, SX_SLIDER } from "../../utils/constants"
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

// TODO: Add Event listeners
// TODO: Potentially add temperature sliders OR other thing like link to settings page
function SideBar({
	state = {
		variant: VARIANTS.dark,
		threads: [],
		initialTemperature: 50,
		initialTypingSpeed: 50,
		threadListenerList: [() => { }],
		trashListenerList: [() => { }],
		maxwidth: 260,
		buttonText: "New Chat",
		logoutText: "Log Out",
		exportText: "Export to Text",
	},
	services = {
		onNewChatClick,
		onTemperatureChange,
		onTypingSpeedChange,
		onTemperatureMouseUp,
		onTypingSpeedMouseUp,
		exportHandler
	},
	...props
}) {
	const { variant, threads, initialTemperature, initialTypingSpeed,
		threadListenerList, trashListenerList,
		maxwidth, buttonText, logoutText, exportText
	} = state || {}
	const { onNewChatClick, onTemperatureChange, onTypingSpeedChange,
		onTemperatureMouseUp, onTypingSpeedMouseUp, exportHandler
	} = services || {}

	const sliderLength = 100 // percent of slider length
	const [temperaturePosition, setTemperaturePosition] = useState(initialTemperature)
	const [typingSpeedPosition, setTypingSpeedPosition] = useState(initialTypingSpeed)
	const [isSidebarOpen, setSidebarOpen] = useState(true)

	// This is to let the parent alter the state of the slider lightly, but still allow this component to mostly handle it
	// Without this, the component won't render intially properly in all cases
	useEffect(() => {
		setTemperaturePosition(initialTemperature)
		setTypingSpeedPosition(initialTypingSpeed)
	}, [initialTemperature, initialTypingSpeed])

	const handleNewChatClick = () => {
		onNewChatClick && onNewChatClick()
	}

	const handleTemperatureChange = (_, value) => {
		setTemperaturePosition(value)
		onTemperatureChange && onTemperatureChange(value)
	}

	const handleTypingSpeedChange = (_, value) => {
		setTypingSpeedPosition(value)
		onTypingSpeedChange && onTypingSpeedChange(value)
	}

	const handleTemperatureMouseUp = () => {
		onTemperatureMouseUp && onTemperatureMouseUp()
	}

	const handleTypingSpeedMouseUp = () => {
		onTypingSpeedMouseUp && onTypingSpeedMouseUp()
	}

	const handleToggleSidebar = () => setSidebarOpen(!isSidebarOpen)


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
						services={{onClick: e => {e.stopPropagation(); handleToggleSidebar()}}}
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
							value={temperaturePosition}
							min={1}
							step={1}
							max={sliderLength}
							onMouseUp={handleTemperatureMouseUp}
							onChange={handleTemperatureChange}
							sx={SX_SLIDER}
							defaultValue={initialTemperature}
						/>
					</div>
				</SliderContainer>
				<SliderContainer>
					<div>
						<h1>Typing Speed</h1>
						<Slider
							aria-label="Typing Speed"
							size="small"
							value={typingSpeedPosition}
							min={1}
							step={1}
							max={sliderLength}
							onMouseUp={handleTypingSpeedMouseUp}
							onChange={handleTypingSpeedChange}
							sx={SX_SLIDER}
							defaultValue={initialTypingSpeed}
						/>
					</div>
				</SliderContainer>
				<OutlineButton
					state={{ variant, icon: <BiExport />, text: exportText, centered: false, maxheight: 44 }}
					services={{ onClick: exportHandler }}
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
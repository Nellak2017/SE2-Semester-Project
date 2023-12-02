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
	variant = VARIANTS.dark,
	maxwidth = 260,
	buttonText = "New Chat",
	logoutText = "Log Out",
	exportText = "Export to Text",
	initialTemperature = 50,
	initialTypingSpeed = 50,
	color,
	threads,
	onNewChatClick, // Pass to Parent
	onTemperatureChange, // Pass to Parent
	onTypingSpeedChange, // Pass to Parent
	onTemperatureMouseUp, // Pass to Parent
	onTypingSpeedMouseUp, // Pass to Parent
	threadListenerList = [() => {}],  // Pass to Parent
	trashListenerList = [() => {}],   // Pass to Parent
	...props
}) {
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

	return (
		<SideBarContainer $maxwidth={maxwidth} $isOpen={isSidebarOpen} color={color} {...props}>
			<section>
				<IconContainer>
					<OutlineButton
						variant={variant}
						text={buttonText}
						maxheight={44}
						onClick={handleNewChatClick}
					/>
					<OutlineButton
						variant={variant}
						text={null}
						icon={<BsLayoutSidebar />}
						maxwidth={44}
						maxheight={44}
						centered={true}
						onClick={e => {
							e.stopPropagation()
							handleToggleSidebar()
						}}
						className={!isSidebarOpen ? 'toggle-button':''}
					/>
				</IconContainer>
				<ThreadList
					variant={variant}
					threads={threads}
					threadListenerList={threadListenerList}
					trashListenerList={trashListenerList}
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
					variant={variant}
					text={exportText}
					icon={<BiExport />}
				/>
				<OutlineButton
					variant={variant}
					text={logoutText}
					icon={<MdLogout />}
				/>
			</section>
		</SideBarContainer>
	)
}

export default SideBar
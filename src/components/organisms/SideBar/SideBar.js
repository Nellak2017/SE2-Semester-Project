import { useState } from "react"
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
	initialTemperature = 32,
	initialTypingSpeed = 32,
	color,
	threads,
	onTemperatureChange, // Pass to Parent
	onTypingSpeedChange, // Pass to Parent
}) {
	const sliderLength = 100 // percent of slider length
	const [temperaturePosition, setTemperaturePosition] = useState(initialTemperature)
	const [typingSpeedPosition, setTypingSpeedPosition] = useState(initialTypingSpeed)

	const handleTemperatureChange = (_, value) => {
		setTemperaturePosition(value)
		onTemperatureChange && onTemperatureChange(value)
	}

	const handleTypingSpeedChange = (_, value) => {
		setTypingSpeedPosition(value)
		onTypingSpeedChange && onTypingSpeedChange(value)
	}

	return (
		<SideBarContainer $maxwidth={maxwidth} color={color}>
			<section>
				<IconContainer>
					<OutlineButton
						variant={variant}
						text={buttonText}
					// add onClick
					/>
					<OutlineButton
						variant={variant}
						text={null}
						icon={<BsLayoutSidebar />}
						maxwidth={34}
					// add onClick
					/>
				</IconContainer>
				<ThreadList
					variant={variant}
					threads={threads}
				// Listeners should be handled as an implementation detail in ThreadList
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
							min={0}
							step={1}
							max={sliderLength}
							onChange={handleTemperatureChange}
							sx={SX_SLIDER}
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
							min={0}
							step={1}
							max={sliderLength}
							onChange={handleTypingSpeedChange}
							sx={SX_SLIDER}
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
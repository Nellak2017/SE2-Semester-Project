import { VARIANTS } from "../../utils/constants"
import {
	SideBarContainer,
	IconContainer
} from "./SideBar.elements"
import { BsLayoutSidebar } from 'react-icons/bs'
import OutlineButton from "../../atoms/OutlineButton/OutlineButton.js"
import ThreadList from "../../molecules/ThreadList/ThreadList"

// TODO: Add Event listeners
// TODO: Potentially add temperature sliders OR other thing like link to settings page
function SideBar({
	variant = VARIANTS.dark,
	color,
	maxwidth = 244,
	buttonText = "New Chat",
	threads
}) {
	return (
		<SideBarContainer $maxwidth={maxwidth} color={color}>
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
			<p className="last">TODO: temperature and other</p>
		</SideBarContainer>
	)
}

export default SideBar
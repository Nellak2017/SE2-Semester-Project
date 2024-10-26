import Slider from '@mui/material/Slider'
import { SliderContainer } from './CustomSlider.elements.js'
import { SLIDER_LENGTH, SX_SLIDER } from '../../utils/constants'

export const CustomSlider = ({ state, services }) => {
	const { title = '', value = 0, min = 1, max = SLIDER_LENGTH, step = 1, sx = SX_SLIDER } = state || {}
	const { onChange, onMouseUp } = services || {}
	return (
		<SliderContainer>
			<div>
				<h1>{title}</h1>
				<Slider aria-label={title} size="small" value={value} min={min} max={max} step={step} sx={sx} defaultValue={value} onMouseUp={onMouseUp} onChange={onChange} />
			</div>
		</SliderContainer>
	)
}
export default CustomSlider
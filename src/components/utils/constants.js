export const VARIANTS = { light: 'light', dark: 'dark' }
export const USERS = { user: 'user', gpt: 'gpt' }
export const SX_SLIDER = {
	//color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
	height: 4,
	'& .MuiSlider-thumb': {
		width: 8,
		height: 8,
		transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
		'&:before': {
			boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
		},
		'&.Mui-active': {
			width: 20,
			height: 20,
		},
	},
	'& .MuiSlider-rail': {
		opacity: 0.28,
	},
}
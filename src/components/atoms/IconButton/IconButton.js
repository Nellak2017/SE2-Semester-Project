import { IconButtonStyled } from './IconButton.elements'

export function IconButton({ children, ...rest }) {
	return (
		<IconButtonStyled {...rest}>
			{children}
		</IconButtonStyled>
	)
}

export default IconButton
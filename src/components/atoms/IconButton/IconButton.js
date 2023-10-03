import { IconButtonStyled } from './IconButton.elements'

function IconButton({ children, ...rest }) {
	return (
		<IconButtonStyled {...rest}>
			{children}
		</IconButtonStyled>
	)
}

export default IconButton
import { ButtonStyled } from './Button.elements.js'

export default function Button({ size = 's', variant = 'standardButton', children, ...rest }) {
	return (
		<ButtonStyled size={size} variant={variant} {...rest}>
			{children}
		</ButtonStyled>
	)
}
import { IconButtonStyled } from './IconButton.elements'
export const IconButton = ({ children, ...rest }) => (<IconButtonStyled {...rest}>{children}</IconButtonStyled>)
export default IconButton
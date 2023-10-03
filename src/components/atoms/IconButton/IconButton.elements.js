import styled from 'styled-components'
import { space, layout, typography } from 'styled-system'
import { getPresetCSS, iconButtonPreSets } from '../../../styles/theme.js'

// NOTE: Responsive Size is in beta, use at your own risk
// Note: make sure the icons are of sizes -> [12px, 14px, 16px, 24px, 40px, 64px]
export const IconButtonStyled = styled.button`
    outline-style: solid;
    // Styles to make it a perfect circle, no matter what the child is
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    
    // Size defaults to xl if none is provided
    height: ${props => props.theme.fontSizes.larger};
    width: ${props => props.theme.fontSizes.larger};
    padding: 8px;
    font-size: ${props => props.theme.fontSizes.large};
    & > svg {
      height: 100%;
      width: 100%;
    }

    &:hover {
        box-shadow: ${props => props.theme.elevations.small};
      }
    &:active {
        box-shadow: ${props => props.theme.insets.normal};
    }
    ${space} 
    ${layout}
    ${typography}
    ${getPresetCSS(iconButtonPreSets, 'variant')}
    ${getPresetCSS(iconButtonPreSets, 'color')}
    ${getPresetCSS(iconButtonPreSets, 'outlineSize')}
    ${getPresetCSS(iconButtonPreSets, 'outlineColor')}
    ${getPresetCSS(iconButtonPreSets, 'background')} 
    ${getPresetCSS(iconButtonPreSets, 'size')} 
`

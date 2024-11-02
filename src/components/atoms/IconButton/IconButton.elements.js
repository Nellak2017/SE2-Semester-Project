import styled, { css } from 'styled-components'
import { getPresetCSS } from '../../../styles/theme.js'

const iconSizePreset = {
  xs: css`
    height: ${props => props.theme.fontSizes.smaller};
    width: ${props => props.theme.fontSizes.smaller};
    padding: 1px;
    font-size: ${props => props.theme.fontSizes.extraSmall};
  `,
  s: css`
    height: ${props => props.theme.fontSizes.small};
    width: ${props => props.theme.fontSizes.small};
    padding: 2px;
    font-size: ${props => props.theme.fontSizes.smaller};
  `,
  m: css`
    height: ${props => props.theme.fontSizes.medium};
    width: ${props => props.theme.fontSizes.medium};
    padding: 2px;
    font-size: ${props => props.theme.fontSizes.small};
  `,
  l: css`
    height: ${props => props.theme.fontSizes.large};
    width: ${props => props.theme.fontSizes.large};
    padding: 4px;
    font-size: ${props => props.theme.fontSizes.medium};
  `,
  xl: css`
    height: ${props => props.theme.fontSizes.larger};
    width: ${props => props.theme.fontSizes.larger};
    padding: 8px;
    font-size: ${props => props.theme.fontSizes.large};
  `,
  xxl: css`
    height: ${props => props.theme.fontSizes.extraLarge};
    width: ${props => props.theme.fontSizes.extraLarge};
    padding: 10px;
    font-size: ${props => props.theme.fontSizes.larger};
  `,
}
const iconButtonPreSets = {
  variant: {
    icon: css`
      color: ${props => props.theme.colors.primary};
      background-color: ${props => props.theme.colors.primary}00;
      &:hover { background-color: ${props => props.theme.colors.primaryHover}20; }
      &:active { background-color: ${props => props.theme.colors.primaryActive}20; }
      outline-width: 0;
      height: ${props => props.theme.fontSizes.larger};
      width: ${props => props.theme.fontSizes.larger};
      padding: 8px;
      font-size: ${props => props.theme.fontSizes.large};
    `
  },
  size: iconSizePreset,
}
export const IconButtonStyled = styled.button`
    outline-style: solid;
    border-radius: 50%; // Styles to make it a perfect circle, no matter what the child is
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    height: ${props => props.theme.fontSizes.larger}; // Size defaults to xl if none is provided
    width: ${props => props.theme.fontSizes.larger};
    padding: 8px;
    font-size: ${props => props.theme.fontSizes.large};
    & > svg {
      height: 100%;
      width: 100%;
    }
    &:hover { box-shadow: ${props => props.theme.elevations.small}; }
    &:active { box-shadow: ${props => props.theme.insets.normal}; }
    ${getPresetCSS(iconButtonPreSets, 'variant')}
    ${getPresetCSS(iconButtonPreSets, 'size')} 
`
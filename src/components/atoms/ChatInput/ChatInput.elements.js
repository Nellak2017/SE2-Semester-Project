import styled, { css } from 'styled-components'
import { getPresetCSS } from '../../../styles/theme.js'
import TextareaAutosize from 'react-textarea-autosize' // imported to save headache in getting resizable input

const chatInputPresets = {
    variant: {
        small: css`
        & textarea { padding: 0; }
        & button {
          height: ${props => props.theme.fontSizes.large};
          width: ${props => props.theme.fontSizes.large};
          padding: 4px;
          font-size: ${props => props.theme.fontSizes.medium};
        }
      `,
        default: css` padding: .5rem ${props => props.theme.fontSizes.smaller}; `
    },
}
export const ChatInputParent = styled.div`// This should be a div with div children. The first child should have role='textbox'
    padding: 0 ${props => props.theme.fontSizes.smaller}; 
    outline: none;
    display: inline-flex; 
    flex-direction: row; 
    justify-content: flex-start;
    align-items: flex-end;
    column-gap: .5rem;
    max-width: 766px;
    width: 100%;
    cursor: text; // This is for accessibility. If user clicks parent div, chatInput child is focused
    border-radius: ${props => props.theme.spaces.medium};
    color: ${props => props.theme.colors.lightNeutralLight};
    background-color: ${props => props.theme.colors.lightNeutral};
    &:hover { background-color: ${props => props.theme.colors.lightNeutralHover}; }
    &:active { background-color: ${props => props.theme.colors.lightNeutralActive}; }
    ${getPresetCSS(chatInputPresets, 'variant')}
`
export const ChatInputChild = styled(TextareaAutosize)`// This is the actual input element that is made from TextareaAutosize component downloaded from npm
    padding: .5rem 0; // This is here so that no matter where a user presses it will focus
    line-height: 1.375rem;
    min-height: 1.375rem;
    max-height: 8.5rem; // max height is 6 lines, addressed here
    width: 100%;
    resize: none;
    align-self: center; // if you have xl sized icon buttons, then it looks weird
    outline: none;
    background-color: transparent;
    border: none;
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: break-spaces;
    text-align: left;
    user-select: text;
    scroll-behavior: auto;
    cursor: text; // This is for accessibility.
    color: ${props => props.theme.colors.lightNeutralLight};
    caret-color: ${props => props.theme.colors.lightNeutralLight};
    font-size: ${props => props.theme.fontSizes.medium};
`
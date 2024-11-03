import { FaRegUserCircle, FaInstalod } from "react-icons/fa"
export const VARIANTS = { light: 'light', dark: 'dark' }
export const USERS = { user: 'user', model: 'model' }
export const SX_SLIDER = { height: 4, '& .MuiSlider-thumb': { width: 8, height: 8, transition: '0.3s cubic-bezier(.47,1.64,.41,.8)', '&:before': { boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)', }, '&.Mui-active': { width: 20, height: 20, }, }, '& .MuiSlider-rail': { opacity: 0.28, }, }
export const USER_LOGOS = { 'user': <FaRegUserCircle />, 'model': <FaInstalod />, }
export const SLIDER_LENGTH = 100
export const DEFAULTS = { variant: VARIANTS['dark'], temperature: 50, typingSpeed: 50, userId: 1, isSideBarOpen: true, threadIndex: 0, threads: [], chatHistory: [], userInput: '', isNewChat: false, }
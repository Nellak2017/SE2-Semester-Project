const elevations = [
  '0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)',
  '0px 1px 8px 0px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 3px 3px -2px rgba(0, 0, 0, 0.12)',
  '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)',
  '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
  '0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12)']
elevations.extraSmall = elevations[0] // 1dp : elements closest to application background, like cards
elevations.small = elevations[1] // 3dp : tooltips, banners, elevated buttons, FAB
elevations.medium = elevations[2] // 6dp : contextual overlays for components, Menu, Dropdown, Nav bar
elevations.large = elevations[3] // 8dp : element that rise above most, like dialouges, time picker, search bar
elevations.extraLarge = elevations[4] // 12dp : elements highest in stacking order, like notifications

const insets = ['1px 1px 5px rgba(1, 1, 0, 0.7) inset']
insets.normal = insets[0] // completely guessed

// see also: https://zaat.dev/blog/building-a-design-system-in-react-with-styled-components/
const fontSizes = ['10px', '12px', '14px', '16px', '24px', '40px', '64px']
fontSizes.extraSmall = fontSizes[0]
fontSizes.smaller = fontSizes[1]
fontSizes.small = fontSizes[2]
fontSizes.medium = fontSizes[3]
fontSizes.large = fontSizes[4]
fontSizes.larger = fontSizes[5]
fontSizes.extraLarge = fontSizes[6]

const breakpoints = ['320px', '425px', '768px', '1024px', '1440px']
breakpoints.xs = breakpoints[0] // small phones, portrait (320x653)
breakpoints.sm = breakpoints[1] // large phones, portrait (425x915)
breakpoints.md = breakpoints[2] // ipads, landscape (768x1180)
breakpoints.lg = breakpoints[3] // laptops (1366x768)
breakpoints.xl = breakpoints[4] // desktops (2560x1440)

const spaces = ['4px', '8px', '16px', '32px', '48px', '56px']
spaces.smaller = spaces[0]
spaces.small = spaces[1]
spaces.medium = spaces[2]
spaces.large = spaces[3]
spaces.larger = spaces[4]
spaces.extraLarge = spaces[5]

export const getPresetCSS = (preSets, preSetProp) => props => preSets[preSetProp][props[preSetProp]]

const theme = {
  colors: {
    primaryLight: '#f1ecfd',
    primaryLightHover: '#e2d9fc',
    primaryLightActive: '#b7a1f7',
    primary: '#815af1',
    primaryHover: '#6031ed',
    primaryActive: '#4112ce',
    primaryDark: '#2f0d96',
    primaryDarkHover: '#1e085e',
    primaryDarkActive: '#120538',
    primaryDarker: '#060213',
    darkNeutralLight: '#ebeaeb',
    darkNeutralLightHover: '#e1e0e1',
    darkNeutralLightActive: '#c2bfc2',
    darkNeutral: '#39313a',
    darkNeutralHover: '#332c34',
    darkNeutralActive: '#2e272e',
    darkNeutralDark: '#2b252c',
    darkNeutralDarkHover: '#221d23',
    darkNeutralDarkActive: '#1a161a',
    darkNeutralDarker: '#141114',
    lightNeutralLight: '#eeedee',
    lightNeutralLightHover: '#e5e3e5',
    lightNeutralLightActive: '#c9c6c9',
    lightNeutral: '#504651',
    lightNeutralHover: '#483f49',
    lightNeutralActive: '#403841',
    lightNeutralDark: '#3c353d',
    lightNeutralDarkHover: '#302a31',
    lightNeutralDarkActive: '#241f24',
    lightNeutralDarker: '#1c191c',
    dangerLight: '#fbecec',
    dangerLightHover: '#f9becec',
    dangerLightActive: '#f2c5c5',
    danger: '#d64444',
    dangerHover: '#c13d3d',
    dangerActive: '#ab3636',
    dangerDark: '#a13333',
    dangerDarkHover: '#802929',
    dangerDarkActive: '#601f1f',
    dangerDarker: '#4b1818',
    successLight: '#f2fcf1',
    successLightHover: '#ecfaea',
    successLightActive: '#d8f5d3',
    success: '#80de71',
    successHover: '#73c866',
    successActive: '#66b25a',
    successDark: '#60a755',
    successDarkHover: '#4d8544',
    successDarkActive: '#3a6433',
    successDarker: '#2d4e28',
    warningLight: '#fdf8f2',
    warningLightHover: '#fcf5eb',
    warningLightActive: '#f8ead5',
    warning: '#e8bb79',
    warningHover: '#d1a86d',
    warningActive: '#ba9661',
    warningDark: '#ae8c5b',
    warningDarkHover: '#8b7049',
    warningDarkActive: '#685436',
    warningDarker: '#51412a',
    body: '#39313a',
    defaultFontColor: '#f4f0ff'
  },
  fontSizes,
  breakpoints,
  spaces,
  elevations,
  insets
}
export default theme
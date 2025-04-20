// Material UI
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles'
import {Box} from '@mui/material'
import { useMediaQuery } from '@mui/material'

// https://mui.com/material-ui/customization/theming/
// https://mui.com/material-ui/customization/breakpoints/#custom-breakpoints

const customTheme = createTheme({
	breakpoints: {
		values: {
			mobile: 0,
			tablet: 900,
			laptop: 1200,
			desktop: 1500,
		},
	},
	palette: {
		background: {
			default: "#F6F4F1",
		},
		primary: {
			main: '#3f51b5',
		},
		secondary: {
			main: '#f50057',
		},
	},
	typography: {
		fontFamily: 'Rubik, sans-serif',
	},
	components: {
		MuiTableCell: {
			styleOverrides: {
				root: {
					borderBottom: '1px solid #F2F3F5'
				}
			}
		},
		MuiTab: {
			styleOverrides: {
				root: {
					"&.Mui-selected": {
						color: '#D3C6AB'
					},
				},
			}
		},
		MuiTabs: {
			styleOverrides: {
				indicator: {
					backgroundColor: '#D3C6AB'
				}
			}
		}
	}
})

const BreakpointGuide = () => {

	const theme = useTheme()

	const isMobile = useMediaQuery(theme.breakpoints.only('mobile'))
	const isTablet = useMediaQuery(theme.breakpoints.only('tablet'))
	const isLaptop = useMediaQuery(theme.breakpoints.only('laptop'))
	const isDesktop = useMediaQuery(theme.breakpoints.only('desktop'))

	return (
		<Box display="flex" justifyContent="flex-end" sx={{backgroundColor: "red", paddingRight: "10px", zIndex: "25000", position: "absolute", right: 0, top: 0}}>
			Guides on: 
			{isMobile === true && " Mobile"}
			{isTablet === true && " Tablet"}
			{isLaptop === true && " Laptop"}
			{isDesktop === true && " Desktop"}
		</Box>
	)
}

const CustomThemeProvider = ({children, guides}) => {
	
	return (
		<ThemeProvider theme={customTheme}>
			{guides && <BreakpointGuide /> }
			{children}
		</ThemeProvider>
	)
}
export default CustomThemeProvider
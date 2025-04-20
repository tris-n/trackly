// Material UI
import { useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'



const useBreakpoints = () => {
	
	const theme = useTheme()

	
	const isMobile = useMediaQuery(theme.breakpoints.only('mobile'))
	const isTablet = useMediaQuery(theme.breakpoints.only('tablet'))
	const isLaptop = useMediaQuery(theme.breakpoints.only('laptop'))
	const isDesktop = useMediaQuery(theme.breakpoints.only('desktop'))

	return {isMobile, isTablet, isLaptop, isDesktop}
}

export default useBreakpoints
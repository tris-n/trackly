// react
import { useEffect, useState } from "react"
import {useNavigate} from 'react-router-dom'

// Material UI
import {Box, Card, CardActionArea, Stack} from '@mui/material'
import { styled } from '@mui/material/styles'

// Components
import Spinner from '../../components/Spinner'

// Apex Charts
import Chart from "react-apexcharts"

// Custom Styles
const ComponentBox = styled(Card)({
	borderRadius: "20px", 
	backgroundColor: "#FFFFF !important", 
	boxShadow: "3px 3px 15px rgba(0,0,0,0.1)",
	cursor: "pointer",
	transition: "all 0.3s ease",
	'&:hover': {
		boxShadow: "2px 4px 6px rgba(0,0,0,0.0)",
	},
})



const DueDatesWheel = ({tickets}) => {

	const [overdueTickets, setOverdueTickets] = useState(0)
	const [onscheduleTickets, setOnscheduleTickets] = useState(null)
	const [chartSeries, setChartSeries] = useState([])

	const navigate = useNavigate()

	const handleComponentClick = (e) => {
		navigate(`/projects/`)
	}

	useEffect(() => {

		setOverdueTickets(tickets.filter((ticket) => ticket.overDue).length)
		setOnscheduleTickets(tickets.length - overdueTickets)
		setChartSeries([overdueTickets, onscheduleTickets])

	}, [tickets])

	const [chartOptions, setChartOptions] = useState({
		labels: ['Overdue', 'On Schedule'],
		legend: {position: "bottom"},
		plotOptions: {
			pie: {
				donut: {
					labels: {
						show: true,
						total: {
							show: true,
							showAlways: true,
							label: "Progress"
						}
					}
				}
			}
		},
		dataLabels: {
			formatter: function (value, {seriesIndex, dataPointIndex, w}) {
				return w?.config?.series?.[seriesIndex]
			}
		},
		theme: {
			palette: "palette4"
		},
		tooltip: {
			style: {
				color: "#FFFFFF"
			},
			y: {
				formatter: function (value, {series, seriesIndex, dataPointIndex, w}) {
					return `${Math.round(value / tickets.length * 100)}%`
				}
			}
		},
	})




	if (!tickets || !chartOptions || !chartSeries.length) {
		return <Spinner />
	}



	return (
		<ComponentBox onClick={handleComponentClick}>
			<CardActionArea>

			{/* Display the total number of projects */}
			<Box display="flex" justifyContent="center" alignItems="center" sx={{height: "260px"}}>
				<Stack alignItems="center">
						<Chart 
							options={chartOptions}
							series={chartSeries}
							type="donut"
							width="300px"
						/>

				</Stack>
			</Box>

			</CardActionArea>
		</ComponentBox>
	)
}
export default DueDatesWheel
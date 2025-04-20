// react
import { useEffect, useState } from "react"
import {useNavigate} from 'react-router-dom'

// Material UI
import {CardActionArea, Stack, Typography} from '@mui/material'

// Components
import Spinner from '../../components/Spinner'

// Apex Charts
import Chart from "react-apexcharts"

// Components
import ComponentBox from "../../components/ComponentBox"



const TicketStatus = ({tickets}) => {
	
	useEffect(() => {
		
		let toDoStatus = tickets.filter((ticket) => ticket.status === "To Do").length
		let inProgressStatus = tickets.filter((ticket) => ticket.status === "In Progress").length
		let inReviewStatus = tickets.filter((ticket) => ticket.status === "In Review").length
		let doneStatus = tickets.filter((ticket) => ticket.status === "Done").length
		
		setChartSeries([toDoStatus, inProgressStatus, inReviewStatus, doneStatus])
		
	}, [tickets])
	
	const [chartSeries, setChartSeries] = useState([])
	
	const [chartOptions, setChartOptions] = useState({
		labels: ['To Do', 'In Progress', 'In Review', 'Done'],
		legend: {position: "bottom"},
		plotOptions: {
			pie: {
				donut: {
					labels: {
						show: true,
						total: {
							show: false,
							showAlways: false,
							label: "Total",
						}
					}
				}
			}
		},
		chart: {
			animations: {
				enabled: false // Disable animation
			},
		},
		// displays as count
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

	const navigate = useNavigate()

	const handleComponentClick = (e) => {
		navigate(`/tickets/`)
	}

	if (!tickets || !chartOptions || !chartSeries.length) {
		return <Spinner />
	}



	return (
		<ComponentBox onClick={handleComponentClick}>
			<CardActionArea>

				<Stack alignItems="center" sx={{paddingTop: "20px"}}>

					<Chart 
						options={chartOptions}
						series={chartSeries}
						type="donut"
					/>

					<Typography sx={{paddingTop: "10px", paddingBottom: "20px"}}>Ticket Status</Typography>

				</Stack>

			</CardActionArea>
		</ComponentBox>
	)
}
export default TicketStatus
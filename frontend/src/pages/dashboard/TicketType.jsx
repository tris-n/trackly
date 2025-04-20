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



const TicketType = ({tickets}) => {

	useEffect(() => {
		
		let bugType = tickets.filter((ticket) => ticket.type === "Bug").length
		let improvementType = tickets.filter((ticket) => ticket.type === "Improvement").length
		let taskType = tickets.filter((ticket) => ticket.type === "Task").length
		let featureType = tickets.filter((ticket) => ticket.type === "Feature").length
		
		setChartSeries([bugType, improvementType, taskType, featureType])
		
	}, [tickets])

	const [chartSeries, setChartSeries] = useState([])

	const [chartOptions, setChartOptions] = useState({
		labels: ['Bug', 'Improvement', 'Task', 'Feature'],
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

					<Typography sx={{paddingTop: "10px", paddingBottom: "20px"}}>Ticket Type</Typography>

				</Stack>

			</CardActionArea>
		</ComponentBox>
	)
}
export default TicketType
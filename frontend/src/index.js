// React
import React from 'react';
import { createRoot } from 'react-dom/client'

// Helmet Meta Tags
import { HelmetProvider } from 'react-helmet-async'

// Custom MUI Theme
import CustomThemeProvider from './theme/CustomThemeProvider'

// Redux
import { Provider } from 'react-redux'
import { store } from './features/store'

import App from './App';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
	<React.StrictMode>
		<HelmetProvider>
			<CustomThemeProvider guides={false}>
				<Provider store={store}>
					<App />
				</Provider>
			</CustomThemeProvider>
		</HelmetProvider>
	</React.StrictMode>
)
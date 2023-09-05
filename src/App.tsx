import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Home } from 'pages/Home'
import { Provider } from 'react-redux'
import { store } from './store/store'

const App: React.FC = () =>
  <Provider store={store}>
    <Router>
        <Route path="/" component={Home} />
    </Router>
  </Provider>

export default App

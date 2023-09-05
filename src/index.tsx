import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App'
import * as serviceWorker from './serviceWorker'

const domNode = document.getElementById('root') as HTMLElement
const root = createRoot(domNode)
root.render(<App />)

serviceWorker.unregister()

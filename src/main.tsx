import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import AlphabetList from "./lib/alphabet/AlphabetList";

ReactDOM.render(
  <React.StrictMode>
    <AlphabetList data={[]} />
  </React.StrictMode>,
  document.getElementById('root')
)

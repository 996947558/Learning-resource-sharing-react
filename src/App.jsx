import React from 'react';
import './App.css';
import Header from './components/Header/Header'
import {useRoutes} from 'react-router-dom'
import routes from './routes'


export default function App() {
  const element = useRoutes(routes)
  return (
    <>
		<Header />
    {element}
    </>
  )
}

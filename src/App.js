import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/style.css'
import MainPage from './components/MainPage'
import SearchPage from './components/SearchPage'
import SearchTool from './components/search-tool-features/SearchTool'

function App() {
    return (
        <BrowserRouter>
            <main>
                <SearchTool/>
                <Routes>
                    <Route exact path="/" element={<MainPage/>}/>
                    <Route exact path="/search" element={<SearchPage/>}/>
                </Routes>
            </main>
        </BrowserRouter>
    )
}

export default App

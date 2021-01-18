import React from 'react';
import './App.css';
import SysMonUI from "./components/adapters/sysmon";

function App() {
    return (
        <div className="App">
            <SysMonUI fetch_url={"http://192.168.1.126:7653"}/>
            <SysMonUI fetch_url={"http://192.168.1.202:7653"}/>
        </div>
    );
}

export default App;
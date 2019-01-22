import React, { Component } from "react";
import "./App.scss";
import Activity from "./Activity/Activity";

class App extends Component {
    render() {
        return (
            <div className="">
                <header className="header">
                    <h1>Split It</h1>
                </header>
                <Activity />
            </div>
        );
    }
}

export default App;

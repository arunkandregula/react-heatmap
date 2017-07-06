import React from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import HeatMapDemo from '../HeatMapDemo/HeatMapDemo';
import './App.sass';
window.$ = window.jQuery = require("jquery");

let datasets = ["data1.tsv", "data2.tsv"];
const Demo = () => <HeatMapDemo /> ;

class App extends React.Component{
	render(){
		return (
			<Router > 
				<div className="app">
					<Route exact path="/" component={Demo} ></Route>
				</div>	
			</Router>
		);
	}
}

export default App;
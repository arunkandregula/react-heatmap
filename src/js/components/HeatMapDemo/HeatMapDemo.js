import React from 'react';
import HeatMap from '../HeatMap/HeatMap';
import './HeatMapDemo.sass';
import {$,jquery} from 'jquery';
let d3 = require('d3');

const colLabels = ["1a long long names", "2a", "3a", "4a", "5a", "6a", "7a  long long nameslong long names", "8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12a"];
const rowLabels = ["Monday", "Tuesday Tuesday Tuesday ", "We", "Thursday", "Fri ", "Sa", "Su", "Again Somvar the Monday........"];

export default class HeatMapDemo extends React.Component{
	constructor(){
		super();
		this.state = {
			data: []
		}
	}
	getData(val){
		return new Promise((resolve, reject)=>{
			let tsvFile = `../../../../data/data${val}.tsv`;
	        d3.tsv(tsvFile,
		        function(d) {
		          return {
		            row: +d.day,
		            col: +d.hour,
		            value: +d.value
		          };
		        },
		        function(error, data) {
					resolve(data);
		        }
		    );
		});
	}
	async retrieveData(val){
		let data = await this.getData(val);
		console.log(data);
		this.setState({
			data: data
		});
	}
	showHeatMap(val){
		this.retrieveData(val);
	}
	render(){

		return <div className="heatmapDemo">
			<div className="actions">
				<button onClick={this.showHeatMap.bind(this, 1)} >Dataset data/1.tsv</button>
				<button onClick={this.showHeatMap.bind(this, 2)} >Dataset data/2.tsv</button>
			</div>
			<div className="hmArea">
				<HeatMap data={this.state.data} colLabels={colLabels} rowLabels={rowLabels} />
			</div>
		</div>;
	}
}

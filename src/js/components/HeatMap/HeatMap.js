import React from 'react';
let d3 = require('d3');
import './HeatMap.sass';
class HeatMap extends React.Component{
	init(){
        let svgOptions = {
            colLabels: this.props.colLabels,
            rowLabels: this.props.rowLabels,

            margin : {
                top: 20,
                bottom: 85,
                left: 20,
                right: 20,
                topMidMargin: 20,
                leftMidMargin: 20,
                legendTop: 20,
                legendMid: 5,
                legendBottom: 20
            },
            rowLabelWidth: 50, // default value
            colLabelHeight: 50, // default value
        };
        debugger;
        this.createSvg(svgOptions);
        debugger;
	    svgOptions.data = this.props.data;
        this.createHeatMap(svgOptions);
        this.createRowLabels(svgOptions);
        this.createColumnLabels(svgOptions);
        this.createLegend(svgOptions);
        this.resizeSvg(svgOptions);   
	
	}
	removeOldSvgElement(){
		d3.select("svg.mainSvg")
			.remove();
	}
    createSvg(svgOptions){
    	this.removeOldSvgElement();
        let minGridSize = 40;
        // default size of svg
        svgOptions.width = document.querySelector('.heatmap').clientWidth;
        svgOptions.height = document.querySelector('.heatmap').clientHeight;
        // default size of heatmap
        svgOptions.availableWidthOfHM = svgOptions.width - svgOptions.margin.left - svgOptions.margin.right - svgOptions.rowLabelWidth ;
        svgOptions.availableHeightOfHM = svgOptions.height - svgOptions.margin.top - svgOptions.margin.bottom - svgOptions.colLabelHeight;
        svgOptions.eachBoxHeight = svgOptions.availableHeightOfHM / svgOptions.rowLabels.length;
        svgOptions.eachBoxWidth = svgOptions.availableWidthOfHM / svgOptions.colLabels.length;
        if(svgOptions.eachBoxHeight < minGridSize || svgOptions.eachBoxWidth < minGridSize) {
            svgOptions.eachBoxHeight = minGridSize;
            svgOptions.eachBoxWidth = minGridSize;
        }
        svgOptions.svg = d3.select(".heatmap")
                            .append("svg")
                            .attr("class","mainSvg")
                            .attr("width", svgOptions.width)
                            .attr("height", svgOptions.height);
        svgOptions.svgGroup = svgOptions.svg.append("g").attr("class","svgGroup");
        svgOptions.rowLabelsGroup = svgOptions.svg.append("g").attr("class","rowLabelsGroup");
        svgOptions.colLabelsGroup = svgOptions.svg.append("g").attr("class","colLabelsGroup");
        svgOptions.legendGroup = svgOptions.svg.append("g").attr("class","legendGroup");


        svgOptions.colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"];

        svgOptions.legendElementWidth = minGridSize*2;                                    
    }	
        
    createHeatMap(svgOptions){
        let buckets = 9;
        debugger;
        svgOptions.colorScale = d3.scaleQuantile()
                                    .domain([0, buckets - 1, d3.max(svgOptions.data, function (d) { return d.value; })])
                                    .range(svgOptions.colors);        

        svgOptions.svgGroup
            .selectAll("rect.cell")
            .data(svgOptions.data)            
            .enter()
            .append("rect")
            .attr("class","cell")
            .attr("x", function(d){
                return (d.col - 1) * svgOptions.eachBoxWidth;
            })
            .attr("y", function(d){
                return (d.row - 1) * svgOptions.eachBoxHeight;
            })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", svgOptions.eachBoxWidth)
            .attr("height", svgOptions.eachBoxHeight)            
            .attr("fill", (d)=>{
                return svgOptions.colorScale(d.value);
            });
        debugger;
        svgOptions.numRows = svgOptions.svgGroup._groups[0][0].getBoundingClientRect().height/svgOptions.eachBoxHeight;    
        
        this.adjustHeatMapPosition(svgOptions);
    }
    getHMTopOffset(svgOptions){
        return svgOptions.margin.top + svgOptions.colLabelHeight + svgOptions.margin.topMidMargin;
    }
    getHMLeftOffset(svgOptions){
        return svgOptions.margin.left + svgOptions.rowLabelWidth + svgOptions.margin.leftMidMargin;
    }    
    adjustHeatMapPosition(svgOptions){
        let heatMapLeftOffset = this.getHMLeftOffset(svgOptions);
        let heatMapTopOffset = this.getHMTopOffset(svgOptions);
        svgOptions.svgGroup.attr("transform",`translate(${heatMapLeftOffset},${heatMapTopOffset})`)                    
    }
    adjustColLabelGroupPosition(svgOptions){
        let leftOffset = svgOptions.margin.left + svgOptions.rowLabelWidth + svgOptions.margin.leftMidMargin;
        let topOffset = svgOptions.margin.top + svgOptions.colLabelHeight; 
        svgOptions.colLabelsGroup.attr("transform",`translate(${leftOffset},${topOffset})`);               
    }
    adjustRowLabelGroupPosition(svgOptions){
        let leftOffset = svgOptions.margin.left;
        let topOffset = svgOptions.margin.top + svgOptions.colLabelHeight + svgOptions.margin.topMidMargin;
        svgOptions.rowLabelsGroup.attr("transform",`translate(${leftOffset},${topOffset})`)                    
    }
    adjustLegendPosition(svgOptions){
        debugger;
        let leftOffset = svgOptions.margin.left;
        let topOffset = svgOptions.margin.top + svgOptions.colLabelHeight + svgOptions.margin.topMidMargin ;
        let heatMapHeight = svgOptions.svgGroup._groups[0][0].getBoundingClientRect().height;
        topOffset += heatMapHeight + svgOptions.margin.legendTop;
        svgOptions.legendGroup.attr("transform",`translate(${leftOffset},${topOffset})`)                    
    }
    createRowLabels(svgOptions){
        svgOptions.rowLabelsGroup
            .append("g")
            .attr("class","labels-left")
            .selectAll("text")
            .data(svgOptions.rowLabels.slice(0, svgOptions.numRows))
            .enter()
            .append("text")
            .text((d)=>{
                return d;
            })
            .attr("x", 0)
            .attr("y", (d,i)=>{
                return i*svgOptions.eachBoxHeight + svgOptions.eachBoxHeight / 2;
            })
            .attr("dy", ".35em")
            .each(function(d){
                svgOptions.rowLabelWidth = Math.max(svgOptions.rowLabelWidth, this.getBBox().width);
            });
        this.adjustRowLabelGroupPosition(svgOptions);
        this.adjustHeatMapPosition(svgOptions);
    }
    createColumnLabels(svgOptions){
        svgOptions.colLabelsGroup
            .append("g")
            .attr("class","labels-top")
            .selectAll("text")
            .data(svgOptions.colLabels)
            .enter()
            .append("text")
            .text((d)=>{
                return d;
            })
            .attr("x", function(d, i ){
                return i*svgOptions.eachBoxWidth + svgOptions.eachBoxWidth/2;
            })
            .attr("y", function(d, i ){
                return 0; 
            })
            .attr("transform", function(d, i){
                let xPos = i*svgOptions.eachBoxWidth + svgOptions.eachBoxWidth/2;
                let yPos = 0;
                return `rotate(-45,${xPos},${yPos})`;
            })
            .each(function(d, i){
                svgOptions.colLabelHeight = Math.max(svgOptions.colLabelHeight, this.getBBox().width);
            });

        // reducing the height as it is diagonal height
        svgOptions.colLabelHeight *= 0.75;

        this.adjustColLabelGroupPosition(svgOptions);
        this.adjustRowLabelGroupPosition(svgOptions);
        this.adjustHeatMapPosition(svgOptions);

    }
    createLegend(svgOptions){
        svgOptions.legendGroup.selectAll('rect')
            .data(svgOptions.colors)
            .enter()
            .append("rect")
            .attr("width", svgOptions.legendElementWidth)
            .attr("height", svgOptions.eachBoxHeight/2)
            .attr("x", function(d, i){
                return i*svgOptions.legendElementWidth;
            })
            .attr("y", 0)
            .attr("fill", function(d){
                return d;
            });

        let quantilesRange = [0].concat(svgOptions.colorScale.quantiles());
        svgOptions.legendGroup.selectAll("text")            
            .data(quantilesRange)
            .enter()
            .append("text")
            .attr("class", "mono")
            .text(function(d){
                return "≥ " + Math.round(d);
            })
            .attr("x", function(d, i){
                return i*svgOptions.legendElementWidth + svgOptions.legendElementWidth/2;
            })
            .attr("text-anchor","middle")
            .attr("y", svgOptions.eachBoxHeight/2 + svgOptions.margin.legendMid + svgOptions.margin.legendBottom);

        this.adjustLegendPosition(svgOptions);    

    }
    resizeSvg(svgOptions){
        let heatMapWidth = document.querySelector('.svgGroup').getBoundingClientRect().width ;
        let heatMapHeight = document.querySelector('.svgGroup').getBoundingClientRect().height;
        let svgWidth = svgOptions.margin.left + svgOptions.rowLabelWidth + svgOptions.margin.leftMidMargin + heatMapWidth + svgOptions.margin.right;
        let svgHeight = svgOptions.margin.top + svgOptions.colLabelHeight + svgOptions.margin.topMidMargin + heatMapHeight + svgOptions.margin.bottom;
        svgOptions.svg.attr("width", svgWidth);
        svgOptions.svg.attr("height", svgHeight);

    }    
	componentDidUpdate(){
		debugger
		this.init();
	}
	render(){
		return <div className="heatmap">
		</div>;
	}
}
HeatMap.defaultProps = {
	data: [],
	colLabels: [],
	rowLabels: []
}
export default HeatMap;
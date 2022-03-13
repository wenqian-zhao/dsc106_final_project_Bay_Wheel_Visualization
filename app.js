function final(){
    var filePath="dataset/data_cleaned.csv";
    vis1(filePath);
    vis2(filePath);
    vis3(filePath);
    vis4(filePath);
    vis5(filePath);
}

//Question 1
var vis1=function(filePath){
    data = d3.csv(filePath)
    data.then(function(bike){
        var margin = {top: 40, right: 30, bottom: 20, left: 50},
            width = 1000 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;
        var svg = d3.select("#vis1_plot")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
        console.log(bike)
        const timeParser = d3.timeParse("%Y-%m-%d")
        var grouped = Array(...d3.rollup(bike, v=>v.length, d=>d.start_date))
        data = grouped.map(d=>[timeParser(d[0]), d[1]])
        function sortByDateAscending(a, b) {
            return a[0] - b[0];
        }
        data = data.sort(sortByDateAscending);
        console.log(d3.extent(data, d=>d[0]))
        var xScale = d3.scaleTime()
                       .domain(d3.extent(data, d=>d[0]))
                       .range([ 0, width ])
        var yScale = d3.scaleLinear()
                       .domain([0, d3.max(data, d=>d[1])])
                       .range([height, 0])
        xAxis = svg.append("g")
                   .attr("transform", "translate(0," + height + ")")
                   .call(d3.axisBottom(xScale));
        yAxis = svg.append("g")
                   .call(d3.axisLeft(yScale));
        var path = svg.append("g")
        path.append("path")
            .datum(data)
            .classed("vis1_line", true)
            .attr("fill", "none")
            .attr("stroke", "#397EBF")
            .attr("stoke-width", "2.5px")
            .attr("d", d3.line().x(d=>xScale(d[0])).y(d=>yScale(d[1])))
        var months = ["All Year",1,2,3,4,5,6,7,8,9,10,11,12]
        var bottom = d3.select("#selectButtonVis1")
                       .selectAll("month")
                       .data(months)
                       .enter()
                       .append("option")
                       .text(d=>d)
                       .attr("value", d=>d)
        d3.select("#selectButtonVis1").on("change", function(d){

            var mon = d3.select(this).property("value");
            var info = 0
            if (mon == "All Year") {
                path.style("opacity", 0)
                path.select(".vis1_line")
                    .datum(data)
                    .attr("d", d3.line().x(d=>xScale(d[0])).y(d=>yScale(d[1])))
                path.transition().duration(800).style("opacity", 1)
            }
            else {
                var month = mon - 1;
                var start = new Date(2014, month, 01);
                var end = new Date(2014, month + 1, 0);
                info = data.filter(d => d[0] >= start && d[0] <= end)
                var xScaleNew = d3.scaleTime()
                            .domain(d3.extent(info, d=>d[0]))
                            .range([ 0, width ])
                var yScaleNew = d3.scaleLinear()
                            .domain([0, d3.max(info, d=>d[1])])
                            .range([height, 0])
                xAxis.transition().call(d3.axisBottom(xScaleNew)).duration(2000)
                yAxis.transition().call(d3.axisLeft(yScale)).duration(2000);
                path.select(".vis1_line")
                    .datum(info)
                    .transition()
                    .duration(1000)
                    .attr("d", d3.line().x(d=>xScaleNew(d[0])).y(d=>yScaleNew(d[1])));
                        }
        })
    })
}

var vis2=function(filePath){
    
}

var vis3=function(filePath){

}

var vis4=function(filePath){

}


var vis5=function(filePath){
    
}

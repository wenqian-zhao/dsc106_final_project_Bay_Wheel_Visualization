function final(){
    var filePath="dataset/data_cleaned.csv";
    vis1(filePath);
    // Comment out for faster display purpose, implementation finished
    // vis2(filePath);
    var filePathV3 = "dataset/data_cleaned_vis3.csv"
    vis3(filePathV3);
    var filePathV4 = "dataset/data_cleaned_vis4.csv"
    vis4(filePathV4);
    var stationPath = "dataset/station_cleaned.csv";
    var tripPath = "dataset/trip.json"
    vis5(stationPath, tripPath);
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
        const timeParser = d3.timeParse("%Y-%m-%d")
        var grouped = Array(...d3.rollup(bike, v=>v.length, d=>d.start_date))
        data = grouped.map(d=>[timeParser(d[0]), d[1]])
        function sortByDateAscending(a, b) {
            return a[0] - b[0];
        }
        data = data.sort(sortByDateAscending);
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
    var data = d3.csv(filePath,function(d) {return {temperature: parseInt(d.mean_temperature_f), duration: parseInt(d.duration)}});
    data.then(function(bike){
        var margin = {top: 40, right: 30, bottom: 20, left: 50},
            width = 400 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;
        var svg = d3.select("#vis2_plot")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
        var noOutlier = []
        for (var i of bike) {
            if (i.duration < 7200) {
                noOutlier.push(i)
            }
        }
        var xScale = d3.scaleLinear()
                       .domain([d3.min(noOutlier, d=>d.temperature), d3.max(noOutlier, d=>d.temperature)])
                       .range([0, width])
        var yScale = d3.scaleLinear()
                       .domain([0, d3.max(noOutlier, d=>d.duration)])
                       .range([height, 0])
        xAxis = svg.append("g")
                   .attr("transform", "translate(0," + height + ")")
                   .call(d3.axisBottom(xScale));
        yAxis = svg.append("g")
                   .call(d3.axisLeft(yScale));
        svg.append("g")
           .classed("vis2_scatter", true)
           .selectAll(".circle")
           .data(noOutlier)
           .enter()
           .append("circle")
           .attr("cx", d=>xScale(d.temperature))
           .attr("cy", d=>yScale(d.duration))
           .attr("r", 3)
           .attr("fill", "#397EBF")
    })
}

var vis3=function(filePath){
    var data = d3.csv(filePath);
    data.then(function(bike) {
        var margin = {top: 40, right: 300, bottom: 40, left: 300},
            width = 1300 - margin.left - margin.right,
            height = 1100 - margin.top - margin.bottom;
        var svg = d3.select("#vis3_plot")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
        const hours = bike.map(d=>d[""])
        const stations = d3.shuffle(Object.keys(bike[0]).slice(1))
        console.log(bike)
        console.log(stations)
        const xScale = d3.scaleBand()
                         .domain(hours)
                         .rangeRound([0, width])
        const yScale = d3.scaleBand()
                         .domain(stations)
                         .range([height, 0])

        xAxis = svg.append("g")
                   .attr("transform", "translate(0," +height+ ")")
                   .call(d3.axisBottom(xScale).tickSizeOuter(0))
                   
        yAxis = svg.append("g")
                   .call(d3.axisLeft(yScale).tickSizeOuter(0));

        var colormap = d3.scaleSequential(d3.interpolateBlues)
                         .domain([0, 1700])
        
        
        var onMouseOver = function(d, i) {
            var hour = d3.select(this).attr("class")
            var xPos = event.pageX - 50;
            var yPos = event.pageY + 20;
            d3.select("#tooltip_vis3")
               .transition()
               .duration(100)
               .style("opacity", 1)
            d3.select("#tooltip_vis3")
              .style("left", xPos + "px")
              .style("top", yPos + "px")
              .select("#value").text(bike.filter(d=>d[""]==hour)[0][i])
            d3.select(this).style("stroke-width", 1)
        }
        var onMouseOut = function(d, i) {
            d3.select(this).style("stroke-width", 0)
            d3.select("#tooltip_vis3")
               .transition()
               .duration(30)
               .style("opacity", 0)
            d3.select("#tooltip_vis3")
              .style("left", 0 + "px")
              .style("top", 0 + "px")
        }
        for (var i of hours) {
            svg.selectAll(".rect")
               .data(stations)
               .enter()
               .append("rect")
               .attr("x", xScale(i))
               .attr("y", d=>yScale(d))
               .attr("width", xScale.bandwidth())
               .attr("height", yScale.bandwidth())
               .attr("fill", d=>colormap(parseInt(bike[parseInt(i)][d])))
               .attr("stroke", "#0D284E")
               .attr("stroke-width", 0)
               .classed(i, true)
               .on("mouseover", onMouseOver)
               .on("mouseout", onMouseOut)
        }
        
    })
}

var vis4=function(filePath){
    var data = d3.csv(filePath, d3.autoType);
    data.then(function(bike){
        console.log(bike);
        var margin = {top: 40, right: 60, bottom: 20, left: 60},
            width = 800 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;
        var svg = d3.select("#vis4_plot")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
        const userType = ["Subscriber", "Customer"]
        const months = bike.map(d=>d.month)
        const xScale = d3.scaleBand()
                         .domain(months)
                         .rangeRound([0, width])
                         .padding([0.2])
        const yScaleStack = d3.scaleLinear()
                         .domain([0, 16000])
                         .range([height, 0])
        xAxis = svg.append("g")
                   .attr("transform", "translate(0," +height+ ")")
                   .call(d3.axisBottom(xScale).tickSizeOuter(0))
        yAxisStack = svg.append("g")
                   .call(d3.axisLeft(yScaleStack).tickSizeOuter(0))
                   .attr("opacity", 1);
        const stacked = d3.stack().keys(userType)(bike)
        var color = d3.scaleOrdinal()
                      .domain(userType)
                      .range(["#397EBF", "#F56E05"])
                      
        var barstack = svg.append("g")
                          .selectAll(".g")
                          .data(stacked)
                          .enter()
                          .append("g")
                          .attr("fill", d=>color(d.key))
                          .selectAll(".bars")
                          .data(d=>d)
                          .enter()
                          .append("rect")
                          .attr("x", d => xScale(d.data.month))
                          .attr("y", d => yScaleStack(d[1]))
                          .attr("height", d => yScaleStack(d[0]) - yScaleStack(d[1]))
                          .attr("width",xScale.bandwidth())
                          .attr("opacity", 1)

        
        var legend = svg.append("g").classed("legendVis4", true).attr("opacity", 1)
        legend.selectAll(".rect")
              .data(["Customer", "Subscriber"])
              .enter()
              .append("rect")
              .attr("x", 565)
              .attr("y", (d, i) => 0 + 15*i)
              .attr("width", 11)
              .attr("height", 11)
              .attr("fill", d=>color(d))
              
        legend.selectAll(".text")
              .data(["Casual Customer", "Subscriber"])
              .enter()
              .append("text")
              .text(d=>d)
              .attr("x", 578)
              .attr("y", (d, i) => 11 + 15*i)
        
        const yScaleCus = d3.scaleLinear()
                         .domain([0, d3.max(bike, d=>d.Customer)])
                         .range([height, 0])
        yAxisCus = svg.append("g")
                   .call(d3.axisLeft(yScaleCus).tickSizeOuter(0))
                   .attr("opacity", 0);
        var barCus = svg.append("g")
                        .selectAll("rect")
                        .data(bike)
                        .enter()
                        .append("rect")
                        .attr("x", d=>xScale(d.month))
                        .attr("y", d=>yScaleCus(d.Customer))
                        .attr("width", xScale.bandwidth)
                        .attr("height", d=>height - yScaleCus(d.Customer))
                        .attr("opacity", 0)
                        .attr("fill", "#F56E05")


        const yScaleSub = d3.scaleLinear()
                         .domain([0, d3.max(bike, d=>d.Subscriber)])
                         .range([height, 0])
        yAxisSub = svg.append("g")
                    .call(d3.axisLeft(yScaleSub).tickSizeOuter(0))
                    .attr("opacity", 0);
        var barSub= svg.append("g")
                        .selectAll("rect")
                        .data(bike)
                        .enter()
                        .append("rect")
                        .attr("x", d=>xScale(d.month))
                        .attr("y", d=>yScaleSub(d.Subscriber))
                        .attr("width", xScale.bandwidth)
                        .attr("height", d=>height - yScaleSub(d.Subscriber))
                        .attr("opacity", 0)
                        .attr("fill", "#397EBF")

        
        var radios = d3.selectAll("input[name='controlBar']");
        radios.on("change", function(d) {
            var group = d3.select(this).attr("value");
            if (group == "stack") {
                yAxisSub.transition().attr("opacity", 0).duration(600);
                barSub.transition().attr("opacity", 0).duration(600);
                barCus.transition().attr("opacity", 0).duration(600);
                yAxisCus.transition().attr("opacity", 0).duration(600);
                legend.transition().attr("opacity", 1).duration(600);
                barstack.transition().attr("opacity", 1).duration(600);
                yAxisStack.transition().attr("opacity", 1).duration(600);
            }
            if (group == "Casual Customers") {
                yAxisSub.transition().attr("opacity", 0).duration(600);
                barSub.transition().attr("opacity", 0).duration(600);
                barCus.transition().attr("opacity", 1).duration(600);
                yAxisCus.transition().attr("opacity", 1).duration(600);
                legend.transition().attr("opacity", 0).duration(600);
                barstack.transition().attr("opacity", 0).duration(600);
                yAxisStack.transition().attr("opacity", 0).duration(600);
            }
            if (group == "Subscribers") {
                yAxisSub.transition().attr("opacity", 1).duration(600);
                barSub.transition().attr("opacity", 1).duration(600);
                barCus.transition().attr("opacity", 0).duration(600);
                yAxisCus.transition().attr("opacity", 0).duration(600);
                legend.transition().attr("opacity", 0).duration(600);
                barstack.transition().attr("opacity", 0).duration(600);
                yAxisStack.transition().attr("opacity", 0).duration(600);
            }
        })
    })
}


var vis5=function(stationPath, tripPath){
    Promise.all([
      d3.csv(stationPath),
      d3.json(tripPath) 
    ]).then(
        function (initialize) {

            let station = initialize[0]
            let trip = initialize[1]

            var width = 500;
            var height = 300;
            //var xCenter = [0, 100, 200， 300， 400， 500， 600,];
            //var rScale = d3.scaleLinear().domain([0, d3.max(dataset.nodes, d => d.value)]).range([10, 45])
            var force = d3.forceSimulation(station)
                          .force("charge", d3.forceManyBody().strength(0))
                          .force("link", d3.forceLink(data.edges))
                          //.force("center", d3.forceCenter().x(width/2).y(height/2))
                         // .force("collide", d3.forceCollide().radius(d => rScale(d.value)))
                         // .force("x", d3.forceX().x(function(d) { return d.x}))
                          //.force("y", d3.forceY().y(d => d.y))


            //create the color array using an existing colormap
            var colors = d3.scaleOrdinal(d3.schemeCategory10);

            //create SVG canvas
            var svg = d3.select("#vis5_plot")
                        .append("svg")
                        .attr("width", width)
                        .attr("height", height);
            
            //create edges
            var edges = svg.selectAll("line")
                .data(trip)
                .enter()
                .append("line")
                .attr("stroke", "lightgray")
            
            //create nodes
            var nodes = svg.selectAll("circle")
                .data(station)
                .enter()
                .append("circle")
                .style("fill", function(d, i) {
                    return colors(i);
                })
            
            //when the simulation "ticks", execute the callback function
            force.on("tick", function() {

                edges.attr("x1", function(d) { return d.source.x; })
                     .attr("y1", function(d) { return d.source.y; })
                     .attr("x2", function(d) { return d.target.x; })
                     .attr("y2", function(d) { return d.target.y; });
            
                nodes.attr("cx", function(d) { return d.x; })
                     .attr("cy", function(d) { return d.y; })
                     .attr("r", 10);

        });
    })
}

//leave it 
var vis6=function(filePath){

    var margin = {top: 40, right: 300, bottom: 40, left: 300},
            width = 800 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;
    var svg = d3.select("#vis5_plot")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

    // Map and projection
    const projection = d3.geoMercator()
        .center([10, 47])                // GPS of location to zoom on
        .scale(1200)                       // This is like the zoom
        .translate([ width/2, height/2 ])

    // Load external data and boot
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then( function(data){

        // Filter data
        data.features = data.features.filter(d => {console.log(d.properties.name); return d.properties.name=="France"})

        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(data.features)
            .join("path")
              .attr("fill", "grey")
              .attr("d", d3.geoPath()
                  .projection(projection)
              )
            .style("stroke", "none")
    })
    
}


// Read data
d3.csv('csv/IVPDatasetVariety.csv', function (data) {

    // set the dimensions and margins of the graph
    var margin = { top: 80, right: 40, bottom: 80, left: 40 },
        width = 1500 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#varietyMap")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // stratify the data: reformatting for d3.js
    var root = d3.stratify()
        .id(function (d) { return d.name; })// Name of the entity (column name is name in csv)
        .parentId(function (d) { return d.parent; })   // Name of the parent (column name is parent in csv)
        (data);
    root.sum(function (d) { return +d.number_of_wine })   // Compute the numeric value for each entity

    // Then d3.treemap computes the position of each element of the hierarchy
    // The coordinates are added to the root object above
    d3.treemap()
        .size([width, height])
        .padding(4)
        (root)

    //Build legend
    var linear = d3.scaleSequential()
        .interpolator(d3.interpolateSpectral)
        .domain([85, 90]);

    // Hover function
    var mouseover = function (d) {
        // Reduce opacity of all rect to 0.2
        d3.select(this)
            .attr('opacity', 0.5)

        svg.append("text")
            .attr("class", "hover-label")
            .attr("x", 20)
            .attr("y", -20)
            .attr("text-anchor", "left")
            .style("font-size", "24px")
            .text("Grape : " + d.data.name);
    }

    // Remove hover
    var mouseleave = function (d) {
        d3.select(this)
            .attr('opacity', 1)
        svg.selectAll('.hover-label').remove()
    }

    console.log(root.leaves())
    // use this information to add rectangles:
    svg
        .selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)
        .style("fill", function (d) { return linear(d.data.average_point); });

    svg.append("g")
        .attr("class", "legendLinear")
        .style("opacity", 0.8)
        .attr("transform", "translate(845,-50)");

    var legendLinear = d3.legendColor()
        .shapeWidth(50)
        .cells(11)
        //.labels([">100","91-100","81-90","71-80","61-70","51-60","41-50","31-40","21-30","11-20","<10"])
        .orient('horizontal')
        .scale(linear);

    svg.select(".legendLinear")
        .style("font-size", "14px")
        .call(legendLinear);

})

svg.append("text")
    .attr("x", 750)
    .attr("y", -20)
    .attr("text-anchor", "right")
    .style("font-size", "14px")
    .text("Average rating");
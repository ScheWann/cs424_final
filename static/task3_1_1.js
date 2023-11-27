const containerWidth = document.getElementById(
  "income_in_Highest_Violation_Area"
).offsetWidth;

async function loadData() {
  let response = await fetch("/data/get_Highest_Area_Income_And_Violation");
  let data = await response.json();
  return data;
}

async function drawChart(sortField) {
  const data = await loadData();
  data.sort((a, b) => d3.ascending(a[sortField], b[sortField]));

  const margin = { top: 20, right: 40, bottom: 20, left: 40 };
  const width = containerWidth - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const xScale = d3
    .scaleBand()
    .range([0, width])
    .padding(0.1)
    .domain(data.map((d) => d.year));

  const yScale = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(data, (d) => d.violation)]);

  const yScaleIncome = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(data, (d) => d.income)]);

  let tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Select the SVG if it exists
  let svg = d3.select("#task3_1_1").selectAll("svg").data([null]);
  svg = svg
    .enter()
    .append("svg")
    .merge(svg)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // Draw the bars
  const bars = svg.selectAll(".bar").data(data, (d) => d.year);

  bars
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d.year))
    .attr("width", xScale.bandwidth())
    .attr("y", (d) => yScale(d.violation))
    .attr("height", (d) => height - yScale(d.violation))
    .attr("fill", "#d73027")
    .attr("transform", "translate(" + margin.right + "," + 15 + ")")
    .merge(bars)
    .transition()
    .duration(750)
    .attr("x", (d) => xScale(d.year))
    .attr("width", xScale.bandwidth())
    .attr("y", (d) => yScale(d.violation))
    .attr("height", (d) => height - yScale(d.violation))
    .attr("fill", "#d73027");

  bars
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html("Violation: " + d.violation + "<br/>Year: " + d.year)
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", (d) => {
      tooltip.transition().duration(500).style("opacity", 0);
    });

  bars.exit().transition().duration(750).style("opacity", 0).remove();
  let g = svg.selectAll(".container").data([null]);

  g = g
    .enter()
    .append("g")
    .attr("class", "container")
    .merge(g)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  g.selectAll(".line").remove();
  g.selectAll(".dot").remove();
  const line = d3
    .line()
    .x((d) => xScale(d.year) + xScale.bandwidth() / 2)
    .y((d) => yScaleIncome(d.income));

  g.append("path")
    .data([data])
    .join("path")
    .attr("class", "line")
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "#91bfdb")
    .attr("stroke-width", 2);

  g.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", function (d) {
      return xScale(d.year) + xScale.bandwidth() / 2;
    })
    .attr("cy", function (d) {
      return yScaleIncome(d.income);
    })
    .attr("r", 5)
    .attr("fill", "#91bfdb")
    .on("mouseover", function (event, d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html("Income: " + d.income + "<br/>Year: " + d.year)
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
    });

  g.selectAll(".axis").remove();

  // Draw the axes
  g.append("g").attr("class", "axis axis--y").call(d3.axisLeft(yScale));

  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));
}

drawChart("year");

// Event listener for the dropdown
document.getElementById("sortSelect").addEventListener("change", (event) => {
  drawChart(event.target.value);
});

const containerWidth = document.getElementById("Matrix_Heatmap").offsetWidth;

const margin = { top: 40, right: 150, bottom: 40, left: 40 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const legendWidth = 20;
const legendHeight = 20;
const legendValues = [10, 30, 50, 70, 90];

let tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

async function loadData() {
  let response = await fetch("/data/get_Matrix_Heatmap");
  let data = await response.json();
  return data;
}

(async () => {
  const data = await loadData();

  const svg = d3
    .select("#task4_2_2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xMax = d3.max(data, (d) => d.TOTAL);
  const xScale = d3.scaleLinear().domain([0, xMax]).range([0, width]);
  const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);
  const colorScale = d3.scaleSequential(d3.interpolateViridis).domain([0, 100]);
  const hoverVerticalLine = svg
    .append("line")
    .attr("stroke", "grey")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "5,5")
    .style("display", "none");

  const hoverHorizontalLine = svg
    .append("line")
    .attr("stroke", "grey")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "5,5")
    .style("display", "none");

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.TOTAL))
    .attr("cy", (d) => yScale(d.RATIO))
    .attr("r", 20) // Radius of the circle. Adjust as required.
    .attr("fill", (d) => colorScale(d.RATIO));

  svg
    .selectAll("circle")
    .on("mouseover", function (event, d) {
      let tooltipHtml = `Year: ${d.YEAR}<br>`;
      tooltipHtml += `Building Violation: ${d.TOTAL}<br>Solution Rates: ${d.RATIO}%`;

      tooltip
        .style("left", event.pageX + 15 + "px")
        .style("top", event.pageY + 15 + "px")
        .style("opacity", 1)
        .html(tooltipHtml);

      // Show the lines
      hoverVerticalLine
        .attr("x1", xScale(d.TOTAL))
        .attr("y1", 0)
        .attr("x2", xScale(d.TOTAL))
        .attr("y2", height)
        .style("display", null);

      hoverHorizontalLine
        .attr("x1", 0)
        .attr("y1", yScale(d.RATIO))
        .attr("x2", width)
        .attr("y2", yScale(d.RATIO))
        .style("display", null);
    })
    .on("mouseout", function () {
      // Hide the tooltip and lines
      tooltip.style("opacity", 0);
      hoverVerticalLine.style("display", "none");
      hoverHorizontalLine.style("display", "none");
    });

  svg
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("font-size", "12px")
    .attr("x", (d) => xScale(d.TOTAL))
    .attr("y", (d) => yScale(d.RATIO))
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("fill", "white")
    .text((d) => d.YEAR);

  svg
    .append("line")
    .attr("x1", width / 2)
    .attr("y1", 0)
    .attr("x2", width / 2)
    .attr("y2", height)
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  svg
    .append("line")
    .attr("x1", 0)
    .attr("y1", height / 2)
    .attr("x2", width)
    .attr("y2", height / 2)
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  const legend = svg
    .selectAll(".legend")
    .data(legendValues)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr(
      "transform",
      (d, i) =>
        `translate(${width + 90}, ${margin.top + i * (legendHeight + 5)})`
    );

  svg
    .append("text")
    .attr("x", width + 50)
    .attr("y", margin.top - 10)
    .attr("font-size", "15px")
    .attr("text-anchor", "start")
    .text("Solution rates");

  legend
    .append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", colorScale);

  legend
    .append("text")
    .attr("x", -10)
    .attr("y", legendHeight / 2)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text((d) => d);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  svg.append("g").attr("transform", `translate(0,${height})`).style("font-size", 14).call(xAxis);
  svg.append("g").style("font-size", 14).call(yAxis);
})();

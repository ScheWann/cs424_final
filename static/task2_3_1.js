let multiLineChartData;
let width = 1200;
let height = 500;
let margin = { top: 50, right: 100, bottom: 50, left: 60 };

$(document).ready(function(){
  $('[data-toggle="popover"]').popover();
});

let tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

window.addEventListener("districtClicked", async function (e) {
  let zipCode = e.detail.zipCode;
  multiLineChartData = await loadData(zipCode);
  renderChart(multiLineChartData);
});

async function loadData(zip) {
  const postData = {
    zip: +zip,
  };

  let response_lineChart = await fetch("/data/get_Violation_Count_by_Month", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  let data = await response_lineChart.json();
  
  // Hide the placeholder image
  document.getElementById('loadingPlaceholder').style.display = 'none';
  
  return data;
}

function renderChart(data) {
  d3.select("#task2_3_1 svg").remove();

  const svg = d3
    .select("#task2_3_1")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const xScale = d3
    .scaleLinear()
    .domain([1, d3.max(data, (d) => d["Month"])])
    .range([margin.left, width - margin.right]);

  const yMax = d3.max(data, (d) =>
    Math.max(...Object.values(d).filter((v) => typeof v === "number"))
  );
  const yScale = d3
    .scaleLinear()
    .domain([0, yMax])
    .range([height - margin.bottom, margin.top]);

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  const violationTypes = Object.keys(data[0]).filter((k) => k !== "Month");

  violationTypes.forEach((type, i) => {
    const line = d3
      .line()
      .x((d) => xScale(d["Month"]))
      .y((d) => yScale(d[type]));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", colorScale(i))
      .attr("stroke-width", 1.5)
      .attr("d", line);

    svg
      .selectAll(`.dot-${type}`)
      .data(data)
      .enter()
      .append("circle")
      .attr("class", `dot-${type}`)
      .attr("cx", (d) => xScale(d["Month"]))
      .attr("cy", (d) => yScale(d[type]))
      .attr("r", 4)
      .attr("fill", colorScale(i))
      .on("mouseover", function (event, d) {
        d3.select(this).attr("r", 6);

        const month = d["Month"];
        let tooltipHtml = `Month: ${month}<br>`;
        tooltipHtml += `${type}: ${d[type]}<br>`;

        tooltip
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY + 15 + "px")
          .style("opacity", 1)
          .html(tooltipHtml);
      })
      .on("mouseout", function (event, d) {
        // Reset radius on mouse out
        d3.select(this).attr("r", 4);
        tooltip.style("opacity", 0);
      });
  });

  const xAxisGrid = d3
    .axisBottom(xScale)
    .tickSize(-height + margin.top + margin.bottom);

  const yAxisGrid = d3
    .axisLeft(yScale)
    .tickSize(-width + margin.left + margin.right);

  svg
    .append("g")
    .attr("class", "x grid")
    .style("font-size", 14)
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxisGrid);

  svg
    .append("g")
    .attr("class", "y grid")
    .style("font-size", 14)
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxisGrid);

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr(
      "transform",
      `translate(${margin.left / 2},${height / 2}) rotate(-90)`
    )
    .attr("font-size", 14)
    .text("Violation Count");

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${width / 2},${height - 15})`)
    .attr("font-size", 14)
    .text("Month");

  const legend = svg
    .append("g")
    .attr("font-size", 14)
    .attr("text-anchor", "end")
    .selectAll("g")
    .data(violationTypes)
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(0,${i * 20 + 30})`);

  legend
    .append("rect")
    .attr("x", width - 19)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", (d, i) => colorScale(i));

  legend
    .append("text")
    .attr("x", width - 24)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text((d) => d);
}

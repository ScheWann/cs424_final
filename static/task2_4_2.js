updateData()

const margin = { top: 20, right: 30, bottom: 20, left: 30 }
const width = 800- margin.left - margin.right,
  height = 500 - margin.top - margin.bottom,
  innerRadius = 50,
  outerRadius = Math.min(width, height) / 2;

const legendPadding = { top: 10, left: 20 };
const legendItemHeight = 20;
const legendTitleHeight = 20;

const legendX = width / 3;
const legendY = -height / 2 + legendPadding.top;

// update data by selecting month
document.addEventListener("DOMContentLoaded", () => {
  const monthSelect = document.getElementById("monthSelect");
  monthSelect.addEventListener("change", function () {
    updateData();
  });
});

let tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

async function loadData() {

  const month = document.getElementById("monthSelect").value;
  const postData = {
    month: month,
  };

  let response = await fetch("/data/get_radial_bar_chart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });
  
  let data = await response.json();
  return data;
}

const color = d3.scaleOrdinal(d3.schemeCategory10);

async function updateData() {
  d3.select("#task2_4_2 svg").remove();
  let data = await loadData();

  const legendTitleText = "Violation Group";

  const svg = d3
  .select("#task2_4_2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 1.8 + ")");

  // find key by value in tooltip
  function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }

  let grouped = d3.group(data, (d) => d.code);

  let newData = Array.from(grouped).map(([key, value]) => {
    let obj = { code: key };
    value.forEach((v) => (obj[v.group] = v.count));
    return obj;
  });

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.code))
    .range([0, 2 * Math.PI])
    .align(0);
  const y = d3.scaleRadial().range([innerRadius, outerRadius]);

  const series = d3.stack().keys(data.map((d) => d.group))(newData);
  const colorCount = Math.min(Math.max(series.length, 3), 11);
  
  y.domain([0, d3.max(series, (s) => d3.max(s, (d) => d[1]))]);

  const colorScale = d3
    .scaleOrdinal()
    .domain(series.map((d) => d.key))
    .range(d3.schemeSpectral[colorCount])
    .unknown("#ccc");

  const arc = d3
    .arc()
    .innerRadius((d) => y(d[0]))
    .outerRadius((d) => y(d[1]))
    .startAngle((d) => x(d.data.code))
    .endAngle((d) => x(d.data.code) + x.bandwidth())
    .padAngle(0.01)
    .padRadius(innerRadius);

  svg
    .append("g")
    .selectAll("g")
    .data(series)
    .join("g")
    .attr("fill", (d) => colorScale(d.key))
    .selectAll("path")
    .data((d) => d)
    .join("path")
    .attr("d", arc)
    .on("mouseover", function (event, d) {
      let generatedCount = d[1] - d[0];
      svg.selectAll("path").style("opacity", 0.5);
      d3.select(this)
        .style("opacity", 1)
        .style("stroke", "#666")
        .style("stroke-width", "1.5px");
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          "Violation Group: " +
            getKeyByValue(d.data, generatedCount) +
            "<br/>" +
            "Violation Code: " +
            d.data.code +
            "<br/>" +
            "Violation Count: " +
            generatedCount
        )
        .style("left", event.pageX + "px")
        .style("top", event.pageY + "px");
    })
    .on("mouseout", function (d) {
      svg.selectAll("path").style("opacity", 1).style("stroke", "none");
      tooltip.transition().duration(500).style("opacity", 0);
    });

  // x axis
  svg
    .append("g")
    .attr("text-anchor", "middle")
    .selectAll()
    .data(x.domain())
    .join("g")
    .attr(
      "transform",
      (d) => `
      rotate(${((x(d) + x.bandwidth() / 2) * 180) / Math.PI - 90})
      translate(${innerRadius},0)
    `
    )
    .call((g) => g.append("line").attr("x2", -5).attr("stroke", "#000"))
    .call((g) =>
      g
        .append("text")
        .attr("transform", (d) =>
          (x(d) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
            ? "rotate(90)translate(0,16)"
            : "rotate(-90)translate(0,-9)"
        )
        .text((d) => d)
    );

  // y axis
  svg
    .append("g")
    .attr("text-anchor", "middle")
    .call((g) =>
      g
        .append("text")
        .attr("y", (d) => -y(y.ticks(5).pop()))
        .attr("dy", "-1em")
        .text("Violation Counts")
    )
    .call((g) =>
      g
        .selectAll("g")
        .data(y.ticks(5).slice(1))
        .join("g")
        .attr("fill", "none")
        .call((g) =>
          g
            .append("circle")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.5)
            .attr("r", y)
        )
        .call((g) =>
          g
            .append("text")
            .attr("y", (d) => -y(d))
            .attr("dy", "0.35em")
            .attr("stroke", "#fff")
            .attr("stroke-width", 5)
            .text(y.tickFormat(5, "s"))
            .clone(true)
            .attr("fill", "#000")
            .attr("stroke", "none")
        )
    );
  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${legendX},${legendY})`);

  legend
    .append("text")
    .attr("class", "legend-title")
    .attr("x", 0)
    .attr("y", legendTitleHeight - legendPadding.top)
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .text(legendTitleText);

  // Append legend items
  legend
    .selectAll("g.legend-item")
    .data(series.map((d) => d.key))
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr(
      "transform",
      (d, i) => `translate(0, ${legendTitleHeight + i * legendItemHeight})`
    )
    .each(function (d, i) {
      const g = d3.select(this);
      g.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", colorScale(d));
      g.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", "0.35em")
        .style("font-size", "12px")
        .text(d);
    });
};

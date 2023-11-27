const containerWidth = document.getElementById(
  "group_bar_chart"
).offsetWidth;

async function loadData() {
  let correspond_data = await fetch("/data/get_group_bar_chart");
  let data = await correspond_data.json();

  return data;
}

(async () => {
  let data = await loadData();

  let task2_4_1 = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "A simple bar chart with embedded data.",
    data: {
      values: data,
    },
    width: containerWidth,
    mark: "bar",
    encoding: {
      x: {
        field: "PROPERTY GROUP",
        type: "ordinal",
        axis: {
          labelAngle: 0,
          title: "PROPERTY GROUP",
          labelFontSize: 14,
          titleFontSize: 16,
        },
      },
      y: {
        field: "count",
        type: "quantitative",
        axis: { title: "Count", labelFontSize: 14, titleFontSize: 16 },
      },
      color: {
        field: "VIOLATION CODE",
        type: "nominal",
        legend: {
          title: "VIOLATION CODE",
          labelFontSize: 14,
          titleFontSize: 16,
        },
      },
      tooltip: [
        { field: "VIOLATION CODE", type: "nominal", title: "Violation Code" },
        { field: "count", type: "quantitative", title: "Violation Counts" },
      ],
    },
    config: {
      view: { stroke: "transparent" },
    },
  };

  vegaEmbed("#task2_4_1", task2_4_1, { actions: false });
})();

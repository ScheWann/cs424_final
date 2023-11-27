const containerWidth = document.getElementById("linearRegression").offsetWidth;

async function loadData() {
  let correspond_data = await fetch("/data/get_correlation");
  let data = await correspond_data.json();

  return data;
}

(async () => {
  let data = await loadData();

  const scatterSpec = (xField, yField) => {
    return {
      width: containerWidth * 0.8,
      data: { values: data },
      layer: [
        // Scatter plot
        {
          mark: "point",
          encoding: {
            x: {
              field: xField,
              type: "quantitative",
              axis: {
                labelFontSize: 14,
                titleFontSize: 16,
              },
            },
            y: {
              field: yField,
              type: "quantitative",
              axis: {
                labelFontSize: 14,
                titleFontSize: 16,
              },
            },
            tooltip: [
              { field: "zip", type: "ordinal" },
              { field: xField, type: "quantitative" },
              { field: yField, type: "quantitative" },
            ],
          },
        },
        // Regression line
        {
          mark: "line",
          transform: [
            {
              regression: xField,
              on: yField,
              method: "linear",
            },
          ],
          encoding: {
            x: { field: xField, type: "quantitative" },
            y: { field: yField, type: "quantitative", aggregate: "mean" },
            color: { value: "#c994c7" },
          },
        },
      ],
    };
  };
  let task2_2_1 = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description:
      "Violation Building Counts and Personal Income from 2018 to 2023",
    vconcat: [
      scatterSpec("Population", "count"),
      scatterSpec("Average Income", "count"),
    ],
  };

  vegaEmbed("#task2_2_1", task2_2_1, { actions: false });
})();

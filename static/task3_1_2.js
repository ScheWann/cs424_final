const containerWidth = document.getElementById(
  "low_And_High_Violation_area_comparation"
).offsetWidth;

async function loadData() {
  let response = await fetch(
    "/data/get_Comparation_Between_lowest_Area_And_Highest_Area"
  );
  let data = await response.json();
  return data;
}

(async () => {
  let data = await loadData();

  let task3_1_2 = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    data: {
      values: data,
    },
    width: containerWidth * 0.8,
    layer: [
      {
        mark: "bar",
        encoding: {
          x: {
            field: "year",
            type: "ordinal",
            axis: {
              labelFontSize: 14,
              titleFontSize: 16,
            },
          },
          y: {
            field: "counts",
            type: "quantitative",
            axis: {
              labelFontSize: 14,
              titleFontSize: 16,
            },
          },
          xOffset: { field: "zip", type: "ordinal", scale: { rangeStep: 12 } },
          tooltip: [
            { field: "year", type: "ordinal", title: "Year" },
            {
              field: "counts",
              type: "quantitative",
              title: "Violation Counts",
            },
            { field: "zip", type: "ordinal", title: "Zip Code" },
          ],
        },
      },
      {
        mark: { type: "line", point: true },
        encoding: {
          x: {
            field: "year",
            type: "ordinal",
            axis: {
              labelFontSize: 14,
              titleFontSize: 16,
            },
          },
          y: {
            field: "income",
            type: "quantitative",
            axis: {
              labelFontSize: 14,
              titleFontSize: 16,
            },
          },
          color: {
            field: "zip",
            scale: { range: ["#32CD32", "#FF8C00"] },
            legend: {
              labelFontSize: 14,
              titleFontSize: 16,
            },
          },
          tooltip: [
            { field: "zip", type: "ordinal", title: "Zip Code" },
            { field: "income", type: "quantitative", title: "Income" },
          ],
        },
      },
    ],
  };

  vegaEmbed("#task3_1_2", task3_1_2, { actions: false });
})();

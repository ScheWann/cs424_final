const containerWidth = document.getElementById(
  "Solution_Rates_Violation"
).offsetWidth;

async function loadData() {
  let response = await fetch("/data/get_rates_by_years");
  let data = await response.json();
  return data;
}

function transformData(data) {
  let transformed = [];
  const years = ["2018", "2019", "2020", "2021", "2022", "2023"];

  years.forEach((year) => {
    data.forEach((d) => {
      transformed.push({
        Year: year,
        "VIOLATION STATUS": d["VIOLATION STATUS"],
        Count: d[year],
      });
    });
  });

  return transformed;
}

(async () => {
  let originalData = await loadData();

  const barData = transformData(originalData);

  let solutionRates = barData
    .filter((d) => d["VIOLATION STATUS"] === "COMPLIED")
    .map((d) => {
      const noEntry = originalData.find(
        (o) => o["VIOLATION STATUS"] === "NO ENTRY"
      )[d.Year];
      const open = originalData.find((o) => o["VIOLATION STATUS"] === "OPEN")[
        d.Year
      ];

      return {
        Year: d.Year,
        Rate: d.Count / (noEntry + open),
      };
    });

  let task4_2_1 = {
    data: { values: barData },
    hconcat: [
      {
        width: containerWidth * 0.45,
        mark: "bar",
        encoding: {
          x: {
            field: "Year",
            type: "ordinal",
            axis: { title: "Year", labelFontSize: 14, titleFontSize: 16 },
          },
          y: {
            field: "Count",
            type: "quantitative",
            axis: { title: "Count", labelFontSize: 14, titleFontSize: 16 },
            stack: true,
          },
          color: {
            field: "VIOLATION STATUS",
            type: "nominal",
            scale: { scheme: "tableau20" },
            legend: {
              title: "Violation Status",
              labelFontSize: 14,
              titleFontSize: 16,
            },
          },
          tooltip: [
            { field: "Year", type: "ordinal" },
            { field: "VIOLATION STATUS", type: "nominal" },
            { field: "Count", type: "quantitative" },
          ],
        },
      },
      {
        data: { values: solutionRates },
        width: containerWidth * 0.45,
        layer: [
          // Line Layer
          {
            mark: { type: "line", tooltip: true },
            encoding: {
              x: {
                field: "Year",
                type: "ordinal",
                axis: { title: "Year", labelFontSize: 14, titleFontSize: 16 },
              },
              y: {
                field: "Rate",
                type: "quantitative",
                axis: {
                  title: "Solution Rate",
                  format: ".0%",
                  labelFontSize: 14,
                  titleFontSize: 16,
                },
              },
              color: { value: "#2c7fb8" },
            },
          },
          // Point Layer
          {
            mark: {
              type: "point",
              filled: true,
              size: 100,
            },
            encoding: {
              x: {
                field: "Year",
                type: "ordinal",
                axis: { labelFontSize: 14, titleFontSize: 16 },
              },
              y: {
                field: "Rate",
                type: "quantitative",
                axis: { labelFontSize: 14, titleFontSize: 16 },
              },
              color: { value: "#2c7fb8" },
              tooltip: [
                { field: "Year", type: "ordinal" },
                {
                  field: "Rate",
                  type: "quantitative",
                  title: "Solution Rate",
                  format: ".0%",
                },
              ],
            },
          },
        ],
      },
    ],
  };

  vegaEmbed("#task4_2_1", task4_2_1, { actions: false });
})();

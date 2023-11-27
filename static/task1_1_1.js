const containerWidth = document.getElementById("countIncomePlot").offsetWidth;
const containerHeight = document.getElementById("countIncomePlot").offsetHeight;

async function loadData() {
  let data = {};
  let response_income = await fetch("/data/income");
  let response_summary = await fetch("/data/summary");

  let data_income = await response_income.json();
  let data_summary = await response_summary.json();

  data["income"] = data_income;
  data["summary"] = data_summary;
  return data;
}

(async () => {
  let data = await loadData();
  let task1_1_1 = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description:
      "Violation Building Counts and Personal Income from 2018 to 2023",
    width: containerWidth * 0.8,
    height: containerHeight,
    data: {
      values: [
        {
          year: "2018",
          counts: data.summary[0].Counts,
          income: data.income[0].personal_income,
        },
        {
          year: "2019",
          counts: data.summary[1].Counts,
          income: data.income[1].personal_income,
        },
        {
          year: "2020",
          counts: data.summary[2].Counts,
          income: data.income[2].personal_income,
        },
        {
          year: "2021",
          counts: data.summary[3].Counts,
          income: data.income[3].personal_income,
        },
        {
          year: "2022",
          counts: data.summary[4].Counts,
          income: data.income[4].personal_income,
        },
        {
          year: "2023",
          counts: data.summary[5].Counts,
          income: data.income[5].personal_income,
        },
      ],
    },
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
          tooltip: [
            { field: "year", type: "ordinal", title: "Year" },
            {
              field: "counts",
              type: "quantitative",
              title: "Violation Counts",
            },
          ],
          color: {
            field: "type",
            type: "nominal",
            scale: {
              domain: ["counts", "income"],
              range: ["#fee08b", "#2c7fb8"],
            },
            legend: { title: "Type" },
          },
        },
        transform: [
          {
            calculate: "'counts'",
            as: "type",
          },
        ],
      },
      {
        mark: "line",
        encoding: {
          x: { field: "year", type: "ordinal" },
          y: { field: "income", type: "quantitative" },
          tooltip: [
            { field: "year", type: "ordinal", title: "Year" },
            { field: "income", type: "quantitative", title: "Income" },
          ],
          color: {
            field: "type",
            type: "nominal",
            scale: {
              domain: ["counts", "income"],
              range: ["#fee08b", "#2c7fb8"],
            },
          },
        },
        transform: [
          {
            calculate: "'income'",
            as: "type",
          },
        ],
      },
      {
        mark: {
          type: "text",
          align: "center",
          baseline: "bottom",
          dy: -5,
        },
        encoding: {
          x: { field: "year", type: "ordinal" },
          y: { field: "income", type: "quantitative" },
          text: { field: "income", type: "quantitative" },
          color: { value: "#2c7fb8" },
        },
      },
    ],
  };
  vegaEmbed("#task1_1_1", task1_1_1, { actions: false });
})();

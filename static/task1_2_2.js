// get the default data
updateData();

const containerWidth = document.getElementById(
  "violationCountInZip"
).offsetWidth;

// addEventListener to year selector of map
document.addEventListener("DOMContentLoaded", () => {
  const yearSelect = document.getElementById("mapYearSelect");
  yearSelect.addEventListener("change", function () {
    updateData();
  });
});

async function loadData() {
  const year = document.getElementById("mapYearSelect").value;

  const postData = {
    year: year,
  };

  let response_stackBar = await fetch("/data/get_stacked_bar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  let data = await response_stackBar.json();

  return data;
}

async function updateData() {
  let countData = await loadData();
  let foldArray = Object.keys(countData[0]).filter((key) => key !== "zip");

  let task1_2_2 = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    vconcat: [
      {
        data: { values: countData },
        width: containerWidth * 0.977,
        transform: [
          {
            fold: foldArray,
            as: ["code", "Count"],
          },
          {
            filter: { selection: "violationClick" },
          },
        ],
        mark: "bar",
        selection: {
          zipSelection: { type: "interval", encodings: ["x"] },
        },
        encoding: {
          x: {
            field: "zip",
            type: "ordinal",
            title: "Zip",
            axis: {
              labelFontSize: 14,
              titleFontSize: 16,
            },
          },
          y: {
            field: "Count",
            type: "quantitative",
            axis: {
              title: "Count",
              labelFontSize: 14,
              titleFontSize: 16,
            },
          },
          color: {
            condition: {
              selection: "zipSelection",
              field: "code",
              type: "nominal",
              scale: { scheme: "tableau20" },
              legend: {
                title: "Violation Code",
                labelFontSize: 14,
                titleFontSize: 16,
              },
            },
            value: "lightgray",
          },
          tooltip: [
            { field: "zip", type: "ordinal", title: "Zip" },
            { field: "code", type: "nominal", title: "Code" },
            { field: "Count", type: "quantitative", title: "Count" },
          ],
        },
      },
      {
        data: { values: countData },
        width: containerWidth * 0.977,
        transform: [
          {
            fold: foldArray,
            as: ["code", "Count"],
          },
          {
            filter: { selection: "zipSelection" },
          },
          {
            aggregate: [{ op: "sum", field: "Count", as: "Total" }],
            groupby: ["code"],
          },
        ],
        mark: "bar",
        selection: {
          violationClick: {
            type: "single",
            fields: ["code"],
            clear: "click",
            empty: "all",
            on: "mouseover",
          },
        },
        encoding: {
          x: {
            field: "code",
            type: "ordinal",
            title: "Violation Code",
            axis: {
              labelFontSize: 14,
              titleFontSize: 16,
            },
          },
          y: {
            field: "Total",
            type: "quantitative",
            title: "Total Count",
            axis: {
              labelFontSize: 14,
              titleFontSize: 16,
            },
          },
          color: {
            field: "code",
            type: "nominal",
            scale: { scheme: "tableau20" },
          },
          tooltip: [
            { field: "code", type: "nominal", title: "Code" },
            { field: "Total", type: "quantitative", title: "Total Count" },
          ],
          opacity: {
            condition: { selection: "violationClick", value: 1 },
            value: 0.5,
          },
        },
      },
    ],
  };

  vegaEmbed("#task1_2_2", task1_2_2, { actions: false });
}

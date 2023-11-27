// get the default data
updateData("year");

// control the width and height of canvas by the parent's width and height
const containerWidth = document.getElementById("calendar").offsetWidth;
const containerHeight = document.getElementById("calendar").offsetHeight;

// addEventListener to two selectors
document.addEventListener("DOMContentLoaded", () => {
  const yearSelect = document.getElementById("yearSelect");
  const violationTypeSelect = document.getElementById("violationTypeSelect");

  yearSelect.addEventListener("change", function () {
    updateData("year");
  });

  violationTypeSelect.addEventListener("change", function () {
    updateData("type");
  });
});

async function loadData(type) {
  const year = document.getElementById("yearSelect").value;
  const selectElement = document.getElementById("violationTypeSelect");
  const postYear = {
    year: year,
  };
  if (type == "year") {
    let get_types = await fetch("/data/get_stacked_bar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postYear),
    }).then((response) => response.json());

    let typeArray = [];

    typeArray = Object.keys(get_types[0]).filter((key) => key !== "zip");

    // Clear existing options
    while (selectElement.firstChild) {
      selectElement.removeChild(selectElement.firstChild);
    }

    // Iterate over the violationTypes array
    typeArray.forEach((type) => {
      const optionElement = document.createElement("option");
      optionElement.value = type;
      optionElement.textContent = type;
      selectElement.appendChild(optionElement);
    });
  }

  const violationType = document.getElementById("violationTypeSelect").value;
  const postData = {
    year: year,
    type: violationType,
  };

  let response_calendar = await fetch("/data/get_calendar_by_year_type", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });
  let data = await response_calendar.json();

  return data;
}

async function updateData(type) {
  let data = await loadData(type);
  let task1_1_2 = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "Building violation counts calendar",

    data: {
      values: data,
    },
    hconcat: [
      {
        title: {
          text: "Overview Calendar",
          fontSize: 18,
          anchor: "middle"
        },
        width: containerWidth * 0.5,
        height: containerHeight * 1.5,
        mark: "rect",
        selection: {
          brush: { type: "interval", encoding: ["x"] },
        },
        encoding: {
          x: {
            field: "date",
            type: "ordinal",
            timeUnit: "day",
            axis: {
              title: "Day",
              labelFontSize: 14,
              titleFontSize: 16, 
            },
          },
          y: {
            field: "date",
            type: "ordinal",
            timeUnit: "monthdate",
            axis: {
              title: "Date",
              labelFontSize: 14,
              titleFontSize: 16, 
            },
          },
          color: {
            field: "count",
            type: "quantitative",
            legend: {
              title: "Counts",
            },
          },
          tooltip: [
            { field: "date", type: "temporal", title: "Date" },
            { field: "count", type: "quantitative", title: "Violation Counts" },
          ],
        },
      },
      {
        title: {
          text: "Detailed Calendar",
          fontSize: 18,
          anchor: "middle"
        },
        width: containerWidth * 0.5,
        height: containerHeight * 1.5,
        mark: "rect",
        transform: [
          {
            filter: { selection: "brush" },
          },
        ],
        encoding: {
          x: {
            field: "date",
            type: "ordinal",
            timeUnit: "day",
            axis: {
              title: "Day",
              labelFontSize: 14,
              titleFontSize: 16, 
            },
          },
          y: {
            field: "date",
            type: "ordinal",
            timeUnit: "monthdate",
            axis: {
              title: "Date",
              labelFontSize: 14,
              titleFontSize: 16, 
            },
          },
          color: { field: "count", type: "quantitative" },
          tooltip: [
            { field: "date", type: "temporal", title: "Date" },
            { field: "count", type: "quantitative", title: "Violation Counts" },
          ],
        },
      },
    ],
  };
  vegaEmbed("#task1_1_2", task1_1_2, { actions: false });
}

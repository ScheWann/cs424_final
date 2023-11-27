// get the default data
updateData();

// all Chicago zip code array
// Ensure that all regions in chicago will be displayed
const chicagoZipCodes = [
  "60601",
  "60602",
  "60603",
  "60604",
  "60605",
  "60606",
  "60607",
  "60608",
  "60609",
  "60610",
  "60611",
  "60612",
  "60613",
  "60614",
  "60615",
  "60616",
  "60617",
  "60618",
  "60619",
  "60620",
  "60621",
  "60622",
  "60623",
  "60624",
  "60625",
  "60626",
  "60628",
  "60629",
  "60630",
  "60631",
  "60632",
  "60633",
  "60634",
  "60636",
  "60637",
  "60638",
  "60639",
  "60640",
  "60641",
  "60642",
  "60643",
  "60644",
  "60645",
  "60646",
  "60647",
  "60649",
  "60651",
  "60652",
  "60653",
  "60654",
  "60655",
  "60656",
  "60657",
  "60659",
  "60660",
  "60661",
  "60664",
  "60666",
  "60668",
  "60669",
  "60670",
  "60673",
  "60674",
  "60675",
  "60677",
  "60678",
  "60680",
  "60681",
  "60682",
  "60684",
  "60685",
  "60686",
  "60687",
  "60688",
  "60689",
  "60690",
  "60691",
  "60693",
  "60694",
  "60695",
  "60696",
  "60697",
  "60699",
  "60701",
];

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

  let response_calendar = await fetch("/data/get_data_agg_by_zip", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  let data = await response_calendar.json();

  for (let zip of chicagoZipCodes) {
    if (!data.some((item) => item.zip === zip)) {
      data.push({ zip: zip, count: 0 });
    }
  }

  return data;
}

async function updateData() {
  let countData = await loadData();

  let task1_2_1 = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: 500,
    height: 300,
    data: {
      url: "/data/boundaries-zipcode.geojson",
      format: {
        property: "features",
      },
    },
    transform: [
      {
        lookup: "properties.zip",
        from: {
          data: { values: countData },
          key: "zip",
          fields: ["count"],
        },
      },
      {
        calculate: "datum.properties.zip",
        as: "zip",
      },
    ],
    projection: {
      type: "identity",
      reflectY: true,
    },
    mark: "geoshape",
    encoding: {
      color: {
          field: "count",
          type: "quantitative",
      },
      tooltip: [
        { field: "properties.zip", type: "nominal", title: "Zip" },
        { field: "count", type: "quantitative", title: "Violation Counts" },
      ],
    },
  };

  vegaEmbed("#task1_2_1", task1_2_1, { actions: false })
}

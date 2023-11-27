const containerWidth = document.getElementById('CorrelationIn_Polulation_Crime_Violation').offsetWidth;

async function loadData() {
  let correspond_data = await fetch(
    "/data/correlation_crime_population_counts"
  );
  let data = await correspond_data.json();

  return data;
}

(async () => {
  let data = await loadData();
  
  let task2_1_1 = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description:
      "Violation Building Counts and Personal Income from 2018 to 2023",
    width: containerWidth,
    data: {
      values: data,
    },
    mark: "point",
    encoding: {
      x: {
        field: "Population",
        type: "quantitative",
        title: "Population",
        axis: {
          labelFontSize: 14,
          titleFontSize: 16,
        },
      },
      y: {
        field: "crime_count",
        type: "quantitative",
        title: "Crime Count",
        axis: {
          labelFontSize: 14,
          titleFontSize: 16,
        },
      },
      size: {
        field: "count",
        type: "quantitative",
        title: "Violation Counts",
        scale: {
          zero: true,
        },
        legend: {
          labelFontSize: 14,
          titleFontSize: 16   
        }
      },
      tooltip: [
        { field: "zip", type: "nominal", title: "Zip"},
        { field: "Population", type: "quantitative", title: "Population" },
        { field: "crime_count", type: "quantitative", title: "Crime Count" },
        { field: "count", type: "quantitative", title: "Violation Count" },
      ],
    },
  };

  vegaEmbed("#task2_1_1", task2_1_1, { actions: false });
})();

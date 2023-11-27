# Introduction

> CS424 assignment 4
>
> Teammates: Siyuan Zhao, Alicia Delgado, Konduru Harsha Vardhan, Nadia Taiym  
> Dataset: [Building violations](https://data.cityofchicago.org/Buildings/Building-Violations/22u3-xenr)

<img src="./imgs/screenshots/index.png">

# Requirement

This project uses [Flask](https://flask.palletsprojects.com/en/3.0.x/) to provide data and API.

1. Install and update using [pip](https://pip.pypa.io/en/stable/getting-started/)

2. you'll need Flask and pandas installed:
   ```
   pip install -r requirements.txt
   ```
3. Run the Flask Application:
   ```
   python app.py
   ```
4. Visit http://127.0.0.1:5000/ in your browser

# Description

In this section, the data processing methods, related attributes, and interaction methods of the visual charts for each problem are introduced in detail.

The data folder contains all the data applied in this job. It includes Chicago's crime data 2023, personal income data set in 2023, and the created building violation data set from 2018 to 2023. Take '2018 - withZip.csv' as an example, separated from the building violation data set. The building violation data set in 2018, where the data operations are as follows.

```Python
    # Connected the building violation data in 2018 with the Chicago boundry
    # and get the zipcode to the buildin violation dataset
    df_zip_2018 = df_2018

    geometry = gpd.points_from_xy(df_zip_2018["LONGITUDE"], df_zip_2018["LATITUDE"])
    c_gdf_2018 = gpd.GeoDataFrame(df_zip_2018, crs="EPSG:4326", geometry=geometry)
    c_gdf_2018.set_crs(gdf.crs, inplace=True)

    gdf_joined_2018 = gpd.sjoin(c_gdf_2018, gdf[['geometry', 'zip']], how="left", predicate="within")
    gdf_joined_2018.drop(columns=['index_right'], inplace=True)

    # Deleted all null value in ‘zip’
    gdf_joined_2018.dropna(subset=['zip'], inplace=True)
    gdf_joined_2018['zip'] = gdf_joined_2018['zip'].astype(str).astype(int)
    gdf_joined_2018.info(verbose=True, show_counts=True)
```

## How to know the situation of building violations in Chicago?

### What is the trend of building violations during the last 10 years in Chicago?

**1. Violation Building Counts and Personal Income from 2018 to 2023**

- **Introduction:** The combination of bar and line charts also represents the building violations and average revenue trends from 2018 to 2023.
- **Attributes:** The length of each annual data set, income from 2018 - 2023
- **Visualization type:** Single view visualization
- **Tool:** Vega-Lite
- **Draft:** <img src="./imgs/drafts/Q1-1-1.PNG" />
- **Screenshot:** <img src="./imgs/screenshots/task1_1_1.png" />

**2. Building violation counts calendar**

- **Introduction:** Display calendar graph by selecting year and violation type, by Overview + detail to display daily incentives for violation counts on the selected date.
- **Attributes:** violation date, violation type, violation counts
- **Visualization type:** Linked view visualization(aggregation, filtering, selection)
- **Method:** Display based on year and building violation types selection
- **Tool:** Vega-Lite
- **Draft:** <img src="./imgs/drafts/Q1-1-2.jpeg" />
- **Screenshot:** <img src="./imgs/screenshots/task1_1_2.png" />

### How do we know the violation counts and numbers of violation types in specific districts or neighborhoods?

**1. Building violation distribution in the Chicago**

- **Introduction:** Display the distribution of building violations in the Chicago area from 2018 to 2023 by selecting a year.
- **Attributes:** violation counts, zip
- **Visualization type:** Spatial visualization(aggregation, filtering)
- **Tool:** Vega-Lite
- **Draft:** <img src="./imgs/drafts/Q1-2-1.PNG" />
- **Screenshot:** <img src="./imgs/screenshots/task1_2_1.png" />

**2. Building violation counts in zip**

- **Introduction:** By connecting the selector of the previous graph to display the regional distribution of building violations from 2018 to 2023, and by selecting the first bar graph, the distribution of violation type in the selected zip area is displayed.
- **Attributes:** violation counts, zip, violation type
- **Visualization type:** Linked view visualization(aggregation, filtering, selection)
- **Tool:** Vega-Lite
- **Draft:** <img src="./imgs/drafts/Q1-2-2.PNG" />
- **Screenshot:** <img src="./imgs/screenshots/task1_2_2.png" />

## What is the reason for the situation of distribution of the building violation in Chicago?

### What is the correlation between violations and high-crime areas?

**1. 2023 Correlation of Population, Crime Count and Violation**

- **Introduction:** By aggregating zips, the x-axis is used to display the population of each area, the y-axis is used to display the number of crimes in each area, and the radius is used to display the number of building violations.
- **Attributes:** violation counts, crimes, zip, population
- **Visualization type:** Single view visualization
- **Tool:** Vega-Lite
- **Draft:** <img src="./imgs/drafts/Q2-2-1.jpeg" />
- **Screenshot:** <img src="./imgs/screenshots/task2_1_1.png" />

**2. 2023 Correlation of population and average income in Chicago**

- **Introduction:** The regions of Chicago were aggregated, and linear regression was used to express the relationship between population and the number of building violations.
- **Attributes:** violation counts, income, zip, population
- **Visualization type:** Single view visualization
- **Tool:** Vega-Lite
- **Draft:** <img src="./imgs/drafts/Q2-1-2.jpeg" />
- **Screenshot:** <img src="./imgs/screenshots/task2_1_2.png" />

### What is the correlation between population and building violations?

**1. 2023 Violation distribution in the population Chicago Map**

- **Introduction:** Use D3.js to display the population distribution of Chicago and display the location of building violations on the map. And you can click on the area to enlarge the display.
- **Attributes:** violation counts, zip, population
- **Visualization type:** Spatial visualization(aggregation, zooming)
- **Tool:** D3.js, leaflet.js
- **Draft:** <img src="./imgs/drafts/Q2-2-2.jpeg" />
- **Screenshot:** <img src="./imgs/screenshots/task2_2_1.png" />

### What is the trend of violation types in one year in Chicago?

**1. 2023 Violation count change from January to December**

- **Introduction:** By connecting with the previous Chicago map, click on the area on the map to display the trends of each building type in the corresponding area throughout 2023.
- **Attributes:** violation counts, zip, violation type
- **Visualization type:** Linked view visualization(filtering)
- **Tool:** D3.js
- **Draft:** <img src="./imgs/drafts/Q2-3-2.jpeg" />
- **Screenshot:** <img src="./imgs/screenshots/task2_3_1.png" /><img src="./imgs/screenshots/task2_3_1(1).png" />

### Is there a relationship between the violation counts and property groups?

**1. 2023 Correlation of violation counts and property groups(1)**

- **Introduction:** Use D3.js to draw a radial stacked bar chart and aggregate violation types and contractors. Select January to August to display contractors who account for 99.5% of building violations.
- **Attributes:** violation counts, violation group, violation type
- **Visualization type:** Linked view visualization(aggregation, filtering)
- **Tool:** D3.js
- **Draft:** <img src="./imgs/drafts/Q2-4-1.jpeg" />
- **Screenshot:** <img src="./imgs/screenshots/task2_4_1(1).png" />

**2. 2023 Correlation of violation counts and property groups(2)**

- **Introduction:** Use a bar chart to display the top seven contractors with the largest share in 2023. This is also a rethinking of the sketch in Assignment2, by using a bar chart to visually display the relationship between the number of building violations and the contractor.
- **Attributes:** violation counts, violation group
- **Visualization type:** Single view visualization
- **Tool:** Vega-lite
- **Draft:** <img src="./imgs/drafts/Q2-4-1(1).png" />
- **Screenshot:** <img src="./imgs/screenshots/task2_4_1.png" />

## What influence has been brought because of the building violation?

### What are the changes in income in the highest building violation district?

**1. Highest Violation Building Counts district and income from 2018 to 2023**

- **Introduction:** Shows the building violations in area 60620 (the area with the largest number of building violations) from 2018 to 2023 and the trend of average income in the area
- **Attributes:** violation counts, income, zip
- **Visualization type:** linked view visualization
- **Tool:** D3.js
- **Draft:** <img src="./imgs/drafts/Q3-1-1.jpeg" />
- **Screenshot:** <img src="./imgs/screenshots/task3_1_1.png" />

**2. Income in the highest building violation district and lowest building violation district**

- **Introduction:** Shows the building violations in area 60620 (the area with the largest number of building violations) and area 60602 (the area with the smallest number of building violations) from 2018 to 2023 and the trend of average income in the area
- **Attributes:** violation counts, income, zip
- **Visualization type:** Single view visualization
- **Tool:** Vega-Lite
- **Draft:** <img src="./imgs/drafts/Q3-1-2.jpeg" />
- **Screenshot:** <img src="./imgs/screenshots/task3_1_2.png" />

## Did 311 Complaints reduce the behavior of building violations?

### What is the trend of solving rate and building violations before and after 311 Complaints 10 years?

**1.Solution rates by years**

- **Introduction:** Stacked bar chart and line chart showing each violation status and resolution rate(complied/no entry + open) from 2018 to 2023
- **Attributes:** violation counts, violation status
- **Visualization type:** Single view visualization
- **Tool:** Vega-Lite
- **Draft:** <img src="./imgs/drafts/Q4-1-1.jpeg" />
- **Screenshot:** <img src="./imgs/screenshots/task4_1_1.png" />

**2. Income in the highest building violation district and lowest building violation district**

- **Introduction:** A custom matrix displayed by combining the resolution rate and the number of building violations. This matrix divides the area into four parts, low violation counts-low rate(no impact), high violation counts-low rate(negative effects), high violation counts-high rate(neutral effects), low violation counts-high rate(positive effects). Use the four different situations to justify the effect after 311 complaints come in.
- **Attributes:** violation counts, violation status
- **Visualization type:** Single view visualization
- **Tool:** D3.js
- **Draft:** <img src="./imgs/drafts/Q4-1-2.jpeg" />
- **Screenshot:** <img src="./imgs/screenshots/task4_1_2.png" />

from flask import Flask, jsonify, render_template, request, send_from_directory
import pandas as pd
from process import (
    get_data_2018,
    get_data_2019,
    get_data_2020,
    get_data_2021,
    get_data_2022,
    get_data_2023,
    get_data_income,
    get_data_crimes,
    get_summary,
    get_calendar_by_year_type,
    get_data_agg_by_zip,
    get_stacked_bar,
    get_correlation_in_population_Crime_counts,
    get_linear_regression,
    get_Violation_Count_by_Month,
    get_group_bar_chart,
    get_radial_bar_chart,
    get_rates_by_years,
    get_Matrix_Heatmap,
    get_Highest_Area_Income_And_Violation,
    get_Comparation_Between_lowest_Area_And_Highest_Area
)

app = Flask(__name__)


# API
@app.route("/data/2018", methods=["GET"])
def get_data_2018_route():
    return jsonify(get_data_2018().to_dict(orient="records"))


@app.route("/data/2019", methods=["GET"])
def get_data_2019_route():
    return jsonify(get_data_2019().to_dict(orient="records"))


@app.route("/data/2020", methods=["GET"])
def get_data_2020_route():
    return jsonify(get_data_2020().to_dict(orient="records"))


@app.route("/data/2021", methods=["GET"])
def get_data_2021_route():
    return jsonify(get_data_2021().to_dict(orient="records"))


@app.route("/data/2022", methods=["GET"])
def get_data_2022_route():
    return jsonify(get_data_2022().to_dict(orient="records"))


@app.route("/data/2023", methods=["GET"])
def get_data_2023_route():
    return jsonify(get_data_2023().to_dict(orient="records"))


@app.route("/data/income", methods=["GET"])
def get_data_income_route():
    return jsonify(get_data_income().to_dict(orient="records"))


@app.route("/data/crimes", methods=["GET"])
def get_data_crimes_route():
    return jsonify(get_data_crimes().to_dict(orient="records"))


@app.route("/data/summary", methods=["GET"])
def get_summary_route():
    return jsonify(get_summary().to_dict(orient="records"))


@app.route("/data/correlation_crime_population_counts", methods=["GET"])
def get_correlation_crime_population_counts_route():
    return jsonify(
        get_correlation_in_population_Crime_counts().to_dict(orient="records")
    )


@app.route("/data/get_correlation", methods=["GET"])
def get_linear_regression_route():
    return jsonify(get_linear_regression().to_dict(orient="records"))


@app.route("/data/get_group_bar_chart", methods=["GET"])
def get_group_bar_chart_route():
    return jsonify(get_group_bar_chart().to_dict(orient="records"))


@app.route("/data/get_rates_by_years", methods=["GET"])
def get_rates_by_years_route():
    return jsonify(get_rates_by_years().to_dict(orient="records"))


@app.route("/data/get_Matrix_Heatmap", methods=["GET"])
def get_Matrix_Heatmap_route():
    return jsonify(get_Matrix_Heatmap().to_dict(orient="records"))


@app.route("/data/get_Highest_Area_Income_And_Violation", methods=["GET"])
def get_Highest_Area_Income_And_Violation_route():
    return jsonify(get_Highest_Area_Income_And_Violation())


@app.route("/data/get_Comparation_Between_lowest_Area_And_Highest_Area", methods=["GET"])
def get_Comparation_Between_lowest_Area_And_Highest_Area_route():
    return jsonify(get_Comparation_Between_lowest_Area_And_Highest_Area().to_dict(orient="records"))


@app.route("/data/get_calendar_by_year_type", methods=["POST"])
def get_calendar_by_year_type_route():
    year = request.json.get("year")
    violation_type = request.json.get("type")
    return jsonify(
        get_calendar_by_year_type(year, violation_type).to_dict(orient="records")
    )


@app.route("/data/get_radial_bar_chart", methods=["POST"])
def get_radial_bar_chart_route():
    month = request.json.get('month')
    return jsonify(get_radial_bar_chart(month).to_dict(orient="records"))


@app.route("/data/get_data_agg_by_zip", methods=["POST"])
def get_data_agg_by_zip_route():
    year = request.json.get("year")
    return jsonify(get_data_agg_by_zip(year).to_dict(orient="records"))


@app.route("/data/get_stacked_bar", methods=["POST"])
def get_stacked_bar_route():
    year = request.json.get("year")
    return jsonify(get_stacked_bar(year).to_dict(orient="records"))


@app.route("/data/get_Violation_Count_by_Month", methods=["POST"])
def get_Violation_Count_by_Month_route():
    zip = request.json.get("zip")
    return jsonify(get_Violation_Count_by_Month(zip).to_dict(orient="records"))


@app.route("/data/<filename>")
def serve_map(filename):
    return send_from_directory("data", filename)


# routes
@app.route("/")
def index():
    return render_template("task1.html")


@app.route("/task1")
def task1():
    return render_template("task1.html")


@app.route("/task2")
def task2():
    return render_template("task2.html")


@app.route("/task3")
def task3():
    return render_template("task3.html")


@app.route("/task4")
def task4():
    return render_template("task4.html")


if __name__ == "__main__":
    app.run(debug=True)

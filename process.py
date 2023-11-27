import pandas as pd
import numpy as np

# read csv files
df_2018 = pd.read_csv("./data/2018_withZip.csv")
df_2019 = pd.read_csv("./data/2019_withZip.csv")
df_2020 = pd.read_csv("./data/2020_withZip.csv")
df_2021 = pd.read_csv("./data/2021_withZip.csv")
df_2022 = pd.read_csv("./data/2022_withZip.csv")
df_2023 = pd.read_csv("./data/2023_withZip.csv")
df_income = pd.read_csv("./data/Chicago_income.csv")
df_crimes = pd.read_csv("./data/Chicago_crimes.csv")
df_com = pd.read_csv("./data/Chicago_community.csv")

df_311_2018 = df_2018.groupby(["VIOLATION STATUS"]).size().reset_index(name="2018")
df_311_2019 = df_2019.groupby(["VIOLATION STATUS"]).size().reset_index(name="2019")
df_311_2020 = df_2020.groupby(["VIOLATION STATUS"]).size().reset_index(name="2020")
df_311_2021 = df_2021.groupby(["VIOLATION STATUS"]).size().reset_index(name="2021")
df_311_2022 = df_2022.groupby(["VIOLATION STATUS"]).size().reset_index(name="2022")
df_311_2023 = df_2023.groupby(["VIOLATION STATUS"]).size().reset_index(name="2023")

YEAR_DF_MAP = {
    "2018": df_2018,
    "2019": df_2019,
    "2020": df_2020,
    "2021": df_2021,
    "2022": df_2022,
    "2023": df_2023,
}

months = {
    "January": "01",
    "February": "02",
    "March": "03",
    "April": "04",
    "May": "05",
    "June": "06",
    "July": "07",
    "August": "08",
    "September": "09",
    "October": "10",
    "November": "11",
    "December": "12",
}


def get_data_2018():
    return df_2018


def get_data_2019():
    return df_2019


def get_data_2020():
    return df_2020


def get_data_2021():
    return df_2021


def get_data_2022():
    return df_2022


def get_data_2023():
    return df_2023


def get_data_income():
    return df_income


def get_data_crimes():
    return df_crimes


# get the total violation counts from 2018-2023
def get_summary():
    dfs = [df_2018, df_2019, df_2020, df_2021, df_2022, df_2023]
    lengths = [len(df) for df in dfs]
    years = [2018, 2019, 2020, 2021, 2022, 2023]
    summary_df = pd.DataFrame({"Year": years, "Counts": lengths})
    return summary_df


def get_data_agg_by_zip(year):
    if year not in YEAR_DF_MAP:
        raise ValueError("Invalid year provided.")
    return aggregate_data_by_zip(YEAR_DF_MAP[year])


def get_stacked_bar(year):
    if year not in YEAR_DF_MAP:
        raise ValueError("Invalid year provided.")
    return aggregate_stacked_bar(YEAR_DF_MAP[year])


def get_calendar_by_year_type(year, type):
    if year not in YEAR_DF_MAP:
        raise ValueError("Invalid year and type provided.")
    return aggregate_data_by_year_and_type(YEAR_DF_MAP[year], type)


def aggregate_data_by_year_and_type(df, type):
    df_aggregated = df[["VIOLATION CODE", "VIOLATION DATE"]].copy()
    df_aggregated["VIOLATION CODE"] = df_aggregated["VIOLATION CODE"].str.slice(0, 2)
    df_aggregated = df_aggregated[df_aggregated["VIOLATION CODE"] == type]
    df_aggregated = (
        df_aggregated.groupby(["VIOLATION DATE"]).size().reset_index(name="count")
    )
    df_aggregated = df_aggregated.rename(columns={"VIOLATION DATE": "date"})
    return df_aggregated


def aggregate_data_by_zip(df):
    df_aggregated = df.copy()
    df_aggregated["zip"] = df_aggregated["zip"].astype(str)
    df_aggregated = df_aggregated.groupby(["zip"]).size().reset_index(name="count")
    return df_aggregated


def aggregate_stacked_bar(df):
    df_aggregated = df[["zip", "VIOLATION CODE"]].copy()
    df_aggregated.loc[:, "VIOLATION CODE"] = df_aggregated["VIOLATION CODE"].str.slice(
        0, 2
    )
    df_aggregated = (
        df_aggregated.groupby(["zip", "VIOLATION CODE"])
        .size()
        .reset_index(name="count")
    )
    pivot_df = df_aggregated.pivot(
        index="zip", columns="VIOLATION CODE", values="count"
    ).fillna(0)
    pivot_df = pivot_df.reset_index()
    pivot_df["zip"] = pivot_df["zip"].astype(str)
    return pivot_df


def get_correlation_in_population_Crime_counts():
    df_population_income = (
        df_2023.groupby(["zip"]).size().reset_index(name="count").copy()
    )
    df_agg_population = df_com[["Population", "Average Income", "ZipCode"]].copy()
    df_agg_population = df_agg_population.rename(columns={"ZipCode": "zip"})
    df_population_income = pd.merge(
        df_agg_population, df_population_income, how="inner", on="zip"
    )
    df_cpi = df_crimes.groupby(["zip"]).size().reset_index(name="crime_count")
    df_cpi = pd.merge(df_population_income, df_cpi, how="inner", on="zip")
    return df_cpi


def get_linear_regression():
    df_population_income = (
        df_2023.groupby(["zip"]).size().reset_index(name="count").copy()
    )
    df_agg_population = df_com[["Population", "Average Income", "ZipCode"]].copy()
    df_agg_population = df_agg_population.rename(columns={"ZipCode": "zip"})
    df_population_income = pd.merge(
        df_agg_population, df_population_income, how="inner", on="zip"
    )
    return df_population_income


def get_Violation_Count_by_Month(zip):
    df_2023_trend = df_2023[["VIOLATION CODE", "VIOLATION DATE", "zip"]].copy()
    df_2023_trend.loc[:, "VIOLATION CODE"] = df_2023_trend["VIOLATION CODE"].str.slice(
        0, 2
    )
    df_2023_trend = df_2023_trend[df_2023_trend["zip"] == zip]

    # Convert 'VIOLATION DATE' column to datetime type
    df_2023_trend["VIOLATION DATE"] = pd.to_datetime(df_2023_trend["VIOLATION DATE"])

    df_2023_trend_by_type_month = (
        df_2023_trend.groupby(["VIOLATION DATE", "VIOLATION CODE"])
        .size()
        .reset_index(name="count")
    )

    df_2023_trend_by_type_month["Month"] = df_2023_trend_by_type_month[
        "VIOLATION DATE"
    ].dt.month
    df_2023_trend_by_type_grouped = (
        df_2023_trend_by_type_month.groupby(["Month", "VIOLATION CODE"])["count"]
        .sum()
        .reset_index()
    )
    df_2023_trend_by_type_grouped_pivot = df_2023_trend_by_type_grouped.pivot(
        index="Month", columns="VIOLATION CODE", values="count"
    )
    df_2023_trend_by_type_grouped_pivot.fillna(0, inplace=True)
    df_2023_trend_by_type_grouped_pivot = (
        df_2023_trend_by_type_grouped_pivot.reset_index()
    )
    return df_2023_trend_by_type_grouped_pivot


def get_group_bar_chart():
    df_group = df_2023.copy()
    df_group.loc[:, "VIOLATION CODE"] = df_group["VIOLATION CODE"].str.slice(0, 2)
    df_group = (
        df_group.groupby(["PROPERTY GROUP", "VIOLATION CODE"])
        .size()
        .reset_index(name="count")
    )
    avg_count = df_group["count"].mean()
    filtered_group_df = df_group[df_group["count"] > avg_count * 10]
    return filtered_group_df


def get_radial_bar_chart(month_name):
    df_group_radial = df_2023.copy()
    df_group_radial["VIOLATION DATE"] = pd.to_datetime(
        df_group_radial["VIOLATION DATE"]
    )

    month_number = months.get(month_name.title())
    if not month_number:
        raise ValueError(f"Invalid month name: {month_name}")

    df_group_radial_month = df_group_radial[
        df_group_radial["VIOLATION DATE"].dt.month == int(month_number)
    ]

    df_group_radial_month.loc[:, "VIOLATION CODE"] = df_group_radial_month[
        "VIOLATION CODE"
    ].str.slice(0, 2)

    df_group_radial_month = (
        df_group_radial_month.groupby(["PROPERTY GROUP", "VIOLATION CODE"])
        .size()
        .reset_index(name="count")
    )

    df_group_radial_month = df_group_radial_month.rename(
        columns={"VIOLATION CODE": "code", "PROPERTY GROUP": "group"}
    )

    standard_count = df_group_radial_month["count"].quantile(0.995)

    filtered_group_df = df_group_radial_month[
        df_group_radial_month["count"] >= standard_count
    ]
    return filtered_group_df


def get_rates_by_years():
    df_311 = (
        df_311_2018.merge(df_311_2019, on="VIOLATION STATUS")
        .merge(df_311_2020, on="VIOLATION STATUS")
        .merge(df_311_2021, on="VIOLATION STATUS")
        .merge(df_311_2022, on="VIOLATION STATUS")
        .merge(df_311_2023, on="VIOLATION STATUS")
    )
    return df_311


def get_Matrix_Heatmap():
    df_311 = (
        df_311_2018.merge(df_311_2019, on="VIOLATION STATUS")
        .merge(df_311_2020, on="VIOLATION STATUS")
        .merge(df_311_2021, on="VIOLATION STATUS")
        .merge(df_311_2022, on="VIOLATION STATUS")
        .merge(df_311_2023, on="VIOLATION STATUS")
    )
    df_melted = df_311.melt(
        id_vars="VIOLATION STATUS", var_name="YEAR", value_name="COUNT"
    )
    df_converted = df_melted.pivot(
        index="YEAR", columns="VIOLATION STATUS", values="COUNT"
    )

    # Remove the columns' name
    df_converted.columns.name = None
    df_converted = df_converted.reset_index()
    df_converted["RATIO"] = (
        df_converted["COMPLIED"]
        / (df_converted["NO ENTRY"] + df_converted["OPEN"])
        * 100
    )

    # deleted the digits after the dot
    df_converted["RATIO"] = df_converted["RATIO"].astype(int)
    df_converted["TOTAL"] = (
        df_converted["COMPLIED"] + df_converted["NO ENTRY"] + df_converted["OPEN"]
    )
    choices = [1, 2, 3, 4]  # Quadrant numbers
    conditions = [
        (df_converted["TOTAL"] >= df_converted["TOTAL"].mean())
        & (df_converted["RATIO"] >= df_converted["RATIO"].mean()),  # top-right
        (df_converted["TOTAL"] < df_converted["TOTAL"].mean())
        & (df_converted["RATIO"] >= df_converted["RATIO"].mean()),  # top-left
        (df_converted["TOTAL"] < df_converted["TOTAL"].mean())
        & (df_converted["RATIO"] < df_converted["RATIO"].mean()),  # bottom-left
        (df_converted["TOTAL"] >= df_converted["TOTAL"].mean())
        & (df_converted["RATIO"] < df_converted["RATIO"].mean()),  # bottom-right
    ]

    df_converted["Quadrant"] = np.select(conditions, choices, default=0)
    return df_converted


def get_Highest_Area_Income_And_Violation():
    years = ["2018", "2019", "2020", "2021", "2022", "2023"]
    df_60620_2018 = df_2018[df_2018["zip"] == 60620]
    df_60620_2019 = df_2019[df_2019["zip"] == 60620]
    df_60620_2020 = df_2020[df_2020["zip"] == 60620]
    df_60620_2021 = df_2021[df_2021["zip"] == 60620]
    df_60620_2022 = df_2022[df_2022["zip"] == 60620]
    df_60620_2023 = df_2023[df_2023["zip"] == 60620]
    counts = [
        len(df_60620_2018),
        len(df_60620_2019),
        len(df_60620_2020),
        len(df_60620_2021),
        len(df_60620_2022),
        len(df_60620_2023),
    ]
    df_income_highest = df_income.copy()
    income = (df_income_highest["60620"] / 12).tolist()
    result = [
        {"year": int(year), "income": inc, "violation": count}
        for year, inc, count in zip(years, income, counts)
    ]
    return result


def get_Comparation_Between_lowest_Area_And_Highest_Area():
    # '60620' is the highest building violation counts area, '60602' is the lowest building violation counts area

    df_60620_60602_2018 = df_2018[(df_2018["zip"] == 60620) | (df_2018["zip"] == 60602)]
    df_60620_60602_2019 = df_2019[(df_2019["zip"] == 60620) | (df_2019["zip"] == 60602)]
    df_60620_60602_2020 = df_2020[(df_2020["zip"] == 60620) | (df_2020["zip"] == 60602)]
    df_60620_60602_2021 = df_2021[(df_2021["zip"] == 60620) | (df_2021["zip"] == 60602)]
    df_60620_60602_2022 = df_2022[(df_2022["zip"] == 60620) | (df_2022["zip"] == 60602)]
    df_60620_60602_2023 = df_2023[(df_2023["zip"] == 60620) | (df_2023["zip"] == 60602)]

    df_agg_by_60620_60602_2018 = (
        df_60620_60602_2018.groupby(["zip"]).size().reset_index(name="2018")
    )
    df_agg_by_60620_60602_2019 = (
        df_60620_60602_2019.groupby(["zip"]).size().reset_index(name="2019")
    )
    df_agg_by_60620_60602_2020 = (
        df_60620_60602_2020.groupby(["zip"]).size().reset_index(name="2020")
    )
    df_agg_by_60620_60602_2021 = (
        df_60620_60602_2021.groupby(["zip"]).size().reset_index(name="2021")
    )
    df_agg_by_60620_60602_2022 = (
        df_60620_60602_2022.groupby(["zip"]).size().reset_index(name="2022")
    )
    df_agg_by_60620_60602_2023 = (
        df_60620_60602_2023.groupby(["zip"]).size().reset_index(name="2023")
    )

    dfs = [
        df_agg_by_60620_60602_2018.copy(),
        df_agg_by_60620_60602_2019.copy(),
        df_agg_by_60620_60602_2020.copy(),
        df_agg_by_60620_60602_2021.copy(),
        df_agg_by_60620_60602_2022.copy(),
        df_agg_by_60620_60602_2023.copy(),
    ]
    for df in dfs:
        df.set_index("zip", inplace=True)

    df_all_years = pd.concat(dfs, axis=1).reset_index()
    df_income_comparation = df_income.copy()
    income_60620 = (df_income_comparation["60620"] / 12).tolist()
    income_60602 = (df_income_comparation["60602"] / 12).tolist()

    # add the income data
    df_income_60602 = pd.DataFrame(
        {"zip": [60602] * 6, "year": list(range(2018, 2024)), "income": income_60602}
    )
    df_income_60620 = pd.DataFrame(
        {"zip": [60620] * 6, "year": list(range(2018, 2024)), "income": income_60620}
    )
    df_income_low_and_high = pd.concat([df_income_60602, df_income_60620])

    # melt the df_all_years dataframe to have 'zip', 'year', and 'counts' columns
    df_melted_comparation = df_all_years.melt(
        id_vars="zip", var_name="year", value_name="counts"
    )

    # convert 'year' column to int for merging
    df_melted_comparation["year"] = df_melted_comparation["year"].astype(int)

    # merge df_melted and df_income on ['zip', 'year']
    df_final = pd.merge(
        df_melted_comparation, df_income_low_and_high, on=["zip", "year"], how="left"
    )

    return df_final

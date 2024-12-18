import matplotlib.pyplot as plt
import os

# Ensure the reports directory exists
REPORTS_DIR = "reports"
os.makedirs(REPORTS_DIR, exist_ok=True)

def generate_graph(graph_type: str, data: dict, save_dir=REPORTS_DIR):
    """ Generate various financial graphs based on graph_type and data """
    save_path = os.path.join(save_dir, f"{graph_type}.png")

    try:
        if graph_type == "net_debt":
            years = data["years"]
            net_debt = data["net_debt"]
            plt.figure(figsize=(8, 5))
            plt.plot(years, net_debt, marker='o', color='blue')
            plt.title("Net Debt Over Time")
            plt.xlabel("Year")
            plt.ylabel("Net Debt (Billions CAD)")
            plt.grid()
            plt.savefig(save_path)
            plt.close()

        elif graph_type == "gdp_growth":
            years = data["years"]
            gdp_growth = data["gdp_growth"]
            plt.figure(figsize=(8, 5))
            plt.plot(years, gdp_growth, marker='o', color='green')
            plt.title("GDP Growth Rate")
            plt.xlabel("Year")
            plt.ylabel("GDP Growth (%)")
            plt.grid()
            plt.savefig(save_path)
            plt.close()

        elif graph_type == "inflation_rate":
            months = data["months"]
            inflation = data["inflation_rate"]
            plt.figure(figsize=(8, 5))
            plt.plot(months, inflation, marker='o', color='red')
            plt.title("Inflation Rate")
            plt.xlabel("Month")
            plt.ylabel("Inflation (%)")
            plt.grid()
            plt.savefig(save_path)
            plt.close()

        elif graph_type == "employment_growth":
            years = data["years"]
            employment = data["employment_growth"]
            plt.figure(figsize=(8, 5))
            plt.bar(years, employment, color='purple')
            plt.title("Employment Growth Rate")
            plt.xlabel("Year")
            plt.ylabel("Employment Growth (%)")
            plt.grid(axis='y')
            plt.savefig(save_path)
            plt.close()

        elif graph_type == "interest_payments":
            years = data["years"]
            interest = data["interest"]
            plt.figure(figsize=(8, 5))
            plt.bar(years, interest, color='orange')
            plt.title("Interest Payments Over Time")
            plt.xlabel("Year")
            plt.ylabel("Interest (Billions CAD)")
            plt.grid(axis='y')
            plt.savefig(save_path)
            plt.close()

        elif graph_type == "debt_to_gdp":
            years = data["years"]
            debt_to_gdp = data["debt_to_gdp"]
            plt.figure(figsize=(8, 5))
            plt.plot(years, debt_to_gdp, marker='o', color='cyan')
            plt.title("Debt-to-GDP Ratio")
            plt.xlabel("Year")
            plt.ylabel("Debt-to-GDP (%)")
            plt.grid()
            plt.savefig(save_path)
            plt.close()

        elif graph_type == "program_spending":
            sectors = data["sectors"]
            spending = data["spending"]
            plt.figure(figsize=(8, 5))
            plt.bar(sectors, spending, color='lightblue')
            plt.title("Program-Specific Spending")
            plt.xlabel("Sector")
            plt.ylabel("Spending (Billions CAD)")
            plt.grid(axis='y')
            plt.savefig(save_path)
            plt.close()

        else:
            raise ValueError(f"Unsupported graph type: {graph_type}")

        print(f"Generated graph: {save_path}")
        return save_path

    except Exception as e:
        print(f"Error generating graph {graph_type}: {e}")
        raise Exception(f"Graph generation failed for {graph_type}")

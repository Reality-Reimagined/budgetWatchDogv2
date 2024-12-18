from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware  # Add CORS middleware
from models.inputs import ReportRequest
from models.outputs import ReportOutput
from services.data_fetcher import DataFetcher
from services.graph_generator import generate_graph
from services.report_builder import generate_markdown_report
from services.cache_manager import CacheManager
from fastapi_cache.decorator import cache
import os
import openai
from groq import Groq

# Initialize FastAPI
app = FastAPI(title="Canadian Financial Watchdog API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Redis Cache on startup
@app.on_event("startup")
async def startup():
    CacheManager.initialize_cache()

# Initialize AI Clients
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
openai.api_key = OPENAI_API_KEY

def get_ai_client():
    if OPENAI_API_KEY:
        return "openai"
    elif GROQ_API_KEY:
        return Groq(api_key=GROQ_API_KEY)
    else:
        raise ValueError("No AI API key found. Set OPENAI_API_KEY or GROQ_API_KEY in the environment.")

# Generate Full Financial Report
@app.post("/generate-report", response_model=ReportOutput)
@cache(expire=1800)  # Cache for 30 minutes
async def generate_financial_report(request: ReportRequest):
    try:
        # Fetch financial and economic data
        budget_data = DataFetcher.get_budget_data(request.government_level, request.province)
        gdp_data = DataFetcher.fetch_economic_data("gdp_growth")
        inflation_data = DataFetcher.fetch_economic_data("inflation_rate")
        employment_data = DataFetcher.fetch_economic_data("employment_growth")
        debt_to_gdp_data = DataFetcher.fetch_economic_data("debt_to_gdp")
        bond_yields_data = DataFetcher.fetch_economic_data("bond_yields")

        # Determine AI client
        ai_client = get_ai_client()
        if ai_client == "openai":
            report_content = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a financial analyst generating an in-depth financial report."},
                    {"role": "user", "content": f"Generate a financial report analyzing budget data, GDP growth, inflation rates, employment trends, debt-to-GDP ratios, and bond yields for {request.government_level} - {request.province or 'Canada'}."}
                ]
            )["choices"][0]["message"]["content"]
        else:
            client = Groq(api_key=GROQ_API_KEY)
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are a financial analyst generating an in-depth financial report."},
                    {"role": "user", "content": f"Generate a financial report analyzing budget data, GDP growth, inflation rates, employment trends, debt-to-GDP ratios, and bond yields for {request.government_level} - {request.province or 'Canada'}."}
                ]
            )
            report_content = response.choices[0].message.content

        # Generate graphs with absolute URLs
        base_url = "https://budgetwatchdog-production.up.railway.app"
        graphs = [
            f"{base_url}{generate_graph('net_debt', {'years': budget_data['years'], 'net_debt': budget_data['net_debt']})}",
            f"{base_url}{generate_graph('gdp_growth', {'years': gdp_data['years'], 'gdp_growth': gdp_data['values']})}",
            f"{base_url}{generate_graph('inflation_rate', {'months': inflation_data['months'], 'inflation_rate': inflation_data['values']})}",
            f"{base_url}{generate_graph('employment_growth', {'years': employment_data['years'], 'employment_growth': employment_data['values']})}",
            f"{base_url}{generate_graph('debt_to_gdp', {'years': debt_to_gdp_data['years'], 'debt_to_gdp': debt_to_gdp_data['values']})}",
            f"{base_url}{generate_graph('bond_yields', {'years': bond_yields_data['years'], 'yields': bond_yields_data['values']})}",
        ]

        # Generate tables
        tables = [
            {
                "Fiscal Year": year,
                "Revenue": f"{budget_data['revenue'][i]}B",
                "Expenses": f"{budget_data['expenses'][i]}B",
                "Surplus/Deficit": f"{budget_data['deficit'][i]}B"
            } for i, year in enumerate(budget_data["years"])
        ]

        # Generate Markdown report
        report_file = generate_markdown_report(
            {
                "report_title": f"Financial Report: {request.government_level} - {request.province or 'Canada'}",
                "report_content": report_content,
                "user_name": request.user_name,
                "company_email": request.company_email,
            },
            graphs, tables
        )

        # Return with absolute URL for report file
        return ReportOutput(
            file_path=f"{base_url}/reports/{os.path.basename(report_file)}",
            graphs=graphs,
            tables=tables
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# API Data Details Endpoint
@app.get("/api/data")
@cache(expire=1800)  # Cache for 30 minutes
async def get_api_data(
    government_level: str = Query(..., description="Province or Federal"),
    province: str = Query(None, description="Specify province if applicable"),
    metric: str = Query(..., description="Specify the metric to fetch (gdp_growth, inflation_rate, employment_growth, debt_to_gdp, bond_yields)")
):
    try:
        data = DataFetcher.fetch_economic_data(metric)
        return {"metric": metric, "data": data}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
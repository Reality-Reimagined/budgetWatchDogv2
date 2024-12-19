from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.responses import JSONResponse
from models.inputs import ReportRequest
from models.outputs import ReportOutput
from services.data_fetcher import DataFetcher
from services.graph_generator import generate_graph
from services.report_builder import generate_markdown_report
from services.cache_manager import CacheManager
from utils.validation import DataFilter, DateRangeFilter
from utils.pagination import PaginationParams, PaginatedResponse
from utils.errors import BaseAPIError, DatabaseError
from typing import Optional, Dict, Any
import os
import openai
from groq import Groq

# Initialize FastAPI
app = FastAPI(title="Canadian Financial Watchdog API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

# Custom OpenAPI schema
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title="Canadian Financial Watchdog API",
        version="1.0.0",
        description="API for generating financial reports and analyzing Canadian government financial data",
        routes=app.routes,
    )
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

@app.exception_handler(BaseAPIError)
async def api_error_handler(request, exc: BaseAPIError):
    return JSONResponse(
        status_code=exc.status_code,
        content=exc.detail
    )

@app.post(
    "/generate-report",
    response_model=ReportOutput,
    responses={
        400: {"description": "Invalid request parameters"},
        500: {"description": "Internal server error"}
    }
)
async def generate_financial_report(
    request: ReportRequest,
    filter_params: DataFilter = Depends(),
    pagination: PaginationParams = Depends()
):
    try:
        # Fetch paginated financial and economic data
        budget_data = await DataFetcher.get_budget_data(filter_params, pagination)
        gdp_data = await DataFetcher.fetch_economic_data("gdp_growth", filter_params, pagination)
        inflation_data = await DataFetcher.fetch_economic_data("inflation_rate", filter_params, pagination)
        employment_data = await DataFetcher.fetch_economic_data("employment_growth", filter_params, pagination)
        debt_to_gdp_data = await DataFetcher.fetch_economic_data("debt_to_gdp", filter_params, pagination)
        bond_yields_data = await DataFetcher.fetch_economic_data("bond_yields", filter_params, pagination)

        # Generate AI report content
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
            f"{base_url}{generate_graph('net_debt', {'years': budget_data.items[0]['years'], 'net_debt': budget_data.items[0]['net_debt']})}",
            f"{base_url}{generate_graph('gdp_growth', {'years': gdp_data.items[0]['years'], 'gdp_growth': gdp_data.items[0]['values']})}",
            f"{base_url}{generate_graph('inflation_rate', {'months': inflation_data.items[0]['months'], 'inflation_rate': inflation_data.items[0]['values']})}",
            f"{base_url}{generate_graph('employment_growth', {'years': employment_data.items[0]['years'], 'employment_growth': employment_data.items[0]['values']})}",
            f"{base_url}{generate_graph('debt_to_gdp', {'years': debt_to_gdp_data.items[0]['years'], 'debt_to_gdp': debt_to_gdp_data.items[0]['values']})}",
            f"{base_url}{generate_graph('bond_yields', {'years': bond_yields_data.items[0]['years'], 'yields': bond_yields_data.items[0]['values']})}",
        ]

        # Generate tables
        tables = [
            {
                "Fiscal Year": year,
                "Revenue": f"{budget_data.items[0]['revenue'][i]}B",
                "Expenses": f"{budget_data.items[0]['expenses'][i]}B",
                "Surplus/Deficit": f"{budget_data.items[0]['deficit'][i]}B"
            } for i, year in enumerate(budget_data.items[0]["years"])
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

        return ReportOutput(
            file_path=f"{base_url}/reports/{os.path.basename(report_file)}",
            graphs=graphs,
            tables=tables
        )

    except Exception as e:
        raise DatabaseError(
            message="Failed to generate report",
            details={"error": str(e)}
        )

@app.get(
    "/api/data",
    response_model=PaginatedResponse,
    responses={
        400: {"description": "Invalid request parameters"},
        404: {"description": "Data not found"},
        500: {"description": "Internal server error"}
    }
)
async def get_api_data(
    government_level: str = Query(..., description="Province or Federal"),
    province: Optional[str] = Query(None, description="Specify province if applicable"),
    metric: str = Query(..., description="Specify the metric to fetch"),
    filter_params: DataFilter = Depends(),
    pagination: PaginationParams = Depends()
):
    try:
        # Update filter params with query parameters
        filter_params.government_level = government_level
        filter_params.province = province
        filter_params.metric = metric

        return await DataFetcher.fetch_economic_data(
            metric,
            filter_params,
            pagination
        )
    except Exception as e:
        raise DatabaseError(
            message="Failed to fetch data",
            details={"error": str(e)}
        )
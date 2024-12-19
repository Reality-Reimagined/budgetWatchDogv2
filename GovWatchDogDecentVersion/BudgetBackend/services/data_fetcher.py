import requests
from typing import Dict, Any, Optional, List
from fastapi import HTTPException
from utils.errors import DataNotFoundError, DatabaseError
from utils.validation import DataFilter
from utils.pagination import PaginationParams, paginate, PaginatedResponse

PROVINCE_API_BASES = {
    "federal": "https://open.canada.ca/data/api",
    "ontario": "https://data.ontario.ca/api",
    "alberta": "https://data.alberta.ca/api",
    "british_columbia": "https://catalogue.data.gov.bc.ca/api",
    "quebec": "https://www.donneesquebec.ca/recherche/api"
}

STATSCAN_API = "https://www150.statcan.gc.ca/t1/wds/rest"
BANK_OF_CANADA_API = "https://www.bankofcanada.ca/valet"

class DataFetcher:
    @staticmethod
    async def get_budget_data(
        filter_params: DataFilter,
        pagination: PaginationParams
    ) -> PaginatedResponse[Dict[str, Any]]:
        try:
            # Calculate offset based on pagination parameters
            offset = (pagination.page - 1) * pagination.page_size

            # Build query based on filter parameters
            query = {}
            if filter_params.government_level:
                query['government_level'] = filter_params.government_level
            if filter_params.province:
                query['province'] = filter_params.province
            if filter_params.date_range:
                query['start_date'] = filter_params.date_range.start_date
                query['end_date'] = filter_params.date_range.end_date

            # Add sorting parameters
            if pagination.sort_by:
                query['sort_by'] = pagination.sort_by
                query['sort_order'] = pagination.sort_order

            # Determine the API endpoint based on government level and province
            province_key = filter_params.province.lower().replace(" ", "_") if filter_params.province else "federal"
            if province_key not in PROVINCE_API_BASES:
                raise DataNotFoundError(
                    message=f"Province '{filter_params.province}' is not supported",
                    details={"province": filter_params.province}
                )

            base_url = PROVINCE_API_BASES[province_key]
            url = f"{base_url}/budget"

            # Make the API request with pagination parameters
            response = requests.get(
                url,
                params={
                    **query,
                    "offset": offset,
                    "limit": pagination.page_size
                }
            )

            if response.status_code != 200:
                raise DatabaseError(
                    message="Failed to fetch budget data from external API",
                    details={"status_code": response.status_code}
                )

            data = response.json()
            
            # Process and validate the response data
            if not data or "data" not in data:
                raise DataNotFoundError(
                    message="No budget data found for the specified criteria",
                    details={"filter": filter_params.dict()}
                )

            # Transform the data into the expected format
            transformed_data = []
            for item in data["data"]:
                transformed_item = {
                    "years": item.get("fiscal_years", []),
                    "revenue": item.get("revenue", []),
                    "expenses": item.get("expenses", []),
                    "deficit": item.get("deficit", []),
                    "net_debt": item.get("net_debt", [])
                }
                transformed_data.append(transformed_item)

            # Return paginated response
            return paginate(
                items=transformed_data,
                total=data.get("total", len(transformed_data)),
                params=pagination
            )

        except Exception as e:
            raise DatabaseError(
                message="Failed to fetch budget data",
                details={"error": str(e)}
            )

    @staticmethod
    async def fetch_economic_data(
        metric: str,
        filter_params: DataFilter,
        pagination: PaginationParams
    ) -> PaginatedResponse[Dict[str, Any]]:
        try:
            # Calculate offset based on pagination parameters
            offset = (pagination.page - 1) * pagination.page_size

            # Determine the appropriate API endpoint based on the metric
            if metric in ["gdp_growth", "employment_growth"]:
                base_url = STATSCAN_API
                endpoint = "getCubeData"
                product_id = "36-10-0434-01" if metric == "gdp_growth" else "14-10-0287-01"
                
                payload = {
                    "productId": product_id,
                    "dimensionAtObservation": "AllDimensions",
                    "offset": offset,
                    "limit": pagination.page_size
                }
                
                if filter_params.date_range:
                    payload["startDate"] = filter_params.date_range.start_date
                    payload["endDate"] = filter_params.date_range.end_date

                response = requests.post(f"{base_url}/{endpoint}", json=payload)

            elif metric in ["inflation_rate", "bond_yields"]:
                base_url = BANK_OF_CANADA_API
                series = "CPALTT01" if metric == "inflation_rate" else "V122543"
                
                params = {
                    "start_date": filter_params.date_range.start_date if filter_params.date_range else None,
                    "end_date": filter_params.date_range.end_date if filter_params.date_range else None,
                    "offset": offset,
                    "limit": pagination.page_size,
                    "format": "json"
                }
                
                response = requests.get(f"{base_url}/observations/{series}", params=params)

            else:
                raise ValidationError(
                    message=f"Unsupported metric: {metric}",
                    details={"supported_metrics": ["gdp_growth", "inflation_rate", "employment_growth", "bond_yields"]}
                )

            if response.status_code != 200:
                raise DatabaseError(
                    message=f"Failed to fetch {metric} data from external API",
                    details={"status_code": response.status_code}
                )

            data = response.json()

            # Transform the data based on the metric type
            transformed_data = []
            if metric in ["gdp_growth", "employment_growth"]:
                transformed_data = [{
                    "date": item["refPer"],
                    "value": float(item["value"]),
                    "years": [item["refPer"]],
                    "values": [float(item["value"])]
                } for item in data["observations"]]
            else:
                transformed_data = [{
                    "date": item["d"],
                    "value": float(item["v"]),
                    "months" if metric == "inflation_rate" else "years": [item["d"]],
                    "values": [float(item["v"])]
                } for item in data["observations"]]

            # Return paginated response
            return paginate(
                items=transformed_data,
                total=data.get("totalCount", len(transformed_data)),
                params=pagination
            )

        except Exception as e:
            raise DatabaseError(
                message=f"Failed to fetch {metric} data",
                details={"error": str(e)}
            )
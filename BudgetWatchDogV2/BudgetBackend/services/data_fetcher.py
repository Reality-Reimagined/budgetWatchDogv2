import requests

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
    def fetch_data(government_level: str, province: str, dataset: str, params: dict = None):
        """ Fetch data from the corresponding API endpoint """
        province_key = province.lower().replace(" ", "_") if province else "federal"
        
        if province_key not in PROVINCE_API_BASES:
            raise Exception(f"Province '{province}' is not supported yet.")
        
        url = f"{PROVINCE_API_BASES[province_key]}/{dataset}"
        response = requests.get(url, params=params)

        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Failed to fetch data from {province}: {response.status_code}")

    @staticmethod
    def fetch_economic_data(metric: str):
        """ Fetch economic indicators """
        if metric == "gdp_growth":
            url = f"{STATSCAN_API}/getCubeData"
            payload = {
                "productId": "36-10-0434-01",
                "dimensionAtObservation": "AllDimensions"
            }
            response = requests.post(url, json=payload)

        elif metric == "inflation_rate":
            url = f"{BANK_OF_CANADA_API}/observations/CPALTT01"
            response = requests.get(url, params={"format": "json"})

        elif metric == "employment_growth":
            url = f"{STATSCAN_API}/getCubeData"
            payload = {
                "productId": "14-10-0287-01",
                "dimensionAtObservation": "AllDimensions"
            }
            response = requests.post(url, json=payload)

        else:
            raise ValueError("Invalid economic metric requested.")

        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Failed to fetch {metric}: {response.status_code}")

    @staticmethod
    def get_budget_data(government_level: str, province: str = None):
        dataset = "budget"
        return DataFetcher.fetch_data(government_level, province, dataset)

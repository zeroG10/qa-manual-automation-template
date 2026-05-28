# API Automation — Python + pytest + httpx

Stack: **httpx + pytest + Allure**, dependencies managed by **uv**.

Shared between Web and Mobile — your backend API is the same surface from both clients.

## Setup

```bash
cd automation/api
uv sync
cp .env.example .env       # fill in API_BASE_URL, tokens, etc.
```

## Run

```bash
# All tests
uv run pytest

# Smoke only
uv run pytest -m smoke

# Contract / schema tests
uv run pytest -m contract

# Against different environment
API_ENV=prod API_BASE_URL=https://api.prod.example.com uv run pytest -m smoke
```

## Reports

```bash
allure serve allure-results
```

## Structure

```
automation/api/
├── pyproject.toml         # deps + pytest config
├── .env.example           # API_BASE_URL, tokens, env label
├── conftest.py            # shared fixtures (api client, allure labels)
├── config/                # pydantic-settings
├── clients/               # ApiClient (httpx wrapper) — extend with resource-specific clients
├── tests/
│   ├── smoke/             # critical happy-path
│   └── contract/          # schema validation against OpenAPI
├── schemas/               # JSON Schemas (or pydantic models) for contract tests
├── helpers/               # schema_validator, auth helpers, retries
└── fixtures/              # static test data (no secrets)
```

## Markers

- `smoke` — run on every PR
- `regression` — full suite
- `contract` — validates responses against OpenAPI/JSON Schema
- `auth` — requires valid token
- `slow` — > 5s tests

## Patterns

### Adding a new resource client

Create `clients/users_client.py`:

```python
from clients.base_client import ApiClient

class UsersClient(ApiClient):
    def get_user(self, user_id: str):
        return self.get(f"/users/{user_id}")

    def create_user(self, payload: dict):
        return self.post("/users", json=payload)
```

### Contract test against OpenAPI

Drop the JSON Schema in `schemas/users_get.json`, then:

```python
import json
from pathlib import Path
from helpers.schema_validator import validate_schema

def test_user_response_matches_schema(api):
    response = api.get("/users/123")
    schema = json.loads((Path(__file__).parent.parent.parent / "schemas/users_get.json").read_text())
    validate_schema(response.json(), schema)
```

## Source of API spec

Place OpenAPI / Swagger / Postman collections in [docs/api/](../../docs/api/) — that's the contract this test suite validates against.

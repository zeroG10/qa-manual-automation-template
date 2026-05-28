from typing import Any

import allure
from jsonschema import Draft202012Validator


def validate_schema(payload: Any, schema: dict) -> None:
    """Validate JSON payload against a JSON Schema. Attaches errors to Allure on failure."""
    validator = Draft202012Validator(schema)
    errors = sorted(validator.iter_errors(payload), key=lambda e: e.path)
    if errors:
        details = "\n".join(f"{list(e.path)}: {e.message}" for e in errors)
        allure.attach(details, name="schema-errors", attachment_type=allure.attachment_type.TEXT)
        raise AssertionError(f"Schema validation failed:\n{details}")

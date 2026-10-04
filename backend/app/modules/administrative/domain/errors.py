from app.core.exceptions import DomainError


class DistrictNotFoundError(DomainError):
    code = "district_not_found"
    message = "No district matches the requested reference."


class InvalidDistrictIdError(DomainError):
    code = "invalid_district_id"
    message = "The district reference is not valid."

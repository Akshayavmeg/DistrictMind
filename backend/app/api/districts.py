from fastapi import APIRouter, Depends

from app.modules.administrative.reference.telangana_districts import TELANGANA_DISTRICTS
from app.modules.administrative.repositories.reference_catalog import ReferenceCatalogRepository
from app.modules.administrative.schemas.district import DistrictListSchema, DistrictSchema
from app.modules.administrative.services.district_service import DistrictService

router = APIRouter(prefix="/districts", tags=["administrative"])

_service = DistrictService(ReferenceCatalogRepository(TELANGANA_DISTRICTS))


def get_district_service() -> DistrictService:
    """Dependency seam. Tests override this to exercise other catalogs, such as an empty one."""
    return _service


@router.get("", response_model=DistrictListSchema)
def list_districts(service: DistrictService = Depends(get_district_service)) -> DistrictListSchema:
    items = [DistrictSchema.from_domain(district) for district in service.list_districts()]
    return DistrictListSchema(items=items, total=len(items))


@router.get("/{district_id}", response_model=DistrictSchema)
def get_district(district_id: str, service: DistrictService = Depends(get_district_service)) -> DistrictSchema:
    return DistrictSchema.from_domain(service.get_district(district_id))

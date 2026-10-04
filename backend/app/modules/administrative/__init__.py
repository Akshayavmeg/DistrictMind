"""Administrative domain module: district reference identity and administrative status.

Layers (dependencies point inward only):
    domain/        models and domain errors. No framework imports.
    repositories/  storage contract and the in-memory reference implementation (not persistence).
    services/      application behavior: list, get, identifier validation.
    schemas/       API response models, mapped from domain models.
    reference/     the 33-district reference catalog data.

This module holds NO geometry, statistics, or spatial logic. See
docs/implementation/step-2-administrative-foundation.md.
"""

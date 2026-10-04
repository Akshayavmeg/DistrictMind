"""Framework-free base for expected, client-facing domain failures.

``code`` is a stable, machine-readable identifier. Its HTTP mapping lives in
app/core/errors.py, so domain code never imports the web framework.
"""


class DomainError(Exception):
    code: str = "domain_error"
    message: str = "The request could not be completed."

    def __init__(self, message: str | None = None) -> None:
        self.message = message or self.message
        super().__init__(self.message)

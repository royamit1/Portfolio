from slowapi import Limiter
from slowapi.util import get_remote_address

# Create a single, centralized limiter instance that can be imported by other modules.
# The key_func determines how to identify a "user" (in this case, by their IP address).
limiter = Limiter(key_func=get_remote_address)

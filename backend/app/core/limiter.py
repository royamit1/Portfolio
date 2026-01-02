from slowapi import Limiter
from slowapi.util import get_remote_address

# Initialize the global rate limiter.
# key_func=get_remote_address identifies users by their IP address.
# This instance will be used to decorate specific routes in the API.
limiter = Limiter(key_func=get_remote_address)

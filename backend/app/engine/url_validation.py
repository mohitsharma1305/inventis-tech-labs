"""Parse addresses only; this service never visits submitted destinations."""
import ipaddress
import re
from urllib.parse import urlsplit, urlunsplit

def normalize_url(value):
    value=value.strip()
    if not value or len(value)>2048 or re.search(r'[\s\x00-\x1f\x7f\\]',value):
        raise ValueError('Invalid URL: whitespace, control characters or excessive length')
    if '://' not in value:
        if re.match(r'^[a-zA-Z][a-zA-Z0-9+.-]*:',value) and not re.match(r'^[^:]+:\d+(/|$)',value):
            raise ValueError('Only HTTP and HTTPS URLs are supported')
        value='https://'+value
    try:
        p=urlsplit(value)
        if p.scheme.lower() not in ('http','https') or not p.hostname:
            raise ValueError('Only HTTP and HTTPS URLs are supported')
        host=p.hostname.encode('idna').decode('ascii').lower()
        port=p.port
        try: ipaddress.ip_address(host)
        except ValueError:
            if '.' not in host or any(not re.fullmatch(r'[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?',label) for label in host.rstrip('.').split('.')):
                raise ValueError('Enter a valid public hostname or IP address')
        if p.username is not None or p.password is not None:
            raise ValueError('URLs containing embedded credentials are not accepted')
        authority=('['+host+']') if ':' in host else host
        if port: authority+=':'+str(port)
        return urlunsplit((p.scheme.lower(),authority,p.path,p.query,p.fragment))
    except (UnicodeError,ValueError) as e:
        raise ValueError(str(e)) from None

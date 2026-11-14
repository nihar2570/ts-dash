import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

base = "http://ceoandhra.nic.in/"

paths = [
    "GE_2014/General%20Election%20HOP%202014%20Book.pdf",
    "GE_2014/Statistical_Report_2014.pdf",
    "GE_2014/Form20.html",
    "GE_2014/Form20_AC.html",
    "GE_2014/Form_20.html",
    "GE_2014/Form-20.html",
    "GE_2014/Form20/",
    "GE_2014/1-Ichchapuram.pdf",
    "GE_2014/1-Ichchapuram%20AC.pdf",
    "GE_2019/Statistical_Report_2019.pdf",
    "GE_2019/Form20.html",
    "GE_2019/Form20_AC.html",
    "GE_2019/Form_20.html",
    "GE_2019/Form-20.html",
    "GE_2019/Form20/",
    "GE_2019/1-Ichchapuram.pdf",
    "GE_2019/1-Ichchapuram%20AC.pdf",
]

for p in paths:
    url = base + p
    try:
        req = urllib.request.Request(url, method='HEAD', headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=5) as resp:
            print(f"FOUND 200: {url}")
    except urllib.error.HTTPError as e:
        if e.code != 404:
            print(f"STATUS {e.code}: {url}")
    except Exception as e:
        pass

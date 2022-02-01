import httplib
conn = httplib.HTTPSConnection("baidu.com")
conn.request("GET", "/")
r = conn.getresponse()

print r.msg.headers
print r.read(1000)

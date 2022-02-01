#coding=utf8
import socket

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
baidu_ip = socket.gethostbyname('baidu.com')
sock.connect((baidu_ip, 80))
print('connected to %s' % baidu_ip)

req_msg = [
    'GET / HTTP/1.1',
    'User-Agent: curl/7.37.1',
    'Host: baidu.com',
    'Accept: */*',
]
delimiter = '\r\n'

sock.send(delimiter.join(req_msg))
sock.send(delimiter)
sock.send(delimiter)

print('%sreceived%s' % ('-'*20, '-'*20))
http_response = sock.recv(4096)
print(http_response)


# connected to 111.13.101.208
# --------------------received--------------------
# HTTP/1.1 200 OK
# Date: Tue, 01 Nov 2016 13:45:32 GMT
# Server: Apache
# Last-Modified: Tue, 12 Jan 2010 13:48:00 GMT
# ETag: "51-47cf7e6ee8400"
# Accept-Ranges: bytes
# Content-Length: 81
# Cache-Control: max-age=86400
# Expires: Wed, 02 Nov 2016 13:45:32 GMT
# Connection: Keep-Alive
# Content-Type: text/html

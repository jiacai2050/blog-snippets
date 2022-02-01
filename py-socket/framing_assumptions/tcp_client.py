# coding=utf8
import socket

# server_ip 不能为 localhost 或 127.0.0.1。原因:
# http://stackoverflow.com/a/31167631/2163429
server_ip = '192.168.30.102'
server_addr = (server_ip, 5555)

if __name__ == '__main__':
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF, 2)
    data_to_sent = 'server close demo' * 100
    try:
        sock.connect(server_addr)
        sock.send('hello')
        sock.send('hello')
    finally:
        sock.close()
        print('socket closed')


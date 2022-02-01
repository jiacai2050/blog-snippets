# coding=utf8
import socket

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
sock.bind(('', 5500))

if __name__ == '__main__':
    while 1:
        msg = sock.recv(1024)
        print 'msg = %s' % msg
        msg = sock.recv(1024)
        print 'msg = %s' % msg

# output:
# msg = hello udp socket
# msg = hello udp socket

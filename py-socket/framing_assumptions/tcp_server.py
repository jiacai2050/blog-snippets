# coding=utf8
import socket
import time

server_addr = ('192.168.30.102', 5555)
if __name__ == '__main__':

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

    sock.bind(server_addr)
    sock.listen(5)

    while 1:
        client_sock, addr = sock.accept()
        try:
            msg = client_sock.recv(1024)
            print 'msg = %s' % msg
            msg = client_sock.recv(1024)
            print 'msg = %s' % msg
        finally:
            client_sock.close()

# output
# msg = hellohello
# msg =

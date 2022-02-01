# coding=utf8
import socket

udp_server_addr = ('', 5500)

if __name__ == '__main__':
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    data_to_sent = 'hello udp socket'
    try:
        sent = sock.sendto(data_to_sent, udp_server_addr)
        data, server = sock.recvfrom(1024)
        print('receive data:[%s] from %s:%s' % ((data,) + server))
    finally:
        sock.close()

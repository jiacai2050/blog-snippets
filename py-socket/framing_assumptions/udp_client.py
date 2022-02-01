# coding=utf8
import socket

udp_server_addr = ('', 5500)

if __name__ == '__main__':
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    data_to_sent = 'hello udp socket'
    try:
        sent = sock.sendto(data_to_sent, udp_server_addr)
        sent = sock.sendto(data_to_sent, udp_server_addr)
    finally:
        sock.close()

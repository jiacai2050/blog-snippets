# coding=utf8

import socket
from safe_socket import safe_send, safe_recv

data_to_sent = 'hello tcp socket'

if __name__ == '__main__':
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        sock.connect(('', 5600))

        safe_send(sock, data_to_sent)

        # echo server 返回相应的大小与发送的一致
        MSGLEN = len(data_to_sent)
        print(safe_recv(sock, MSGLEN))
    finally:
        sock.close()

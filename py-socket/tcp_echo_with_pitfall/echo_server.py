# coding=utf8

import socket
from safe_socket import safe_send, safe_recv
# 服务器需要知道客户端发的数据包的大小，这样才能知道收到的数据是否完整
# http 协议里面是通过 Content-Length 头部获取的
from echo_client import data_to_sent

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
MSGLEN = len(data_to_sent)

def handler(client_sock, addr):
    try:
        print('new client from %s:%s' % addr)
        msg = safe_recv(client_sock, MSGLEN)
        print('received data[%s] from %s:%s' % ((msg,) + addr))
        safe_send(client_sock, msg)
    finally:
        client_sock.close()

if __name__ == '__main__':

    # 设置 SO_REUSEADDR 后,可以立即使用 TIME_WAIT 状态的 socket
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind(('', 5600))
    sock.listen(5)

    while 1:
        client_sock, addr = sock.accept()
        handler(client_sock, addr)

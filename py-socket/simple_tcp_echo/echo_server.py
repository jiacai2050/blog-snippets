# coding=utf8
import socket

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)


def handler(client_sock, addr):
    try:
        print('new client from %s:%s' % addr)
        msg = client_sock.recv(100)
        client_sock.send(msg)
        print('received data[%s] from %s:%s' % ((msg,) + addr))
    finally:
        client_sock.close()
        print('client[%s:%s] socket closed' % addr)

if __name__ == '__main__':

    # 设置 SO_REUSEADDR 后,可以立即使用 TIME_WAIT 状态的 socket
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind(('', 5500))
    sock.listen(5)

    while 1:
        client_sock, addr = sock.accept()
        handler(client_sock, addr)

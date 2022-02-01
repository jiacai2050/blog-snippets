import socket
import os

server_address = '/tmp/uds_socket'

# Make sure the socket does not already exist
try:
    os.unlink(server_address)
except OSError:
    if os.path.exists(server_address):
        raise

if __name__ == '__main__':
    uds_sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    uds_sock.bind(server_address)
    uds_sock.listen(5)

    while True:
        client_sock, addr = uds_sock.accept()
        print('new client from %s' % addr)

        try:
            msg = client_sock.recv(1024)
            client_sock.send(msg)
        finally:
            client_sock.close()

import socket
import sys

server_address = '/tmp/uds_socket'
if __name__ == '__main__':
    # Create a UDS socket
    sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)

    try:
        sock.connect(server_address)
        sock.send('hello uds')
        print(sock.recv(1024))
    except socket.error, msg:
        print >>sys.stderr, msg
        sys.exit(1)
    finally:
        sock.close()

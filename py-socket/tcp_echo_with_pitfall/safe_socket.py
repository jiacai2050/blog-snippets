# coding: utf8

def safe_send(sock, data_to_sent):
    """
        send data with
    """
    MSGLEN = len(data_to_sent)
    already_sent = 0
    while already_sent < MSGLEN:
        sent = sock.send(data_to_sent[already_sent:])
        if sent == 0:
            raise RuntimeError("socket connection broken")
        already_sent += sent


def safe_recv(sock, MSGLEN):
    """
    MSGLEN 为实际数据大小
    """
    chunks = []
    bytes_recd = 0
    while bytes_recd < MSGLEN:
        chunk = sock.recv(min(MSGLEN - bytes_recd, 2048))
        if chunk == b'':
            raise RuntimeError("socket connection broken")
        chunks.append(chunk)
        bytes_recd = bytes_recd + len(chunk)
    return b''.join(chunks)

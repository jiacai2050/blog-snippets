#!/usr/bin/env python2

"""

    About
    ~~~~~

    A pure python ping implementation using raw socket.

    Note that ICMP messages can only be sent from processes running as root.

    https://gist.github.com/pklaus/856268
"""

import time
import socket
import struct
import select
import random
import asyncore

# From /usr/include/linux/icmp.h; your milage may vary.
ICMP_ECHO_REQUEST = 8 # Seems to be the same on Solaris.

ICMP_CODE = socket.getprotobyname('icmp')
ERROR_DESCR = {
    1: ' - Note that ICMP messages can only be '
       'sent from processes running as root.',
    10013: ' - Note that ICMP messages can only be sent by'
           ' users or processes with administrator rights.'
    }

__all__ = ['create_packet', 'do_one', 'verbose_ping', 'PingQuery',
           'multi_ping_query']


def checksum(source_string):
    # I'm not too confident that this is right but testing seems to
    # suggest that it gives the same answers as in_cksum in ping.c.
    sum = 0
    count_to = (len(source_string) / 2) * 2
    count = 0
    while count < count_to:
        this_val = ord(source_string[count + 1])*256+ord(source_string[count])
        sum = sum + this_val
        sum = sum & 0xffffffff # Necessary?
        count = count + 2
    if count_to < len(source_string):
        sum = sum + ord(source_string[len(source_string) - 1])
        sum = sum & 0xffffffff # Necessary?
    sum = (sum >> 16) + (sum & 0xffff)
    sum = sum + (sum >> 16)
    answer = ~sum
    answer = answer & 0xffff
    # Swap bytes. Bugger me if I know why.
    answer = answer >> 8 | (answer << 8 & 0xff00)
    return answer


def create_packet(id):
    """Create a new echo request packet based on the given "id"."""
    # Header is type (8), code (8), checksum (16), id (16), sequence (16)
    header = struct.pack('bbHHh', ICMP_ECHO_REQUEST, 0, 0, id, 1)
    data = 192 * 'Q'
    # Calculate the checksum on the data and the dummy header.
    my_checksum = checksum(header + data)
    # Now that we have the right checksum, we put that in. It's just easier
    # to make up a new header than to stuff it into the dummy.
    header = struct.pack('bbHHh', ICMP_ECHO_REQUEST, 0,
                         socket.htons(my_checksum), id, 1)
    return header + data


def do_one(dest_addr, timeout=1):
    """
    Sends one ping to the given "dest_addr" which can be an ip or hostname.
    "timeout" can be any integer or float except negatives and zero.

    Returns either the delay (in seconds) or None on timeout and an invalid
    address, respectively.

    """
    try:
        my_socket = socket.socket(socket.AF_INET, socket.SOCK_RAW, ICMP_CODE)
    except socket.error as e:
        if e.errno in ERROR_DESCR:
            # Operation not permitted
            raise socket.error(''.join((e.args[1], ERROR_DESCR[e.errno])))
        raise # raise the original error
    try:
        host = socket.gethostbyname(dest_addr)
    except socket.gaierror:
        return
    # Maximum for an unsigned short int c object counts to 65535 so
    # we have to sure that our packet id is not greater than that.
    packet_id = int((id(timeout) * random.random()) % 65535)
    packet = create_packet(packet_id)
    while packet:
        # The icmp protocol does not use a port, but the function
        # below expects it, so we just give it a dummy port.
        sent = my_socket.sendto(packet, (dest_addr, 1))
        packet = packet[sent:]
    delay = receive_ping(my_socket, packet_id, time.time(), timeout)
    my_socket.close()
    return delay


def receive_ping(my_socket, packet_id, time_sent, timeout):
    # Receive the ping from the socket.
    time_left = timeout
    while True:
        started_select = time.time()
        ready = select.select([my_socket], [], [], time_left)
        how_long_in_select = time.time() - started_select
        if ready[0] == []: # Timeout
            return
        time_received = time.time()
        rec_packet, addr = my_socket.recvfrom(1024)
        icmp_header = rec_packet[20:28]
        type, code, checksum, p_id, sequence = struct.unpack(
            'bbHHh', icmp_header)
        if p_id == packet_id:
            return time_received - time_sent
        time_left -= time_received - time_sent
        if time_left <= 0:
            return


def verbose_ping(dest_addr, timeout=2, count=4):
    """
    Sends one ping to the given "dest_addr" which can be an ip or hostname.

    "timeout" can be any integer or float except negatives and zero.
    "count" specifies how many pings will be sent.

    Displays the result on the screen.

    """
    for i in range(count):
        print('ping {}...'.format(dest_addr))
        delay = do_one(dest_addr, timeout)
        if delay == None:
            print('failed. (Timeout within {} seconds.)'.format(timeout))
        else:
            delay = round(delay * 1000.0, 4)
            print('get ping in {} milliseconds.'.format(delay))
    print('')


class PingQuery(asyncore.dispatcher):
    def __init__(self, host, p_id, timeout=0.5, ignore_errors=False):
        """
       Derived class from "asyncore.dispatcher" for sending and
       receiving an icmp echo request/reply.

       Usually this class is used in conjunction with the "loop"
       function of asyncore.

       Once the loop is over, you can retrieve the results with
       the "get_result" method. Assignment is possible through
       the "get_host" method.

       "host" represents the address under which the server can be reached.
       "timeout" is the interval which the host gets granted for its reply.
       "p_id" must be any unique integer or float except negatives and zeros.

       If "ignore_errors" is True, the default behaviour of asyncore
       will be overwritten with a function which does just nothing.

       """
        asyncore.dispatcher.__init__(self)
        try:
            self.create_socket(socket.AF_INET, socket.SOCK_RAW, ICMP_CODE)
        except socket.error as e:
            if e.errno in ERROR_DESCR:
                # Operation not permitted
                raise socket.error(''.join((e.args[1], ERROR_DESCR[e.errno])))
            raise # raise the original error
        self.time_received = 0
        self.time_sent = 0
        self.timeout = timeout
        # Maximum for an unsigned short int c object counts to 65535 so
        # we have to sure that our packet id is not greater than that.
        self.packet_id = int((id(timeout) / p_id) % 65535)
        self.host = host
        self.packet = create_packet(self.packet_id)
        if ignore_errors:
            # If it does not care whether an error occured or not.
            self.handle_error = self.do_not_handle_errors
            self.handle_expt = self.do_not_handle_errors

    def writable(self):
        return self.time_sent == 0

    def handle_write(self):
        self.time_sent = time.time()
        while self.packet:
            # The icmp protocol does not use a port, but the function
            # below expects it, so we just give it a dummy port.
            sent = self.sendto(self.packet, (self.host, 1))
            self.packet = self.packet[sent:]

    def readable(self):
        # As long as we did not sent anything, the channel has to be left open.
        if (not self.writable()
            # Once we sent something, we should periodically check if the reply
            # timed out.
            and self.timeout < (time.time() - self.time_sent)):
            self.close()
            return False
        # If the channel should not be closed, we do not want to read something
        # until we did not sent anything.
        return not self.writable()

    def handle_read(self):
        read_time = time.time()
        packet, addr = self.recvfrom(1024)
        header = packet[20:28]
        type, code, checksum, p_id, sequence = struct.unpack("bbHHh", header)
        if p_id == self.packet_id:
            # This comparison is necessary because winsocks do not only get
            # the replies for their own sent packets.
            self.time_received = read_time
            self.close()

    def get_result(self):
        """Return the ping delay if possible, otherwise None."""
        if self.time_received > 0:
            return self.time_received - self.time_sent

    def get_host(self):
        """Return the host where to the request has or should been sent."""
        return self.host

    def do_not_handle_errors(self):
        # Just a dummy handler to stop traceback printing, if desired.
        pass

    def create_socket(self, family, type, proto):
        # Overwritten, because the original does not support the "proto" arg.
        sock = socket.socket(family, type, proto)
        sock.setblocking(0)
        self.set_socket(sock)
        # Part of the original but is not used. (at least at python 2.7)
        # Copied for possible compatiblity reasons.
        self.family_and_type = family, type

    # If the following methods would not be there, we would see some very
    # "useful" warnings from asyncore, maybe. But we do not want to, or do we?
    def handle_connect(self):
        pass

    def handle_accept(self):
        pass

    def handle_close(self):
        self.close()


def multi_ping_query(hosts, timeout=1, step=512, ignore_errors=False):
    """
    Sends multiple icmp echo requests at once.

    "hosts" is a list of ips or hostnames which should be pinged.
    "timeout" must be given and a integer or float greater than zero.
    "step" is the amount of sockets which should be watched at once.

    See the docstring of "PingQuery" for the meaning of "ignore_erros".

    """
    results, host_list, id = {}, [], 0
    for host in hosts:
        try:
            host_list.append(socket.gethostbyname(host))
        except socket.gaierror:
            results[host] = None
    while host_list:
        sock_list = []
        for ip in host_list[:step]: # select supports only a max of 512
            id += 1
            sock_list.append(PingQuery(ip, id, timeout, ignore_errors))
            host_list.remove(ip)
        # Remember to use a timeout here. The risk to get an infinite loop
        # is high, because noone can guarantee that each host will reply!
        asyncore.loop(timeout)
        for sock in sock_list:
            results[sock.get_host()] = sock.get_result()
    return results


if __name__ == '__main__':
    # Testing
    host_list = ['www.qq.com', 'baidu.com', '127.0.0.1']
    for host, ping in multi_ping_query(host_list).iteritems():
        print(host, '=', ping)

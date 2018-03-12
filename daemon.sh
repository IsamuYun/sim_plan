#!/bin/bash

DAEMON_DIR=/home/python/ZS-Server
DAEMON=$DAEMON_DIR/zs-server.py
NAME=tornado-zs-server
DESC="zs-server daemon"
PIDFILE=/var/run/$NAME.pid

test -f $DAEMON || exit 0

set -e

case "$1" in
  start)
        echo -n "Starting $DESC: "
        start-stop-daemon --start --pidfile $PIDFILE \
            --make-pidfile --background --exec $DAEMON
        echo "$NAME."
        ;;
  stop)
        echo -n "Stopping $DESC: "
        start-stop-daemon --stop --quiet --oknodo \
            --pidfile $PIDFILE
        rm -f $PIDFILE
        echo "$NAME."
        ;;
  restart)
        echo -n "Restarting $DESC: "
        start-stop-daemon --stop --quiet --oknodo \
            --pidfile $PIDFILE
        rm -f $PIDFILE
        start-stop-daemon --start --pidfile $PIDFILE \
            --make-pidfile --background --exec $DAEMON
        echo "$NAME."
esac

exit 0

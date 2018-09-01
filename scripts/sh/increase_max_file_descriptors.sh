#!/bin/bash
# Increasing the amount of maximum file descriptors on the system
# https://gist.github.com/luckydev/b2a6ebe793aeacf50ff15331fb3b519d

. env.sh
set -x #echo on

#TODO for amazon ec2 live environment! 
#1: copy/replace files with modified versions of storage
#2: restart system
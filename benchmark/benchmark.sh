#!/bin/sh
pm2 delete quark
pm2 delete express

pm2 start quark_hello.js --name 'quark'
pm2 start express_hello.js --name 'express'

pm2 list

ab -n 1000 -c 1000 -g out_express.dat -r http://127.0.0.1:3000/
ab -n 1000 -c 1000 -g out_quark.dat -r http://127.0.0.1:3002/

gnuplot plot.p

rm out_express.dat
rm out_quark.dat

pm2 list

pm2 delete quark
pm2 delete express

set terminal png
set output "benchmark.png"
set title "ab -n 1000 -c 1000"
set size 1,0.7
set grid y
set xlabel "request"
set ylabel "response time (ms)"
plot "out_quark.dat" using 9 smooth sbezier with lines title "Total Time - quark.io", \
     "out_express.dat" using 9 smooth sbezier with lines title "Total Time - express.js", 

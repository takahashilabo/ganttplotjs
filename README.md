# ganttplot.js

## Background.
I needed to use a Gantt chart in a paper for my research in 2014, and [I used the following program](https://web.archive.org/web/20170910201044/http://wiki.mn.wtb.tue.nl/wonham/gantt.py): It was very helpful in drawing a simple but beautiful Gantt chart.  

Unfortunately, the site seems to have been closed; therefore, I searched GitHub and found [@emilienkofman](https://github.com/emilienkofman) who had [cloned it](https://github.com/emilienkofman/ganttplot). Thank you very much!

However, this [gantt.py](https://github.com/emilienkofman/ganttplot/blob/master/gantt.py) runs on Python2, which does not fit in this day and age; you can use brew to instal Python2, but it is painful.

Therefore, I ported and simplified gantt.py to JS today in my free time, focusing on the functions that I need. The code is complete for me only, but I can change the design of gnuplots, and so on.  You can use it if you like it.

## Usage

[Start from here](https://takahashilabo.github.io/ganttplotjs/)

Watch the following video.

Of course, you need to instal a gnuplot on your PC and execute the following commands:

```sh
gnuplot default.gnuplot -p
```

Alternatively, [there is a gnuplot](https://hostcat.fhsu.edu/cdclark/static/apps/gnuplot/) that works in your browser, so you can copy and paste the results.

However, the first line ‘set terminal qt font “Arial,18” ’ causes an error. If you delete this line, the results can be seen.
//The code obtained from https://github.com/emilienkofman/ganttplot, and simplify the code and translated to JS.

let rectangleHeight = 0.6  // Height of a rectangle in units.

class Activity {
    constructor(resource, start, stop, task) {
        this.resource = resource;
        this.start = start;
        this.stop = stop;
        this.task = task;
    }
}

class Rectangle {
    constructor(bottomleft, topright, fillcolor, task) {
        this.bottomleft = bottomleft;
        this.topright = topright;
        this.fillcolor = fillcolor;
        this.fillstyle = 'solid 0.8';
        this.linewidth = 2;
        this.task = task;
    }
}

class ColorBook {
    constructor(tasks) {
        this.pallete = ["0xffcccc", "0xccffcc", "0xffffcc", "0xccccff", "0xccffff", "0xffccff"];
        this.colors = {};
        for (let i = 0; i < tasks.length; i++) {
            //this.colors[tasks[i]] = parseFloat(i) * 1.0 / (tasks.length - 1);
            this.colors[tasks[i]] = this.pallete[i % this.pallete.length];
        }
    }
}

function make_rectangles(activities, resource_map, colors) {
    let rectangles = [];
    for (let act of activities) {
        const ypos = resource_map[act.resource];
        const bottomleft = [act.start, ypos - 0.5 * rectangleHeight];
        const topright = [act.stop, ypos + 0.5 * rectangleHeight];
        const fillcolor = colors[act.task];
        rectangles.push(new Rectangle(bottomleft, topright, fillcolor, act.task));
    }
    return rectangles;
}

function load_ganttdata(ganttdata) {
    let activities = [];
    for (let line of ganttdata.split("\n")) {
        const l = line.trim().split(",");
        if (l.length < 4) {
            continue;
        }
        const resource = l[0];
        const start = parseFloat(l[1]);
        const stop = parseFloat(l[2]);
        const task = l[3];
        activities.push(new Activity(resource, start, stop, task));
    }

    return activities;
}

function make_unique_tasks_resources(activities) {
    // Create list with unique resources and tasks in activity order.
    let resources = [];
    let tasks = [];
    for (const act of activities) {
        if (! resources.includes(act.resource)) {
            resources.push(act.resource);
        }
        if (! tasks.includes(act.task)) {
            tasks.push(act.task);
        }
    }

    // Resources are read from top (y=max) to bottom (y=1)
    resources.reverse();

    return [tasks, resources];
}

function generate_plotdata(activities, resources, tasks, rectangles,
                     resource_map, color_book) {
    const xmin = 0
    const xmax = Math.max(...activities.map(item => item.stop));
    const ymin = 0 + (rectangleHeight / 2);
    const ymax = resources.length + 1 - (rectangleHeight / 2);
    const ytics = `( ${Object.keys(resource_map).map(e => `"${e}" ${resource_map[e]}`).join(",")} )`;

    // Set plot dimensions
    const plot_dimensions = [
    //    'set size ratio 0.5 # the height as 0.5 times the width',
    //    `set xlabel "${xlabel}"`,
    //    'set xlabel font "Arial,20"',
    //    'set tics font "Arial,18" # scale letter font',
    //    'set lmargin 15',
    //    'set rmargin 5',
    //    'set grid xtics # grid lines for X-axis displayed',
    //    'set key off # no legend displayed',
    //    'set palette model RGB defined ( 0 1.0 0.8 0.8, 1 1.0 0.8 1.0, 2 0.8 0.8 1.0, 3 0.8 1.0 1.0, 4 0.8 1.0 0.8, 5 1.0 1.0 0.8 )',
    //    'unset colorbox'
        `set xrange [${xmin}:${xmax}]`,
        `set yrange [${ymin}:${ymax}]`,
        `set ytics ${ytics}`,
    ];

    // Generate gnuplot rectangle objects
    const plot_rectangles = rectangles.map((r, index) => 
        [`set object ${index + 1} rectangle`,
            `from ${r.bottomleft[0]}, ${r.bottomleft[1]}`,
            `to ${r.topright[0]}, ${r.topright[1]}`,
            `fillcolor rgbcolor ${r.fillcolor}`,
            'fillstyle solid 0.8'].join(" "));

    // Generate gnuplot labels
    const plot_labels = rectangles.map((r, index) =>
        [`set label ${index + 1} center at`,
        `${r.bottomleft[0]+(-r.bottomleft[0]+r.topright[0])/2.0},${r.bottomleft[1]+(-r.bottomleft[1]+r.topright[1])/2.0}`,
        `"${r.task}"`].join(" "));

    // Generate gnuplot lines
    const plot_lines = ['plot -1'];

    return [plot_dimensions, plot_rectangles, plot_lines, plot_labels];
}

function write_data(plot_dimensions, plot_rectangles, plot_lines, plot_labels) {
    return [].concat(plot_dimensions, plot_rectangles, plot_labels, plot_lines).join("\n");
}        

function compute(ganttdata) {
    const activities = load_ganttdata(ganttdata);
    [tasks, resources] = make_unique_tasks_resources(activities);

    // Assign indices to resources
    const resource_map = Object.fromEntries(resources.map((resource, index) => [resource, index + 1]));
    const color_book = new ColorBook(tasks);
    const rectangles = make_rectangles(activities, resource_map, color_book.colors);

    [plot_dims, plot_rects, plot_lines, plot_labels] = 
            generate_plotdata(activities, resources, tasks, rectangles, resource_map, color_book)

    return write_data(plot_dims, plot_rects, plot_lines, plot_labels);
}


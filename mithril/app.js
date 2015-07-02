(function() {

var App = {};
var FLASK_URL = 'http://127.0.0.1:5000';

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

App.controller = function() {
  var controller = this;
  // drop down options
  controller.options = m.prop(['sin', 'cos']);
  // type of wave to plot
  controller.wave = m.prop('sin');
  // number of points
  controller.num_points = m.prop(10);
  // the points themselves
  controller.points = m.prop([]);

  // refresh points by making an AJAX call
  controller.refreshPoints = function refreshPoints() {
    // if num_points is not a number, just use 0
    var np = controller.num_points();
    if (!isNumber(np)) { np = 0; }

    var url = FLASK_URL + '/graph/' +
      controller.wave() + '/points/' + np;
    m.request( { method : 'GET',
                 url : url,
                 headers : {'Origin' : 'localhost'}
               }).then(controller.points);
  }

  // returns a function that calls f on its input and then
  // calls refreshPoints afterward.  Useful for onclick callbacks
  // that need to set a variable and then refresh the data
  controller.refreshAfter = function refreshAfter(f) {
    return function(x) {
      f(x);
      controller.refreshPoints();
    }
  }

  controller.refreshPoints();
}

// a debug version of plot points that just prints out the data in divs
// instead of making SVGs
function plotPointsDebug(ctrl) {
  return m(".plot-points", [
    m(".wave", ctrl.wave()),
    m(".num_points", ctrl.num_points()),
    m(".points", JSON.stringify(ctrl.points()))
  ]);
}

// helper function to make a svg circle element
// rescale to fit in the [0,200] x [0, 200] box
function makeCircle(point) {
  return m("circle", {
    'cx' : 5 + 190 * point.x / 6.28,
    'cy' : 100 - point.y * 90 ,
    'r' : 2,
    'stroke' : 'black',
    'fill' : 'red'
  });
}

// create the SVG element
function plotPoints(ctrl) {
  return m("svg[height='200px'][width='200px']",
           ctrl.points().map(makeCircle));
}

App.view = function(ctrl) {
  // stick everything in a div.app
  return m(".app", [
    // stick the SVG at the top
    plotPoints(ctrl),
    // select control for setting value of ctrl.wave
    // one entry for each value of ctrl.options
    // calls refresh on change
    m("select#select-wave",
      { onchange: m.withAttr("value", ctrl.refreshAfter(ctrl.wave)),
        value: ctrl.wave() },
      ctrl.options().map(function(option) {
        return m("option", { value : option }, option);
      })),
    // input for putting in number of points
    m("input",
      { onkeyup: m.withAttr("value", ctrl.refreshAfter(ctrl.num_points)),
        value: ctrl.num_points()})
  ]);
}

m.module(document.body, App);})()

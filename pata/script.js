const xInput = document.getElementById('xInput');
const yInput = document.getElementById('yInput');
const Limit = document.getElementById('Limit');
const Disconnect = document.getElementById('btn2');
document.getElementById('btn2').style.visibility = "hidden"
const Critic = document.getElementById('Critic');
document.getElementById('Critic').style.visibility = "hidden"
const plotButton = document.getElementById('plotButton');
const chartCanvas = document.getElementById('chart');
const clearButton = document.getElementById('clear');
document.getElementById('clear').style.visibility = "hidden"
const ctx = chartCanvas.getContext('2d');


let chart;
const dataPoints = [];
const dataPoints2 = [];
let zoomLevel = 1;
let isDragging = false;
let dragStartX;
let dragStartY;
const yMax = 100;
const yMin = 0;

let startedDate = Date.now();
let indice=0;


document.addEventListener('DOMContentLoaded', () => {
    plotChart(dataPoints);
  });


function plotChart(dataPoints) {
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Temperatura',
                data: dataPoints,
                borderColor: 'rgba(80, 86, 234, 1)',
                backgroundColor: 'rgba(107, 114, 255, 1)',
                borderWidth: 2,
                fill: false,
            },{
                label: 'Limite',
                data: dataPoints2,
                borderColor: 'rgba(255, 69, 0, 1)',
                backgroundColor: 'rgba(255, 69, 0, 0.5)',
                borderWidth: 2,
                fill: false,
            }]
        },
        options: {
            elements: {
                line: {
                    borderColor: 'blue' // Cambia el color de los bordes del gráfico
                }
            },
            interaction: {
                mode: 'nearest',
                intersect: false,
            },
            scales: {
                x: {
                    
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    max: 10 / zoomLevel,
                    tickFormat: value => value + ' [s]' 
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    min: yMin,
                    max: yMax
                }
            },
            plugins: {
                
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy',
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                        onPan: handlePan
                    },
                    drawBackground: {
                        color: 'white'
                    }
                }
            }
        }
    });
}

function saveInputValues(x, y) {
    dataPoints.push({ x, y });
}

function saveInputValues2(x, y) {
    dataPoints2.push({ x, y });
}

function clearData() {
    dataPoints.length = 0;
    dataPoints2.length = 0;
    startedDate = Date.now();
    plotChart(dataPoints);
}

function loadInputValues() {
    dataPoints.forEach(point => {
        xInput.value = point.x;
        yInput.value = point.y;
        saveInputValues(point.x, point.y);
    });
}

function handlePan({ deltaX, deltaY }) {
    if (deltaX !== 0 || deltaY !== 0) {
        const xScale = chart.scales.x;
        const yScale = chart.scales.y;
        const xDiff = xScale.max - xScale.min;
        const yDiff = yScale.max - yScale.min;
        const xPan = deltaX * (xDiff / chart.width);
        const yPan = deltaY * (yDiff / chart.height);
        xScale.options.min -= xPan;
        xScale.options.max -= xPan;
        yScale.options.min += yPan;
        yScale.options.max += yPan;
        chart.update();
    }
}

loadInputValues();


function addNewValues(x){

    var ahora = Date.now() - startedDate;

    var segundos = Math.floor(ahora / 1000);
  

    if (!isNaN(x)) {
        saveInputValues(segundos, x);
        plotChart(dataPoints);
    }

}






clearButton.addEventListener('click', () => {
    clearData();
});

function resetZoom(){
        zoomLevel = 1;
        plotChart(dataPoints);    
};

chartCanvas.addEventListener('mousedown', (event) => {
    isDragging = true;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
});

chartCanvas.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const deltaX = event.clientX - dragStartX;
        const deltaY = event.clientY - dragStartY;
        handlePan({ deltaX, deltaY });
        dragStartX = event.clientX;
        dragStartY = event.clientY;
    }
});

chartCanvas.addEventListener('mouseup', () => {
    isDragging = false;
});

chartCanvas.addEventListener('mouseleave', () => {
    isDragging = false;
});


chartCanvas.addEventListener('wheel', (event) => {

    event.preventDefault();
    const delta = event.deltaY || event.wheelDelta;
    let newZoomLevel;
    if(delta > 0) {
      // zoom out
      newZoomLevel = zoomLevel * 0.9; 
    } else {
      // zoom in  
      newZoomLevel = zoomLevel * 1.1;
    }
    newZoomLevel = Math.max(0.01, newZoomLevel);
    zoomLevel = newZoomLevel;
    plotChart(dataPoints);
  
  });

  

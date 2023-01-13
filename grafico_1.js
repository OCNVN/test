const dataURL = "https://raw.githubusercontent.com/bry-11/Herramientas/main/cruces_fronterizos_desde_ucrania_desde_el_24_de_febrero_de_2022.csv";

var tooltipEntrada = d3.select('.tooltip-area-entrada')
    .style('opacity', 0);
var tooltipSalida = d3.select('.tooltip-area-salida')
    .style('opacity', 0);

const mouseoverEntrada = (event, d) => {
    tooltipEntrada.style("opacity", 1);
};

const mouseleaveEntrada = (event, d) => {
    tooltipEntrada.style('opacity', 0);
}

const mousemoveEntrada = (event, d) => {
    const text = d3.select('.tooltip-area-entrada__text');
    const [x, y] = d3.pointer(event);

    text.html(`<span>${(d.Entrada / 1000000).toFixed(2)} mill</span><span>${d.Periodo.replace('Día ', '')} - ${d['Año']}</span>`);

    tooltipEntrada.style('transform', `translate(${x}px, ${y + 390}px)`);
};

const mouseoverSalida = (event, d) => {
    tooltipSalida.style("opacity", 1);
};

const mouseleaveSalida = (event, d) => {
    tooltipSalida.style('opacity', 0);
}

const mousemoveSalida = (event, d) => {
    const text = d3.select('.tooltip-area-salida__text');
    const [x, y] = d3.pointer(event);

    text.html(`<span>${(d.Salida / 1000000).toFixed(2)} mill</span><span>${d.Periodo.replace('Día ', '')} - ${d['Año']}</span>`);

    tooltipSalida.style('transform', `translate(${x}px, ${y + 390}px)`);
};

d3.csv(dataURL).then ( _data => {

    /******************/
    /* PRIMER GRAFICO */
    /******************/

    const data = _data.map(_d => ( {..._d, Salida: Number(_d.Salida.replaceAll('.', '')), Entrada: Number(_d.Entrada.replaceAll('.', ''))} ));

    const salidas = data.map(d => d.Salida);
    const n = data.length;

    const salidaMinimo = Math.min.apply(null, salidas);
    const salidaMaximo = Math.max.apply(null, salidas);

    // Grafico Entrada
    const barras = d3.select(".grafico")
        .selectAll('div') // Seleccionar todos los elementos div dentro de la selección
        .data(data) // Los datos en base a los cuales se crearan los elementos
        .enter() // Conecta los data con los elementos del DOM
        .append('div') // Agrega un elemento div en cada iteración
        .attr("id", (d, i) => `a${i}`) // Asignar id a cada elemento
        .classed("bar", true) // Agregar estilo
        .style( "height", d => `${d.Salida / 100000}px`) // Asignar alto
        .style( "background-color", d => {
            // Asigna los colores dependiendo de la tasa de desempleo
            var x = salidaMaximo - d.Salida;
            var g = (255 * x)/salidaMaximo;
            var r = 255 - g;
            return "rgb(" + r + "," + g + ", 0)"
        })
        .style( "margin-top", "50px");


    // Control de eventos de mouse para mostrar el valor de cada barra
    // dependiendo de la posicion del raton modifica el css de la barra
    barras.on("mouseover", event => {
        const barra = d3.select(event.target.parentElement.parentElement);
        barra.classed("bar-mousehover", true);
        barra.classed("bar-mouseout", false);
    })
    barras.on("mouseout", event => {
        const barra = d3.select(event.target.parentElement.parentElement);
        barra.classed("bar-mousehover", false);
        barra.classed("bar-mouseout", true);
    });


    // Agregar tooltip a cada barra
    barras.append('div')
        .classed("tooltip", true)
        .html(d => `<span>${d.Salida}</span><span>${d.Periodo}/${d['Año']}</span>`)
        // .text( d => ``) // Agrega texto dentro

        
    //Creación de eje inferior

    // Creación de una escala
    var scale = d3.scaleLinear()
    .domain([0, 125]) //total de 125 meses
    .range([0, 900]);

    // Creación de un eje
    var axis = d3.axisBottom(scale)

    // Seleccionamos el grupo dentro del svg
    d3.select('.eje')  
    .attr("transform", "translate(55, 0)") // Se alínea a la derecha
    .call(axis);  // Se inserta el eje

    //Creación de eje izquierdo

    // Creación de una escala
    var scale2 = d3.scaleLinear()
    .domain([10000000, 0]) //Hasta 10 millones
    .range([0, 110]);

    // Creación de un eje
    var axis2 = d3.axisLeft(scale2)

    // Seleccionamos el grupo dentro del svg
    d3.select('.eje2')  
    .attr("transform", "translate(30, 70)") // Se alínea a la derecha y abajo
    .call(axis2);  // Se inserta el eje
            




    /*******************/
    /* SEGUNDO GRAFICO */
    /*******************/

    // Margenes y dimensiones
    const margin = {top: 50, right: 50, bottom: 50, left: 50}
    , width = window.innerWidth - margin.left - margin.right // Utilizamos el ancho de la ventana
    , height = window.innerHeight - margin.top - margin.bottom; // Utilizamos el alto de la ventana


    // Escalador lineal para eje X
    // var xScale = d3.scaleLinear()
    var xScale = d3.scalePoint()
    .domain(data.map(d => `${d['Año']}/${d.Periodo}`)) // Periodo
    .range([0, width]);

    // Escalador lineal para eje Y
    var yScale = d3.scaleLinear()
    .domain([0, 10000000]) // Dominio 10 millones 
    .range([height, 0]);

    // Generador de lineas Salida
    var lineSalida = d3.line()
    .x(function(d, i) { return xScale(`${d['Año']}/${d.Periodo}`); }) // Valores X
    .y(function(d) { return yScale(d.Salida); }) // Valores Y
    .curve(d3.curveMonotoneX) // Aplicar suavizador

    // Generador de lineas Entraad
    var lineEntrada = d3.line()
    .x(function(d, i) { return xScale(`${d['Año']}/${d.Periodo}`); }) // Valores X
    .y(function(d) { return yScale(d.Entrada); }) // Valores Y
    .curve(d3.curveMonotoneX) // Aplicar suavizador

    // Crear SVG y agregarlo al body del documento HTML
    var svg = d3.select("#div_grafico_tipo_1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Crear eje X
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).tickFormat(function(d, i) {
        return (i % 15) === 0 ? d.split('/')[1].replace('Día ', '') : null;
      }));

    // Crear eje Y
    svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale).tickFormat(function(d, i) {
        return `${d / 1000000} mill`;
      }));

    // Dibujar linea Salida
    svg.append("path")
    .datum(data) // Enlaza datos con la linea
    .attr("class", "line-salida") // Estilos
    .attr("d", lineSalida); // Llamar al generador de lineas

    // Dibujar linea Entrada
    svg.append("path")
    .datum(data) // Enlaza datos con la linea
    .attr("class", "line-entrada") // Estilos
    .attr("d", lineEntrada); // Llamar al generador de lineas

    
    // Dibujar circulos Entrada
    svg.selectAll(".dotEntrada")
    .data(data)
    .enter().append("circle") // Utiliza append para agregar circulos
    .attr("class", "dot") // Estilos
    .attr("cx", function(d, i) { return xScale(`${d['Año']}/${d.Periodo}`) })
    .attr("cy", function(d) { return yScale(d.Entrada) })
    .attr("r", 5)
    .on("mousemove", mousemoveEntrada) // Listeners para el tooltip
    .on("mouseleave", mouseleaveEntrada) // Listeners para el tooltip
    .on("mouseover", mouseoverEntrada); // Listeners para el tooltip
    
    // Dibujar circulos Salida
    svg.selectAll(".dotSalida")
    .data(data)
    .enter().append("circle") // Utiliza append para agregar circulos
    .attr("class", "dot-salida") // Estilos
    .attr("cx", function(d, i) { return xScale(`${d['Año']}/${d.Periodo}`) })
    .attr("cy", function(d) { return yScale(d.Salida) })
    .attr("r", 5)
    .on("mousemove", mousemoveSalida) // Listeners para el tooltip
    .on("mouseleave", mouseleaveSalida) // Listeners para el tooltip
    .on("mouseover", mouseoverSalida); // Listeners para el tooltip

    // Leyenda
    svg.append("circle").attr("cx",30).attr("cy",20).attr("r", 6).style("fill", "#8899FF");
    svg.append("circle").attr("cx",30).attr("cy",50).attr("r", 6).style("fill", "#ffab00");
    svg.append("text").attr("x", 50).attr("y", 20).text("Salida").style("font-size", "15px").attr("alignment-baseline","middle");
    svg.append("text").attr("x", 50).attr("y", 50).text("Entrada").style("font-size", "15px").attr("alignment-baseline","middle");

})

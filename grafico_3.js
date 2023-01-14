d3.json(
    "https://raw.githubusercontent.com/OCNVN/test/main/data.json"
  ).then(function (datos) {
    var data = datos.sort((a, b) => a.nota - b.nota);
    // var data = data.sort((a, b) => a.nota - b.nota);
    var color = d3.scaleOrdinal().range(d3.schemeSet3);
    var width = 600;
    var height = 500;

    // Crear SVG y agregarlo al body del documento HTML
    var svg = d3.select("#examen").append("svg")
    .attr("width", width + 100)
    .attr("height", height + 100)
    .append("g")
    .attr("transform", "translate(" + 50 + "," + 50 + ")");;

    // Escalador lineal para eje X
    var xScale = d3.scaleLinear()
    .domain([0, 10]) // Nota
    .range([0, width]);

    // Escalador lineal para eje Y
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d.ranking)]) // Ranking
    .range([height, 0]);

    // Escalador para color
    var colorScale = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d.ranking)])
    .range([0, 255]);

    // Escalador para radio
    var radioScale = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d.ranking)])
    .range([3, 15]);

    // Crear eje X
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

    // Crear eje Y
    svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale));

    // Generador de linea
    var lineSalida = d3.line()
    .x(function(d, i) { return xScale(d.nota); }) // Valores X
    .y(function(d) { return yScale(d.ranking); }) // Valores Y
    .curve(d3.curveMonotoneX) // Aplicar suavizador

    // // Dibujar linea
    // svg.append("path")
    // .datum(data) // Enlaza datos con la linea
    // .attr("class", "line-salida") // Estilos
    // .attr("d", lineSalida); // Llamar al generador de lineas

    // Dibujar circulos Entrada
    svg.selectAll(".dotEntrada")
    .data(data)
    .enter().append("circle") // Utiliza append para agregar circulos
    // .attr("class", "dot") // Estilos
    .attr("cx", function(d, i) { return xScale(d.nota) })
    .attr("cy", function(d) { return yScale(d.ranking) })
    .attr("r", (d) => radioScale(d.ranking))
    .style("fill", (d) => `rgb(0, ${colorScale(d.ranking)}, ${colorScale(d.ranking)})`)
    .on("mouseover", (d) => {
        tooltip.text(d.nota + " : " + d.ranking);
        return tooltip.style("visibility", "visible");
      })
    .on("mousemove", function () {
        console.log('mousemove')
        return tooltip
          .style("top", d3.event.pageY - 10 + "px")
          .style("left", d3.event.pageX + 10 + "px");
      });

  
    var tooltip = d3
    .select("#examen")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", 10)
    .style("visibility", "hidden")
    .text("Tooltip");
  });
  
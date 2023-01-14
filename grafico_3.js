d3.json(
    "https://raw.githubusercontent.com/OCNVN/test/main/data.json"
  ).then(function (datos) {
    var data = datos;
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
    .domain([0, 100]) // Ranking
    .range([height, 0]);

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

    // Dibujar linea
    svg.append("path")
    .datum(data) // Enlaza datos con la linea
    .attr("class", "line-salida") // Estilos
    .attr("d", lineSalida); // Llamar al generador de lineas

    // Dibujar circulos Entrada
    svg.selectAll(".dotEntrada")
    .data(data)
    .enter().append("circle") // Utiliza append para agregar circulos
    .attr("class", "dot") // Estilos
    .attr("cx", function(d, i) { return xScale(d.nota) })
    .attr("cy", function(d) { return yScale(d.ranking) })
    .attr("r", 5);

  
    // var elementSVG = d3
    //   .select("#examen")
    //   .append("svg")
    //   .attr("width", width)
    //   .attr("height", height)
    //   .attr("transform", "translate(0,0)");
  
    // (margin = { top: 20, right: 20, bottom: 30, left: 80 });
    // // (margin = { top: 20, right: 20, bottom: 30, left: 80 }),
    // //   (width = 960 - margin.left - margin.right),
    // //   (height = 1000 - margin.top - margin.bottom);
  
    // var x = d3.scaleLinear().range([0, width]);
    // var y = d3.scaleBand().range([height, 0]);
    // ///////////
  
    // var chart = elementSVG
    //   .append("g")
    //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    // var x = d3
    //   .scaleLinear()
    //   .range([0, width * 0.95])
    //   .domain([
    //     0,
    //     d3.max(data, function (d) {
    //       return d.Valor;
    //     }),
    //   ]);
  
    // var y = d3
    //   .scaleBand()
    //   .range([height, 0])
    //   .domain(
    //     data.map(function (d) {
    //       return d.Parametro;
    //     })
    //   )
    //   .padding(0.3);
  
    // chart.append("g").call(d3.axisLeft(y));
  
    // chart
    //   .selectAll("rect")
    //   .data(data)
    //   .enter()
    //   .append("rect")
    //   .attr("x", 0)
    //   .attr("height", y.bandwidth())
    //   .attr("y", function (d) {
    //     return y(d.Parametro);
    //   })
    //   .attr("width", function (d) {
    //     return x(d.Valor);
    //   })
    //   .attr("fill", (d) => color(d.Parametro))
    //   .on("mouseover", (d) => {
    //     tooltip.text(d.Parametro + " : " + d.Valor.toFixed(2));
    //     return tooltip.style("visibility", "visible");
    //   })
    //   .on("mousemove", function () {
    //     return tooltip
    //       .style("top", d3.event.pageY - 10 + "px")
    //       .style("left", d3.event.pageX + 10 + "px");
    //   })
    //   .on("mouseout", () => tooltip.style("visibility", "hidden"));
  
    // var tooltip = d3
    //   .select("#barchart")
    //   .append("div")
    //   .attr("class", "tooltip")
    //   .style("position", "absolute")
    //   .style("z-index", 10)
    //   .style("visibility", "hidden")
    //   .text("Simple text");
  });
  
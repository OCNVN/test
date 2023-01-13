d3.json(
  "https://raw.githubusercontent.com/bry-11/Herramientas/main/refugiados_ucranianos_registrados_en_cada_pais_europeo_por_la_invasion_rusa.json"
).then(function (datos) {
  var data = datos.Respuesta.Datos.Metricas[0].Datos;
  var data = data.sort((a, b) => a.Valor - b.Valor);
  var color = d3.scaleOrdinal().range(d3.schemeSet3);
  var width = 960;
  var height = 900;

  var elementSVG = d3
    .select("#barchart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(0,0)");

  (margin = { top: 20, right: 20, bottom: 30, left: 80 }),
    (width = 960 - margin.left - margin.right),
    (height = 1000 - margin.top - margin.bottom);

  var x = d3.scaleLinear().range([0, width * 0.95]);
  var y = d3.scaleBand().range([height, 0]);
  ///////////

  var chart = elementSVG
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3
    .scaleLinear()
    .range([0, width * 0.95])
    .domain([
      0,
      d3.max(data, function (d) {
        return d.Valor;
      }),
    ]);

  var y = d3
    .scaleBand()
    .range([height, 0])
    .domain(
      data.map(function (d) {
        return d.Parametro;
      })
    )
    .padding(0.3);

  chart.append("g").call(d3.axisLeft(y));

  chart
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("height", y.bandwidth())
    .attr("y", function (d) {
      return y(d.Parametro);
    })
    .attr("width", function (d) {
      return x(d.Valor);
    })
    .attr("fill", (d) => color(d.Parametro))
    .on("mouseover", (d) => {
      tooltip.text(d.Parametro + " : " + d.Valor.toFixed(2));
      return tooltip.style("visibility", "visible");
    })
    .on("mousemove", function () {
      return tooltip
        .style("top", d3.event.pageY - 10 + "px")
        .style("left", d3.event.pageX + 10 + "px");
    })
    .on("mouseout", () => tooltip.style("visibility", "hidden"));

  var tooltip = d3
    .select("#barchart")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", 10)
    .style("visibility", "hidden")
    .text("Simple text");
});

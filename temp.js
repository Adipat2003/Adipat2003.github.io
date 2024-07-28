const margin = { top: 70, right: 30, bottom: 40, left: 80 };
const width = 1450 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const x = d3.scaleTime().rangeRound([0, width]);
const y = d3.scaleLinear().rangeRound([height, 0]);

const tooltip = d3.select("body")
          .append("div")
          .attr("class", "tooltip");

const annotation_vals = [[
  {
    note: {
      label: "Nvidia's GeForce 10 series, unveiled in 2016, introduced the GTX 1080 and 1070 GPUs with Pascal architecture, outperforming the Titan X and featuring SMP for enhanced multi-monitor and VR rendering.",
      title: "First GPU Launch",
      wrap: 200
    },
    x: 505,
    y: 242,
    dy: -55,
    dx: -35
  }
],[
  {
    note: {
      label: "Intel, dominating the data center market, plans to launch the Xeon Phi processor to boost deep learning by 100 times by 2020.",
      title: "Nvidia stock affected by Intel",
      wrap: 200
    },
    x: 338,
    y: 242,
    dy: -100,
    dx: -35
  },
  {
    note: {
      label: "Nvidia officially released the Titan V.",
      title: "Huge Launch to Pave a Future",
      wrap: 200
    },
    x: 1243,
    y: 200,
    dy: -100,
    dx: -35
  }
],[{
  note: {
    label: "Nvidia developed an open-source ventilator, announced the Ampere GPU microarchitecture and A100 GPU accelerator.",
    title: "Developments in GPU Tech",
    wrap: 200
  },
  x: 841,
  y: 130,
  dy: -30,
  dx: -15
}],[{
  note: {
    label: "Nvidia expanded its high-performance computing market with the Mellanox acquisition, launched RTX Studio laptops, and introduced real-time ray tracing in Minecraft.",
    title: "Laptop Production",
    wrap: 250
  },
  x: 425,
  y: 200,
  dy: -100,
  dx: -35
}],
[
  {
    note: {
      label: "Nvidia developed an open-source ventilator, announced the Ampere GPU microarchitecture and A100 GPU accelerator.",
      title: "Developments in GPU",
      wrap: 200
    },
    x: 196,
    y: 100,
    dy: -50,
    dx: -1
  }
],[{
  note: {
    label: "Nvidia's top scientists developed an open-source ventilator to address the global coronavirus pandemic shortage. Nvidia also announced their Ampere GPU microarchitecture and the Nvidia A100 GPU accelerator, and entered talks with SoftBank to buy Arm, a UK-based chip designer, for $32 billion.",
    title: "Covid Causes Problems",
    wrap: 900
  },
  x: 1125,
  y: 70,
  dy: -15,
  dx: -100
}],[{
  note: {
    label: "The proposed takeover of Arm Holdings by Nvidia was stalled due to significant competition concerns raised by the UK’s Competition and Markets Authority. The European Commission also opened a competition investigation, stating that the acquisition could restrict competitors’ access to Arm’s products and give Nvidia too much internal information on its competitors.",
    title: "Nvidia's Attempted Acquisition of Arm Holdings",
    wrap: 850
  },
  x: 892,
  y: 70,
  dy: -15,
  dx: -15
}],[{
  note: {
    label: "NVIDIA announced six new RTX Ada Lovelace GPUs for laptops and desktops, enhancing AI, design, and metaverse applications.",
    title: "NVIDIA’s New RTX Ada Lovelace GPUs",
    wrap: 200
  },
  x: 1200,
  y: 150,
  dy: -40,
  dx: -20
}],[]
]

const svg = d3.select("#chart-container")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const svg2 = d3.select("#chart-container-2")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const years = ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"];

  let currentYearIndex = 0;
  
  years.forEach((year, index) => {
    d3.select("#buttons")
      .append("button")
      .attr("class", "year-button")
      .text(year)
      .on("click", function() {
        currentYearIndex = index; // Update currentYearIndex to the selected year's index
        loadDataAndDrawGraph(year);
        loadDataAndDrawGraph2(year);
      });
  });
  
  d3.select("#buttons")
    .append("button")
    .attr("class", "year-button")
    .text("Next")
    .on("click", function() {
      currentYearIndex++;
  
      if (currentYearIndex >= years.length) {
        currentYearIndex = years.length - 1;
      }
  
      const nextYear = years[currentYearIndex];
  
      loadDataAndDrawGraph(nextYear);
      loadDataAndDrawGraph2(nextYear);
    });
    

  function loadDataAndDrawGraph(year) {
    d3.csv("nvidia_stock.csv", d3.autoType).then(function(data) {
      const filteredData = data.filter(d => d.date.getFullYear().toString() === year);
  
      svg.selectAll("*").remove();
  
      x.domain(d3.extent(filteredData, d => d.date));
      y.domain([0, d3.max(filteredData, d => d.high)]);
  
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat('%B %Y')));
  
      svg.append("g")
        .call(d3.axisLeft(y));
  
      const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.high));
  
      svg.append("path")
        .datum(filteredData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);
  
      svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text(`Nvidia Stock Price (high) for ${year}`);
  
      const circle = svg.append("circle")
        .attr("r", 0)
        .attr("fill", "steelblue")
        .style("stroke", "white")
        .attr("opacity", .70)
        .style("pointer-events", "none");
  
      const listeningRect = svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("opacity", 0); // make it invisible
  
      listeningRect.on("mousemove", function (event) {
        const [xCoord] = d3.pointer(event, this);
        const bisectDate = d3.bisector(d => d.date).left;
        const x0 = x.invert(xCoord);
        const i = bisectDate(filteredData, x0, 1);
        const d0 = filteredData[i - 1];
        const d1 = filteredData[i];
        const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        const xPos = x(d.date);
        const yPos = y(d.high);
        
        console.log(yPos)
        circle
          .attr("cx", xPos)
          .attr("cy", yPos);

        circle.transition()
          .duration(50)
          .attr("r", 5);

          tooltip
          .style("display", "block")
          .style("left", `${xPos + 100}px`)
          .style("top", `${yPos - 100}px`)
          .html(`<strong>Date:</strong> ${d.date.toLocaleDateString()}<br><strong>High:</strong> ${d.high.toFixed(2)}<br><br><strong>DIGGING DEEPER</strong><br><br><strong>Low:</strong> ${d.low.toFixed(2)}<br><strong>Open:</strong> ${d.open.toFixed(2)}<br><strong>Close:</strong> ${d.close.toFixed(2)}`)
  
      });

      listeningRect.on("mouseout", function() {
        tooltip.style("display", "none");
        circle.transition()
          .duration(50)
          .attr("r", 0);
      });      
    });
  }

function loadDataAndDrawGraph2(year) {
  d3.csv("nvidia_stock.csv", d3.autoType).then(function(data) {
    const filteredData = data.filter(d => d.date.getFullYear().toString() === year);

    svg2.selectAll("*").remove();

    x.domain(d3.extent(filteredData, d => d.date));
    y.domain([0, d3.max(filteredData, d => d.volume)]);

    svg2.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat('%B %Y')));

    svg2.append("g")
      .call(d3.axisLeft(y));

    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.volume));

    svg2.append("path")
      .datum(filteredData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    svg2.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("text-decoration", "underline")
      .text(`Trading Volume ($) for ${year}`);
      
      const makeAnnotations = d3.annotation().annotations(annotation_vals[Number(year)- 2016])
      svg2.append("g").call(makeAnnotations)
  });
}

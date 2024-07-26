const margin = { top: 70, right: 30, bottom: 40, left: 80 };
const width = 1450 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Set up the x and y scales
const x = d3.scaleTime().rangeRound([0, width]);
const y = d3.scaleLinear().rangeRound([height, 0]);

// Create the SVG element and append it to the chart container
const svg = d3.select("#chart-container")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Create a new SVG element for the second graph and append it to a new container
const svg2 = d3.select("#chart-container-2")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Create an array of years
const years = ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"];

// Define a variable to keep track of the current year index
let currentYearIndex = 0;

// Create a button for each year
years.forEach(year => {
  d3.select("#buttons")
    .append("button")
    .attr("class", "year-button")
    .text(year)
    .on("click", function() {
      loadDataAndDrawGraph(year);
      loadDataAndDrawGraph2(year);
      loadannotations(year);
    });
});

// Create the "Next" button
d3.select("#buttons")
  .append("button")
  .attr("class", "year-button")
  .text("Next")
  .on("click", function() {
    // Increment the current year index
    currentYearIndex++;

    // If the current year index exceeds the length of the years array, reset it to 0
    if (currentYearIndex >= years.length) {
      currentYearIndex = years.length - 1;
    }

    // Get the next year
    const nextYear = years[currentYearIndex];

    // Load data and draw graphs for the next year
    loadDataAndDrawGraph(nextYear);
    loadDataAndDrawGraph2(nextYear);
    loadannotations(nextYear);
  });

  function loadDataAndDrawGraph(year) {
    // Load and Process Data
    d3.csv("nvidia_stock.csv", d3.autoType).then(function(data) {
      // Filter the data based on the selected year
      const filteredData = data.filter(d => d.date.getFullYear().toString() === year);
  
      // Clear the existing graph
      svg.selectAll("*").remove();
  
      // Define the x and y domains
      x.domain(d3.extent(filteredData, d => d.date));
      y.domain([0, d3.max(filteredData, d => d.high)]);
  
      // Add the x-axis
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat('%B %Y')));
  
      // Add the y-axis
      svg.append("g")
        .call(d3.axisLeft(y));
  
      // Create the line generator
      const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.high));
  
      // Add the line path to the SVG element
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
  
      // create a listening rectangle
      const listeningRect = svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("opacity", 0); // make it invisible
      
        const tooltip = d3.select("body")
          .append("div")
          .attr("class", "tooltip");
  
      listeningRect.on("mousemove", function (event) {
        const [xCoord] = d3.pointer(event, this);
        const bisectDate = d3.bisector(d => d.date).left;
        const x0 = x.invert(xCoord);
        const i = bisectDate(data, x0, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        const xPos = x(d.date);
        const yPos = y(d.high);
  
        circle
          .attr("cx", xPos)
          .attr("cy", yPos);

        circle.transition()
          .duration(50)
          .attr("r", 5);

          tooltip
          .style("display", "block")
          .style("left", `${xPos + 100}px`)
          .style("top", `${yPos + 50}px`)
          .html(`<strong>Date:</strong> ${d.date.toLocaleDateString()}<br><strong>High:</strong> ${d.high.toFixed(2)}<br><br><strong>DIGGING DEEPER</strong><br><br><strong>Low:</strong> ${d.low.toFixed(2)}<br><strong>Open:</strong> ${d.open.toFixed(2)}<br><strong>Close:</strong> ${d.close.toFixed(2)}`)
  
        console.log(xPos)
      });

      listeningRect.on("mouseout", function() {
        tooltip.style("display", "none");
        circle.transition()
          .duration(50)
          .attr("r", 0);
      });      
    });
  }
  
const annotationDate = new Date("2019-11-02");

function loadDataAndDrawGraph2(year) {
  d3.csv("nvidia_stock.csv", d3.autoType).then(function(data) {
    const filteredData = data.filter(d => d.date.getFullYear().toString() === year);

    svg2.selectAll("*").remove();

    x.domain(d3.extent(filteredData, d => d.date));
    y.domain([0, d3.max(filteredData, d => d.volume)]);

    // Add the x-axis
    svg2.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat('%B %Y')));

    // Add the y-axis
    svg2.append("g")
      .call(d3.axisLeft(y));

    // Create the line generator
    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.volume));

    // Add the line path to the SVG element
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
    
      const annotations = [
        {
          note: {
            label: "Important event",
            title: "11/2/2019"
          },
          x: x(annotationDate),
          y: y(yourYValue), // Replace 'yourYValue' with the actual y-value for the annotation
          dx: 30,
          dy: -30
        }
      ];
    
      const makeAnnotations = d3.annotation()
        .annotations(annotations);
    
      svg2.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
  });
}

function loadannotations(year) {
  // Load and Process Data
  d3.csv("nvidia_stock.csv", d3.autoType).then(function(data) {
    // Filter the data based on the selected year
    const filteredData = data.filter(d => d.date.getFullYear().toString() === year);

    // Define the x and y domains
    x.domain(d3.extent(filteredData, d => d.date));
    y.domain([0, d3.max(filteredData, d => d.high)]);

    let specificDate = "2021-07-22"; // YYYY-MM-DD format
    specificDate = d3.timeParse("%Y-%m-%d")(specificDate);
    console.log(specificDate)

    // Find the data point for the specific date
    let specificDataPoint = filteredData.find(d => +d.date === +specificDate);

    if (specificDataPoint) {
      let correspondingValue = specificDataPoint.volume;

      let xCoordinate = x(specificDate);
      let yCoordinate = y(correspondingValue);

      console.log("X Coordinate: ", xCoordinate);
      console.log("Y Coordinate: ", yCoordinate);

      // Create the annotation
      const annotations = [{
        note: {
          label: "This is the high stock price for " + specificDate,
          title: "Annotation for " + specificDate,
        },
        x: xCoordinate,
        y: yCoordinate,
        dy: 100,
        dx: 100
      }];

      // Add annotation to the svg
      const makeAnnotations = d3.annotation()
        .annotations(annotations);

        svg.call(makeAnnotations)
          .selectAll(".annotation-note-label, .annotation-note-title")
          .style("fill", "black") // Change the text color to black
          .style("font-size", "16px"); // Change the font size to 16
    } else {
      console.log("No data for the specific date");
    }
  });
}
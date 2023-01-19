function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data); // DEBUGGING
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  console.log(newSample);  // DEBUGGING
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(subjectId) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == subjectId);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    console.log ("---------------NEW SELECTION----------------");  // DEBUG
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      console.log(`${key}: ${value}`) // DEBUGGING
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(subjectId) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {

    // Deliverable 1: 3. Create a variable that holds the samples array of the data. 
    var samples = data.samples;
    var metadata = data.metadata;

    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultSampleArray = samples.filter(sampleObj => sampleObj.id == subjectId);
    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var resultSample = resultSampleArray[0];
    
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var resultMetadataArray = metadata.filter(sampleObj => sampleObj.id == subjectId);
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var resultMetadata = resultMetadataArray[0];
    
    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = resultSample.otu_ids;
    var otuLabels = resultSample.otu_labels;
    var sampleValues = resultSample.sample_values;


    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var wFreq = parseFloat(resultMetadata.wfreq);

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks = otuIds.slice(0,10).map(id => "OTU " + id).reverse();

    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = {
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text: otuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    };

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",
      margin: {
        l: 100,
        r: 100,
        t: 80,
        b: 100
      }
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);

    // Deliverable 2: 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: otuIds,
        size: sampleValues
      }
    };

    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: '<b>Bacteria Cultures Per Sample</b>',
      xaxis: {
        title: {
          text: 'OTU ID',
        },
      },
      hovermode: 'closest',
      showlegend: false,
      height: 600,
      width: 1200,
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };

    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', [bubbleData], bubbleLayout);

    // Deliverable 3: 4. Create the trace for the gauge chart.
    var GaugeData = [
      {
        value: wFreq,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [0, 10], tickwidth: 2, tickcolor: "black" },
          bar: { color: "black" },
          bgcolor: "white",
          borderwidth: 1,
          bordercolor: "black",
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "yellowgreen" },
            { range: [8, 10], color: "forestgreen" }
          ],
        }
      }
    ];

    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };

    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', GaugeData, gaugeLayout);
  });
}

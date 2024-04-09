// Function to fetch JSON data
let jsonData 
//console.log("js is loaded")
function fetchJSONData() {
  const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';
  //console.log("fetch json data")
return d3.json(url)
  
}

// Function to create horizontal bar chart
function createBarChart(data) {
  
  const sampleValues = data.sample_value;
  const otuIds = data.otu_ids.map(entry => `otu ${entry}`);

  const trace = {
    x: sampleValues,
    y: otuIds,
    type: 'bar',
    orientation: 'h',
    marker: {
      color: 'rgba(54, 162, 235, 0.6)',
      line: {
        color: 'rgba(54, 162, 235, 1)',
        width: 1
      }
    }
  };

  const layout = {
    title: 'Horizontal Bar Chart',
    xaxis: {
      title: 'Sample Values',
      tickformat: ',d' // Format ticks as integers
    },
    yaxis: {
      title: 'OTU IDs'
    }
  };

  // Create the bar chart using Plotly
  Plotly.newPlot('bar', [trace], layout);
}

function createBubbleChart(data) {
  const trace = {
    x: data.otu_ids,
    y: data.sample_values,
    mode: 'markers',
    marker: {
      size: data.sample_values,
      color: data.otu_ids,
      colorscale: 'Earth',
      opacity: 0.8
    },
    text: data.otu_labels
  };

  const layout = {
    title: 'Bubble Chart',
    xaxis: { title: 'OTU ID' },
    yaxis: { title: 'Sample Values' }
  };

  Plotly.newPlot('bubble', [trace], layout);
}

// Function to update sample metadata
function updateSampleMetadata(metadata) {
  const metadataDiv = document.getElementById('sample-metadata');
  metadataDiv.innerHTML = '';

  Object.entries(metadata).forEach(([key, value]) => {
    const p = document.createElement('p');
    p.textContent = `${key}: ${value}`;
    metadataDiv.appendChild(p);
  });
}

// Function to handle dropdown change event
function handleClick(event) {
  const value = event.target.value;
  optionChanged(value);
}

// Fetch JSON data and populate dropdown on page load
window.onload = function() {
 // console.log("onload")
  fetchJSONData()
    .then(response => {
      jsonData = response
        console.log(jsonData)
      const dropdown = document.getElementById('selDataset');
      jsonData.names.forEach(sample => {
        const option = document.createElement('option');
        option.value = sample;
        option.textContent = sample;
        dropdown.appendChild(option);
      });

      const initialSampleId = jsonData.names[0];
      optionChanged(initialSampleId);
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
};

// Function to handle dropdown change event
function optionChanged(value) {

      const selectedSample = jsonData.samples.find(sample => sample.id == value);
      const selectedmetadata = jsonData.metadata.find(sample => sample.id == value);
      if (selectedSample) {
        createBubbleChart(selectedSample);
        createBarChart(selectedSample);
        updateSampleMetadata(selectedmetadata);
      } else {
        console.error('Selected sample not found');
      }

}
// Function to fetch JSON data
function fetchJSONData() {
  const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';
  return new Promise((resolve, reject) => {
    d3.json(url, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

// Function to create horizontal bar chart
function createBarChart(data) {
  const ctx = document.getElementById('bar').getContext('2d');
  const sampleValues = data.map(entry => entry.sample_value);
  const otuIds = data.map(entry => entry.otu_id);

  const barChart = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
      labels: otuIds,
      datasets: [{
        label: 'Sample Values',
        data: sampleValues,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

// Function to create bubble chart
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
  fetchJSONData()
    .then(jsonData => {
        console.log(jsonData)
      const dropdown = document.getElementById('selDataset');
      jsonData.forEach(sample => {
        const option = document.createElement('option');
        option.value = sample.id;
        option.textContent = sample.id;
        dropdown.appendChild(option);
      });

      dropdown.addEventListener('change', handleClick);

      const initialSampleId = jsonData[0].id;
      optionChanged(initialSampleId);
    })
    .catch(error => {
      console.error('Error:', error.message);
    });

  // Fetch JSON data and create chart on page load
  fetchJSONData()
    .then(jsonData => {
      createBarChart(jsonData);
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
};

// Function to handle dropdown change event
function optionChanged(value) {
  fetchJSONData()
    .then(jsonData => {
      const selectedSample = jsonData.find(sample => sample.id === value);
      if (selectedSample) {
        createBubbleChart(selectedSample);
        updateSampleMetadata(selectedSample.metadata);
      } else {
        console.error('Selected sample not found');
      }
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
}
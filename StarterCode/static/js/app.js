// Use D3 to read in the json from the url
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

d3.json(url).then(function(data) {
    console.log(data);
})

// Horizontal bar chart with a dropdown menu that display the top 10 OTU's found in that indiviual one

function bar_chart(sample) {
    d3.json(url).then(function(data) {  
        let sample_values1 = data.samples;
        let sampler = sample_values1.filter(sample_res => sample_res.id == sample);
        let results = sampler[0];
        let sample_values2 = results.sample_values;
        let json_ids = results.otu_ids;
        let json_labels = results.otu_labels;
        slice_values = sample_values2.slice(0,10);
        slice_ids = json_ids.slice(0,10);
        slice_labels = json_labels.slice(0,10);
        let yticks = slice_ids.map(otu_id =>`OTU ${otu_id}`);
        let chart = [{
            x: slice_values.reverse(),
            y: yticks,
            text: slice_labels,
            marker: {
                width: 10
            },
            type: 'bar',
            orientation: 'h'
        }];

        let layout = {
            title: "Top 10 OTU's"
        }
        Plotly.newPlot('bar', chart, layout);
    });
}
// Demographic Info for Metadata that displays all keys and values for each id
function metadata(sample) {
    d3.json(url).then(function(data) {
        let mdata = data.metadata;
        let sampler = mdata.filter(sample_res => sample_res.id == sample);
        let results = sampler[0];
        d3.select("#sample-metadata").html("");
        Object.entries(results).forEach(([key, value]) => {
            d3.select('#sample-metadata').append("p").text(`${key}: ${value}`)
        });
    });
}

function bubble_chart(sample) {
    d3.json(url).then(function(data) {
        let values = data.samples;
        let sampler = values.filter(sample_res => sample_res.id == sample);
        let results = sampler[0];
        let values_v2 = results.sample_values;
        let json_ids = results.otu_ids;
        let json_labels = results.otu_labels; 
        let chart = [{
            x: json_ids,
            y: values_v2,
            mode: 'markers',
            marker: {
                color: json_ids,
                size: values_v2
            },
            text: json_labels

        }];
        Plotly.newPlot("bubble", chart);
    });
}
function gauge_chart(sample) {
    d3.json(url).then(function(data) {
        let guage_values = data.metadata;
        let sampler = guage_values.filter(sample_res => sample_res.id == sample);
        let results = sampler[0];
        let values = results.wfreq;
        let chart = [{
            domain: {x:[0, 1], y:[0,1]},
            type: 'indicator',
            mode: 'gauge+number',
            value: values,
            title: {text: "Belly Button Washing Frequency <br> Scrubs per Week", font: {size: 24}},
            guage: {
                axis: {range: [null, 9]},
                bar: {color: 'black'},
                steps: [
                    {range: [0, 1], color: 'lightgray'},
                    {range: [1, 2], color: 'gray'},
                    {range: [2, 3], color: 'lightyellow'},
                    {range: [3, 4], color: 'yellow'},
                    {range: [4, 5], color: 'darkyellow'},
                    {range: [5, 6], color: 'lightgreen'},
                    {range: [6, 7], color: 'green'},
                    {range: [7, 8], color: 'green'},
                    {range: [8, 9], color: 'darkgreen'},
                ],
                threshold: {
                    line: {color: 'black'},
                    thickness: 0.5,
                    value: values
                }
            }
        }];
        Plotly.newPlot('gauge', chart);
    });
}
function init() {
    let selector = d3.select('#selDataset');
    d3.json(url).then(function(data) {
        let sample_names = data.names;
        console.log(sample_names)

        sample_names.forEach(function(sample) {
            selector.append("option")
            .text(sample)
            .property("value",sample)
        });
        let sample1=sample_names[0];
        bar_chart(sample1);
        bubble_chart(sample1);
        metadata(sample1);
        gauge_chart(sample1);
    });
}
// Changes the charts and metadata everytime a new id is clicked on
function optionChanged(item) {
    bar_chart(item),
    bubble_chart(item),
    metadata(item),
    gauge_chart(item)
}
init();
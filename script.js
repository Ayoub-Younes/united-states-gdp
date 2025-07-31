// Fetching data
const req = new XMLHttpRequest();
req.open("GET", 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
req.send();

req.onload = function() {
    const json = JSON.parse(req.responseText);
    const dataset = json.data;

    // Define the dimensions
    const container = document.querySelector(".container");
const w = 1000;
const h = 600;
    const padding = 60;
    const barW = Math.floor((w - 2 * padding) / dataset.length);

    // Create scales
    const xScale = d3.scaleUtc()
        .domain([d3.min(dataset, d => new Date(d[0])), d3.max(dataset, d => new Date(d[0]))])
        .range([padding, w - padding]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d[1])])
        .range([h - padding, padding]);

    // Create SVG container
const svg = d3.select(".container")
  .append("svg")
  .attr("viewBox", `0 0 ${w} ${h}`) // <- makes it scalable
  .attr("preserveAspectRatio", "xMidYMid meet") // <- keeps it centered
  .style("width", "100%")
  .style("height", "auto")
  .attr("id", "svg");

    // Create bars
    svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('x', d => xScale(new Date(d[0])))
        .attr('y', d => yScale(d[1]))
        .attr('width', barW)
        .attr('height', d => h - padding - yScale(d[1]))
        .attr('class', 'bar')
        .attr('data-date', d => d[0])
        .attr('data-gdp', d => d[1])
        .attr('id', d => d[0])
        .attr('fill', 'rgb(51, 173, 255)')
        .on("mouseover", function(event, d) {
            let x = this.getAttribute('data-date');
            d3.select("#tooltip")
                .style("opacity", 1)
                .attr('data-date', x)
                .html(`${formatQuarter(d[0])}<br>$${formatNumber(d[1])} Billion`)
                .style("left", `${event.pageX + 15}px`)
                .style("top", `${h - 2 * padding}px`);
        })
        .on("mouseover", function(event, d) {
            const x = this.getAttribute('data-date');
            const tooltip = d3.select("#tooltip");

            tooltip
            .style("opacity", 1)
            .attr("data-date", x)
            .html(`${formatQuarter(d[0])}<br>$${formatNumber(d[1])} Billion`);

            const tooltipWidth = tooltip.node().offsetWidth;
            let left = event.pageX + 15;
            let top = event.pageY - 40
            if (window.innerWidth < 700) {
                left = event.pageX - tooltipWidth/2;
                top = event.pageY - 70
            }

            if (left + tooltipWidth > window.innerWidth) {
                left = event.pageX - tooltipWidth - 15;
            }

            tooltip
            .style("left", `${left}px`)
            .style("top", `${top}px`); // slightly above cursor
        })
    // Create and append axes
    const xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.timeFormat('%Y'));
    svg.append("g")
        .attr('id', 'x-axis')
        .attr("transform", `translate(0,${h - padding})`)
        .call(xAxis);

    const yAxis = d3.axisLeft().scale(yScale);
    svg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${padding},0)`)
        .call(yAxis);

    // Add x-axis label
    svg.append("text")
        .attr("y", h - padding / 2)
        .attr("x", w - padding)
        .attr("dy", "1.5em")
        .style("text-anchor", "end")
        .style("font-size", "0.8em")
        .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf");

    // Add y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", padding)
        .attr("x", 0 - ((h - padding) / 2))
        .attr("dy", "1.5em")
        .style("fill", "#333")
        .style("text-anchor", "middle")
        .text("Gross Domestic Product");

// Show the main content after rendering
document.getElementById('body').style.display = 'flex'; // Display the content after SVG is rendered
};

// Fallback to ensure the content displays after 3 seconds
setTimeout(() => {
    document.getElementById('body').style.display = 'flex';
}, 3000);

const parseDate = d3.timeParse("%Y-%m-%d");
const formatQuarter = (date) => {
    const d = parseDate(date);
    const year = d.getFullYear();
    const month = d.getMonth();
    const quarter = Math.floor(month / 3) + 1;

    return `${year} Q${quarter}`;
};
const formatNumber = d3.format(",");

document.addEventListener('DOMContentLoaded', function () {
  const img = document.getElementById('background-img');

  function showContent() {
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
  }

  if (img.complete) {
    showContent();
  } else {
    img.onload = showContent;
  }

  setTimeout(showContent, 3000); 
});

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
  document.documentElement.style.height = '100%';

}

function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);
setViewportHeight();
# D3 Company Force Chart

This project uses [D3](https://d3js.org/)'s [forces simulation](https://github.com/d3/d3-force). Each element is a circle that represents a company. The area of each circle is proportional to the revenue of the company. Each circle is filled with a color correspoding to the industry to which it belongs to.

## Data

Company information is stored at `companies.json`. This file is loaded asynchronously by [d3-queue](https://github.com/d3/d3-queue), which initiates the visualization after the file has loaded.


## Forces

<dl>
  <dt>Show Combined</dt>
  <dd>Pushes the circles into a single group at the center.</dd>
  <dt>Show By Industry</dt>
  <dd>Groups the circles by Industry and pushes the groups towards the four corners, top, bottom and the center.</dd>
</dl>

## HOW TO RUN
Download the project and open the index.html file in browser to run the application

## MISC
Hover on the legend items to see the graph highlighting the correspoding industry. Tooltips ate styles to show when we mouseover on any company

function createForceChart(error, companies) {
    var companiesFlattened = classes(companies);

    var revenues = companiesFlattened.children.map(function (company) {
        return +company.value;
    });

    var revenueExtent = d3.extent(revenues);
    var listOfCompanies = $.map(companiesFlattened.children, function (company) {
        return company.companyName;
    });

    // Populate autocomplete search textbox
    $("#search").autocomplete({
        source: listOfCompanies
    });

    var width = 1000,
        height = 700;

    var colors_g = [
      "#7C368A",
      "#777777",
      "#3465AA",
      "#09A175",
      "#F2B701",
      "#03A9F4",
      "#F06292",
      "#DC0030",
      "#795548",
      "#F4511E",
      "#607D8B",
      "#7C4DFF",
      "#FDD835",
      "#CDDC39",
      "#E57373",
 ];

    var fader = function (color) {
        return d3.interpolateRgb(color, "#fff")(0.0);
    };

    var color = d3.scaleOrdinal(colors_g.map(fader));
    var tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip");

    var svg,
        circles,
        circleSize = {
            min: 3,
            max: 40
        };

    var circleRadiusScale = d3.scaleSqrt()
        .domain(revenueExtent)
        .range([circleSize.min, circleSize.max]);

    var forces,
        forceSimulation;

    createSVG();
    createCircles();
    createForces();
    createForceSimulation();
    addGroupingListeners();

    function createSVG() {
        svg = d3.select("#bubble-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
    }

    function createCircles() {
        circles = svg.selectAll("circle")
            .data(companiesFlattened.children)
            .enter()
            .append("circle")
            .attr("r", function (d) {
                return circleRadiusScale(d.value);
            })
            .style("fill", function (d) {
                return color(d.industry);
            })
            .on("mouseover", function (d) {
                addCompanyTootip(d, this);
            })
            .on("mouseout", function (d) {
                removeCompanyTooltip();
            });
    }

    function removeCompanyTooltip() {
        tooltip.style("display", "none");
    }

    function addCompanyTootip(company, refCircle) {
        tooltip.style("display", "block").style("opacity", 1);
        tooltip
            .html(
                '<table style="padding:10px;width:100%;"><tr><th style="font-weight: bold;" align="left">' +
                company.companyName +
                '</th><th style="font-weight: normal;color:' +
                color(company.industry) +
                ';" align="right">' +
                company.industry +
                '</th></tr><tr><td>Country:</td><td align="right">' +
                company.country +
                '</td></tr><tr><td>Revenue:</td><td align="right">$' +
                company.value.toFixed(0) +
                ' B</td></tr><tr><td>Profit:</td><td align="right">$' +
                company.profit.toFixed(0) +
                ' B</td></tr><tr><td>Profit Margin:</td><td align="right">' +
                (company.profit / company.value * 100).toFixed(1) +
                '%</td></tr><tr><td>Assets:</td><td align="right">$' +
                company.assets.toFixed(0) +
                ' B</td></tr><tr><td>Market Value:</td><td align="right">$' +
                company.marketValue.toFixed(0) +
                ' B</td></tr></table>'
            )
            .style("left", d3.event.pageX + -110 + "px")
            .style("top", d3.event.pageY + -255 + "px");

        var thisCircle = d3.select(refCircle);
        var trans = thisCircle.attr("transform");
        thisCircle
            .select("text")
            .transition()
            .ease(d3.easeLinear)
            .duration(2500);
    }

    function createForces() {
        var forceStrength = 0.05;
        forces = {
            combine: createCombineForces(),
            industry: createIndustryForces()
        };

        function createCombineForces() {
            return {
                x: d3.forceX(width / 2).strength(forceStrength),
                y: d3.forceY(height / 2).strength(forceStrength)
            };
        }


        function createIndustryForces() {
            return {
                x: d3.forceX(industryForceX).strength(forceStrength),
                y: d3.forceY(industryForceY).strength(forceStrength)
            };

            function industryForceX(d) {
                switch (d.industry) {
                    case "Retail":
                    case "Oil & Gas":
                    case "Automotive":
                        return width / 12;

                    case "Finance & Insurance":
                    case "Technology":
                    case "Pharmaceuticals":
                        return width / 4;

                    case "Healthcare":
                    case "Telecommunications":
                    case "Mining":
                        return width / 2;

                    case "Construction":
                    case "Conglomerates":
                    case "Consumer Goods":
                        return width / 1.5;

                    case "Beverages":
                    case "Entertainment":
                    case "Tobacco":
                        return width / 1.4;

                    default:
                        return width / 1.4;
                }
            }

            function industryForceY(d) {
                 switch (d.industry) {
                    case "Retail":
                    case "Finance & Insurance":
                    case "Healthcare":
                    case "Construction":
                    case "Beverages":
                        return height / 12;

                    case "Oil & Gas":
                    case "Technology":
                    case "Telecommunications":
                    case "Conglomerates":
                    case "Entertainment":
                        return height / 3;

                    case "Automotive":
                    case "Pharmaceuticals":
                    case "Mining":
                    case "Consumer Goods":
                    case "Tobacco":
                        return height / 1.8;

                    default:
                        return height / 1.8;
                }
            }
        }
    }

    function createForceSimulation() {
        forceSimulation = d3.forceSimulation()
            .force("x", forces.combine.x)
            .force("y", forces.combine.y)
            .force("collide", d3.forceCollide(forceCollide));
        forceSimulation.nodes(companiesFlattened.children)
            .on("tick", function () {
                circles
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    });
            });
    }

    function forceCollide(d) {
        return circleRadiusScale(d.value) + 1;
    }
    var ordinal = color;

    //Legend
    svg
        .append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate(760,140)");
    var legendOrdinal = d3.legendColor().scale(ordinal);
    svg
        .select(".legendOrdinal")
        .call(legendOrdinal).attr("font-weight", "300")
        .append("text")
        .text("Industry")
        .attr("transform", "translate(0,-10)")
        .attr("font-weight", "bold");

    svg
        .selectAll(".cell").on("mouseover", function (d) {
            highlight(d);
        }).on("mouseout", function (d) {
            unhighlight();
        });


    function addGroupingListeners() {
        addListener("#combine", forces.combine);
        addListener("#industry", forces.industry);

        function addListener(selector, forces) {
            d3.select(selector).on("click", function () {
                updateForces(forces);
            });
        }

        function updateForces(forces) {
            forceSimulation
                .force("x", forces.x)
                .force("y", forces.y)
                .force("collide", d3.forceCollide(forceCollide))
                .alphaTarget(0.5)
                .restart();
        }
    }

    function isChecked(elementID) {
        return d3.select(elementID).property("checked");
    }

    function unhighlight() {
        d3.selectAll("circle").classed("dimmed", false);
    }

    //highlight selected catagory
    function highlight(ids) {
        unhighlight();
        d3.selectAll("circle").filter(function (d, i) {
                if (d) {
                    return ids !== d.industry;
                }
            })
            .classed("dimmed", true);
    }

    function classes(root) {
        var classes = [];

        function recurse(name, node) {
            if (node.children)
                node.children.forEach(function (child) {
                    recurse(node.name, child);
                });
            else
                classes.push({
                    industry: name,
                    companyName: node.name,
                    value: node.size,
                    profit: node.profit,
                    country: node.country,
                    assets: node.assets,
                    marketValue: node.marketValue,
                });
        }
        recurse(null, root);
        return {
            children: classes
        };
    }


    $("#btnSearch").click(function () {
        unhighlight()
        var itemName = $("#search").val();

        if (itemName !== "") {
            d3.selectAll("circle").filter(function (d, i) {
                    if (d) {
                        return itemName !== d.companyName;
                    }
                })
                .classed("dimmed", true);

            var targetNode = d3.selectAll("circle").filter(function (d, i) {
                return itemName === d.companyName;
            });

            var searchedItem = companiesFlattened.children.filter(function (company) {
                return company.companyName === itemName;
            });

            if (searchedItem.length > 0) {
                addCompanyTootip(searchedItem[0], targetNode);
            }
        }
        // d3.selectAll(targetNode).dispatch('mousemove');
    });

    $("#btnClear").click(function () {
        d3.selectAll("circle").classed("dimmed", false);
        removeCompanyTooltip();
        $("#search").val('');
    });
}

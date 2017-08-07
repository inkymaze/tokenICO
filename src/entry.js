import * as d3 from 'd3';
import d3Tip from 'd3-tip';
d3.tip = d3Tip;

(function() {
  let width = 1500,
    height = 900;

    let svg = d3.select("#chartCont")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      // centers the bubble in the chartCont
      .attr("transform", "translate(0, 0)");

      // empty forceX and forceY default to 0
    let forceXsplit = d3.forceX(function(d) {
      if(d.year === "2017") {
        return 1200;
      } else if (d.year === "2016") {
        return 750;
      } else if (d.year === "2015") {
        return 400;
      } else {
        return 150;
      }
    }).strength(0.03);

    let forceXErcSplit = d3.forceX(function(d) {
      if(d.erc20 === "TRUE") {
      return 900;
      } else {
      return 300;
      }
    }).strength(0.03);

    let div = d3.select("body").append("div")
      .attr("class", "tooltip")


        .style("opacity", 0);




    let yearsTitleX = {
    2014: 150,
    2015: 400,
    2016: 750,
    2017: 1200

    };

    let ercValuesX = {
      'ERC-20': 900,
      'Others': 350
    };

    function showYears() {
      let yearsData = d3.keys(yearsTitleX);
      let years = svg.selectAll('.year')
      .data(yearsData);

      years.enter().append('text')
      .attr('class', 'year')
      .attr('x', function (d) { return yearsTitleX[d]; })
      .attr('y', 200)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
    }

    function showErc() {
      let ercData = d3.keys(ercValuesX);
      let ercValues= svg.selectAll('.erc20')
        .data(ercData);

      ercValues.enter().append('text')
      .attr('class', 'erc20')
      .attr('x', function (d) { return ercValuesX[d]; })
      .attr('y', 200)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
    }

    let simulation = d3.forceSimulation()

      .force("xAxis", d3.forceX(width / 2).strength(0.03))
      .force("yAxis", d3.forceY(height / 2).strength(0.03))
      .force("preventCollide", d3.forceCollide(function(d) {
        return bubbleScale(d.usd_raised) + 1;
      }));

    // upload the csv file
   // await callback pauses the async function and only fires after csv files loads
    d3.queue().defer(d3.csv, 'tokenInfo2.csv').await(loaded);

    // defines svg content for resuable component
    // appending a pattern tag which uploads the token logo
    let defs = svg.append("defs");

    // callback passed to await which formats the bubble
    // first arg must be the first error that may occur

    // scale the bubble proportionally give dollar range to px
    let bubbleScale = d3.scaleSqrt().domain([115500,230498884]).range([4,87]);

    function loaded(error, data) {

      defs.selectAll(".token-logo")
        .data(data)
        .enter().append("pattern")
        .attr("class", ".token-logo")
        .attr("id",
          function(d) {
          // must using global regex to replace more then one space
          return d.name.replace(/ /g, "-");
        })
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
        .append("image")
        .attr("height", 1)
        .attr("width", 1)
        .attr("preserveAspectRatio", "none")
        .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
        .attr("xlink:href", function(d) {
          return d.logo_path;
        });

      let circle = svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("class", "token")
        // give the radius of bubble appropriate scale
        .attr("r", function(d) {
          return bubbleScale(d.usd_raised);
        })
        .attr("fill",
        function(d) {
              if(d.roi === "BLUE") {
              return "#14303D";
            } else if (d.roi === "RED") {
              return "#d84b2a";
            } else {
              return "#7aa25c";
            }
          })

        // loads bubbles with logos but freezes browser
        // function(d) {
        //   return "url(#" + d.name.replace(/ /g, "-") + ")";
        // })

        // loads details of each bubble which will zoom later on click
        .on("mouseover", function(d) {

           div.transition()
               .duration(200)
               .style("opacity", .95);


               div.html(

                 d.name + "<br/>" +
                "USD Raised: $" + d.usd_raised + "<br/>" +
                "Date: " + d.month + "<br/>" +
                "Token Sale Price: " + d.token_sale_price + "<br/>" +
                "ERC-20 Protocol: " + d.erc20 + "<br/>" +
                "--click for Whitepaper--");
                div.append("img")
                                 .attr("src", d.logo_path)
                                 .attr("x", -8)
                                 .attr("y", -8)
                                 .attr("width","30px")
                                 .attr("height","30px")


                .style("fill", d.logo_path)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
           })
           .on("mousemove", function(){return div.style("top", (event.pageY-
                                     10)+"px").style("left",(event.pageX+10)+"px");})

       .on("mouseout", function(d) {
           div.transition()
               .duration(500)
               .style("opacity", 0);
        })
        .on("click", function(d) {window.open(d.link); });

    d3.select("#year").on('click', function() {
      svg.selectAll('.erc20').remove();
      showYears();
      simulation.force("xAxis", forceXsplit)
      .force("yAxis", d3.forceY(height / 2).strength(0.02))
      .force("preventCollide", d3.forceCollide(function(d) {
        return bubbleScale(d.usd_raised) + 3;

      }))

        .alphaTarget(0.5)
        .restart();
    });




    d3.select("#erc20").on('click', function() {
       svg.selectAll('.year').remove();
       showErc();
      simulation.force("xAxis", forceXErcSplit)
      .force("yAxis", d3.forceY(height / 2).strength(0.02))
      .force("preventCollide", d3.forceCollide(function(d) {
        return bubbleScale(d.usd_raised) + 3;

      }))
        .alphaTarget(0.5)
        .restart();
    });

    // nodes equal circle/circles in this case
    simulation.nodes(data)
      .on('tick', ticked);

    function ticked() {
      circle
        .attr("cx", function(d) {
          return d.x;
        })
      .attr("cy", function(d) {
        return d.y;
      });
    }
  }
})();

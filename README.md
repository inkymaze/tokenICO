# Initial Coin Offering Bubble Chart

![homescreen](http://res.cloudinary.com/dbyoymbpd/image/upload/v1501804299/Screen_Shot_2017-08-03_at_4.50.07_PM_jekbwg.png)

### Background

An initial coin offering or ICO has rapidly become a way to raise money for a particular project using cryptocurrency via a blockchain. The crowdfunding manner of ICOs has recently overtaken the capital raised from tradition venture capital backing in the space.

Persons participating in an ICO are rewarded with tokens which work similar to paid API keys for that particular platform. Platforms or 'fat protocols' have a wide range of technology that they are trying to implement from prediction markets to decentralized file storage.

Withstanding criticism, this new form of raising capital is picking up steam. By increasing the buyer base and time to liquidity these tokens are allowing for more projects to hit the ground running that have not been possible in the past.

## Implementations

### Scaled bubbles to USD raised at offering

Each bubble is scaled to give a realistic understanding of the growth of the industry over time implementing JavaScript's D3 library.

```javascript
let bubbleScale = d3.scaleSqrt().domain([115500,230498884]).range([3,85]);

function loaded(error, data) {

  defs.selectAll(".token-logo")
    .data(data)
    .enter().append("pattern")
    .attr("class", ".token-logo")
    .attr("id",
      function(d) {
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
}
```
### Transitions and animation

Using D3 force simulation the transitions on page load and between filters contribute to most of the interactivity of the app.

```javascript
let simulation = d3.forceSimulation()

  .force("xAxis", d3.forceX(width / 2).strength(0.05))
  .force("yAxis", d3.forceY(height / 2).strength(0.05))
  .force("preventCollide", d3.forceCollide(function(d) {
    return bubbleScale(d.usd_raised) + 1;

  }));


```
### Mouseover

When a bubble is hovered over a popup is opened to show more detailed information regarding that particular token.

```javascript
.on("mouseover", function(d) {
   div.transition()
       .duration(200)
       .style("opacity", .95);
       div.html(
         d.name + "<br/>" +
        "USD Raised: $" + d.usd_raised + "<br/>" +
        "Date: " + d.month + "<br/>" +
        "Token Sale Price: " + d.token_sale_price + "<br/>" +
        "Current Token Price: $" + d.current_token_price + "<br/>" +
        "Token ROI: " + d.token_return + "x" + "<br/>" +
        "ERC-20 Protocol: " + d.erc20 )


        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
   })
.on("mouseout", function(d) {
   div.transition()
       .duration(500)
       .style("opacity", 0);
});
```

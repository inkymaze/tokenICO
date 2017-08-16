# tokenICO Bubble Chart

[tokenICO](https://inkymaze.github.io/tokenICO/)

### Background

An initial coin offering or ICO has rapidly become a way to raise money for a particular project using cryptocurrency via a blockchain. The crowdfunding manner of ICOs has recently overtaken the capital raised from traditional venture capital backing in the space.

Persons participating in an ICO are rewarded with tokens which work similar to paid API keys for that particular platform. Platforms or 'fat protocols' have a wide range of technology that they are trying to implement from prediction markets to decentralized file storage.

Withstanding criticism, this new form of raising capital is picking up steam. By increasing the buyer base and time to liquidity these tokens are allowing for more projects to hit the ground running that have not been possible in the past.

## Implementations

### Current token data updated via API

A JSON API call is made to update the static token data with current market information and then merge corresponding data.

```javascript
  d3.queue()
   .defer(d3.json, 'staticTokenData.json')
   .defer(d3.json, 'https://api.coinmarketcap.com/v1/ticker/?')
   .awaitAll(loaded);


 function loaded(error, data) {
   data = data[0].map(x => Object.assign(x, data[1].find(y => y.name == x.name)));
 ....}
```
### Transitions and animation

![ROIfilter](https://res.cloudinary.com/dbyoymbpd/image/upload/v1502908785/Screen_Shot_2017-08-16_at_11.39.01_AM_zjgqb4.png)

Using D3 force simulation the transitions on page load and between filters contribute to most of the interactivity of the app. For the ROI filter a logarithmic scale is used to give the y-axis values representative of the USD returns per token due to the large range.

```javascript
  function showAxis() {
    let y_domain = [0.01, d3.max(data, function(d) {
      if(d.token_sale_price !== "N/A") {
      return d.price_usd / d.token_sale_price;
      } else {
      return 1;
      }
    })];

    let yScale = d3.scaleLog()
    .domain(y_domain).base(2).nice()  
    .range([height - 75, 50]);  

    svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(60,0)")
    .call(d3.axisLeft(yScale));
  }

```
### Mouseover, mousemove, and mouseout

When a bubble is hovered over a popup is opened to show more detailed information regarding that particular token made using a custom tooltip. An external link to the Whitepaper or token website is also provided.

```javascript
.on("mouseover", function(d) {
    let usdPrice;
    let marketCap
    if (d.price_usd){
      usdPrice = d.price_usd;
      marketCap = d.market_cap_usd
    } else {
      usdPrice = "N/A";
      marketCap = "N/A";
    }
    div.transition()
        .duration(200)
        .style("opacity", .95);
        div.html(
         "<br/>" + d.name + "<br/>" +
         "USD Raised: $" + d.usd_raised + "<br/>" +
         "Date: " + d.month + "<br/>" +
         "Token Sale Price: $" + d.token_sale_price + "<br/>" +
         "Current Price: $" + usdPrice + "<br/>" +
         "ERC-20 Protocol: " + d.erc20 + "<br/>" +
         "Market Cap: $" + marketCap+ "<br/>" +
         "--click for Whitepaper--" + "<br/>");
         div.append("img")
                          .attr("src", d.logo_path)
                          .attr("width","50px")
                          .attr("height","50px")
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
});
```

// Load the JSON data
d3.json('dendrogram.json').then(data => {
    console.log('Data loaded'); // Log when the data is loaded

    const margin = { top: 20, right: 120, bottom: 20, left: 120 };

    // Create the tree layout
    const tree = d3.tree().nodeSize([40, 100]); // Adjust node size for better spacing
    const root = d3.hierarchy(data, d => d.children);
    tree(root);

    console.log('Tree created'); // Log when the tree is created

    // Calculate the extent of the tree layout
    let minX = 0, maxX = 0;
    root.each(d => {
        if (d.x > maxX) maxX = d.x;
        if (d.x < minX) minX = d.x;
    });

    console.log(`minX: ${minX}, maxX: ${maxX}`); // Log the min and max x values

    const height = maxX - minX + margin.top + margin.bottom;
    const width = root.height * 180 + margin.left + margin.right; // Estimate width based on tree height

    console.log(`height: ${height}, width: ${width}`); // Log the height and width

    // Create the SVG container
    const svgContainer = d3.select("#dendrogram")
        .append("svg")
        .attr("width", window.innerWidth) // Set the width to the window width
        .attr("height", window.innerHeight) // Set the height to the window height
     

    const svg = svgContainer.append("g")
        .attr("transform", "translate(" + margin.left + "," + (-minX + margin.top) + ")");

    const zoom = d3.zoom().on("zoom", function (event) {
        svg.attr("transform", event.transform);
    });

    svgContainer.call(zoom);

    console.log('SVG group created'); // Log when the SVG group is created

    // Create the links (edges)
    const link = svg.selectAll(".link")
        .data(root.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));

    // Create the nodes
    const node = svg.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", d => "node" + (d.children ? " node--internal" : " node--leaf"))
        .attr("transform", d => "translate(" + d.y + "," + d.x + ")");

    // Add circles to the nodes
    node.append("circle")
        .attr("r", 10);

    // Add labels to the nodes corresponding to the node names but only for nodes that have a gene name
    node.filter(d => d.data.name)
        .append("text")
        .attr("dy", 3)
        .attr("x", d => d.children ? -10 : 10)
        .style("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name);
        // add some spacing between the text and the circle
      

    

  
});
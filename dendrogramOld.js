// Load the JSON data
d3.json('dendrogram.json').then(data => {
    const margin = { top: 20, right: 120, bottom: 20, left: 120 };

    // Create the tree layout
    const tree = d3.tree().nodeSize([40, 100]); // Adjust node size for better spacing
    const root = d3.hierarchy(data, d => d.children);
    tree(root);

    // Calculate the extent of the tree layout
    let minX = 0, maxX = 0;
    root.each(d => {
        if (d.x > maxX) maxX = d.x;
        if (d.x < minX) minX = d.x;
    });

    const height = maxX - minX + margin.top + margin.bottom;
    const width = root.height * 180 + margin.left + margin.right; // Estimate width based on tree height

    // Create the SVG container
    const svg = d3.select("#dendrogram")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + (-minX + margin.top) + ")");

    // Drawing links
    svg.selectAll(".link")
        .data(root.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));

    // Drawing nodes
    svg.selectAll(".node")
        .data(root.descendants())
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .attr("cx", d => d.y)
        .attr("cy", d => d.x);

    // Adding labels
    svg.selectAll(".label")
        .data(root.descendants())
        .enter().append("text")
        .attr("class", "label")
        .attr("x", d => d.y + 10)
        .attr("y", d => d.x)
        .text(d => d.data.name[0] !== "Node" ? d.data.name[0] : "")
        .attr("font-size", "10px");
});

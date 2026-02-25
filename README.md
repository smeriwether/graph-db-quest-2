# Graph DB Quest

An interactive web-based learning game that teaches graph databases (Neo4j-style) through missions, quizzes, and hands-on query simulation.

**[Play Now →](https://smeriwether.github.io/graph-db-quest-2/)**

## What You'll Learn

- **What graph databases are** — nodes, edges, properties, labels, traversals
- **When to use them** — sweet spots (fraud detection, social networks, recommendations) vs. anti-patterns (flat CRUD, OLAP)
- **Cypher query language** — pattern matching, variable-length paths, shortest paths
- **Data models & languages** — property graph vs. RDF, Cypher vs. Gremlin vs. SPARQL vs. GQL
- **Managed services** — AWS Neptune, Azure Cosmos DB (Gremlin API), Neo4j Aura, TigerGraph Cloud, and more
- **Real-world application** — polyglot persistence, fraud detection modeling

## Features

- **6 interactive missions** with quizzes and immediate feedback
- **Query Lab** — build graph queries visually across 3 scenarios (social network, movie database, fraud detection)
- **Cheat Sheet** — comprehensive reference covering concepts, Cypher syntax, managed services comparison, and graph algorithms
- **Live graph visualizations** using vis-network
- **Progress tracking** with localStorage persistence

## Tech Stack

- Static HTML/CSS/JS — no build step, no backend
- [vis-network](https://visjs.github.io/vis-network/docs/network/) via CDN for graph visualizations
- Google Fonts: Oxanium, Space Mono, IBM Plex Sans

## Run Locally

```bash
# Just open index.html in a browser, or:
npx serve .
```

## License

MIT

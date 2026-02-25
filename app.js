/* ============================================
   GRAPH DB QUEST — Game Engine
   All HTML content rendered via innerHTML uses only
   hardcoded developer-controlled strings (no user input).
   ============================================ */

// ---- State ----
const state = {
    completedMissions: JSON.parse(localStorage.getItem('gdbq_completed') || '[]'),
    score: parseInt(localStorage.getItem('gdbq_score') || '0', 10),
    streak: parseInt(localStorage.getItem('gdbq_streak') || '0', 10),
    currentMission: null,
    currentStep: 0,
    missionScore: 0,
};

function save() {
    localStorage.setItem('gdbq_completed', JSON.stringify(state.completedMissions));
    localStorage.setItem('gdbq_score', state.score);
    localStorage.setItem('gdbq_streak', state.streak);
}

// ---- Missions Data ----
const MISSIONS = [
    {
        id: 'intro',
        num: 1,
        title: 'What Is a Graph Database?',
        desc: 'Discover the fundamentals: nodes, edges, properties, and why relationships are first-class citizens.',
        tags: ['Fundamentals'],
        accent: '#00e5ff',
        steps: [
            {
                type: 'info',
                heading: 'Welcome, Explorer',
                text: `A <strong>graph database</strong> stores data as a network of <strong>nodes</strong> (entities) and <strong>edges</strong> (relationships). Unlike tables with rows and columns, graphs make <em>connections</em> the core data structure.\n\nThink of it like a social network map: each person is a node, each friendship is an edge. Both can carry data — a person has a name, a friendship has a start date.`,
                graph: {
                    nodes: [
                        { id: 1, label: 'Alice', color: '#00e5ff' },
                        { id: 2, label: 'Bob', color: '#00e5ff' },
                        { id: 3, label: 'Carol', color: '#00e5ff' },
                    ],
                    edges: [
                        { from: 1, to: 2, label: 'KNOWS', color: { color: '#39ff14' } },
                        { from: 2, to: 3, label: 'KNOWS', color: { color: '#39ff14' } },
                        { from: 1, to: 3, label: 'WORKS_WITH', color: { color: '#ff00e5' } },
                    ]
                }
            },
            {
                type: 'quiz',
                heading: 'Quick Check',
                text: 'In a graph database, what is a "node"?',
                choices: [
                    { text: 'A table row with foreign keys', correct: false },
                    { text: 'An entity (like a person or product) stored in the graph', correct: true },
                    { text: 'A query keyword in Cypher', correct: false },
                    { text: 'A server in the database cluster', correct: false },
                ],
                feedback: {
                    correct: 'Exactly! A node represents an entity — a person, product, place, event — anything you want to store and connect.',
                    wrong: 'Not quite. A node is an entity in the graph — like a person or product. It can have properties (key-value pairs) and labels (types).'
                }
            },
            {
                type: 'info',
                heading: 'Properties & Labels',
                text: `Every node can have <strong>labels</strong> (like types) and <strong>properties</strong> (key-value data). For example:\n\n<code>(:Person {name: "Alice", age: 30})</code>\n\nEdges (relationships) are always <strong>directed</strong> and <strong>typed</strong>. They can also have properties:\n\n<code>-[:KNOWS {since: 2019}]-></code>\n\nThis is called the <strong>property graph model</strong> — the most common graph data model used by Neo4j, Amazon Neptune, TigerGraph, and others.`,
                graph: {
                    nodes: [
                        { id: 1, label: 'Alice\n:Person', color: '#00e5ff', title: 'name: Alice\nage: 30' },
                        { id: 2, label: 'Bob\n:Person', color: '#00e5ff', title: 'name: Bob\nage: 28' },
                        { id: 3, label: 'Neo4j Inc\n:Company', color: '#ffab00', title: 'name: Neo4j Inc\nfounded: 2007' },
                    ],
                    edges: [
                        { from: 1, to: 2, label: 'KNOWS\nsince: 2019', color: { color: '#39ff14' } },
                        { from: 1, to: 3, label: 'WORKS_AT', color: { color: '#ff00e5' } },
                        { from: 2, to: 3, label: 'WORKS_AT', color: { color: '#ff00e5' } },
                    ]
                }
            },
            {
                type: 'quiz',
                heading: 'Knowledge Check',
                text: 'Which statement about graph database relationships (edges) is TRUE?',
                choices: [
                    { text: 'Relationships are always undirected', correct: false },
                    { text: 'Relationships cannot have properties', correct: false },
                    { text: 'Relationships are directed, typed, and can have properties', correct: true },
                    { text: 'Each node can only have one relationship', correct: false },
                ],
                feedback: {
                    correct: 'Right! Relationships are always directed (from → to), always have a type (like KNOWS or PURCHASED), and can carry properties (like "since: 2020").',
                    wrong: 'Relationships in a property graph are always directed, always typed, and CAN have properties. This is a key feature of the property graph model.'
                }
            },
            {
                type: 'info',
                heading: 'The Key Insight',
                text: `The fundamental difference: in a relational DB, relationships are computed at query time via JOINs. In a graph DB, relationships are <strong>stored directly</strong> — making traversals lightning fast regardless of data size.\n\nA 5-hop JOIN in SQL might scan millions of rows. The same traversal in a graph DB follows direct pointers — <strong>constant time per hop</strong>.\n\nThis is called <strong>index-free adjacency</strong> and it's the superpower of graph databases.`,
            }
        ]
    },
    {
        id: 'use-cases',
        num: 2,
        title: 'When to Use (and Not Use) a Graph DB',
        desc: 'Learn the sweet spots and anti-patterns. Know when graphs shine and when to reach for something else.',
        tags: ['Architecture', 'Decision Making'],
        accent: '#39ff14',
        steps: [
            {
                type: 'info',
                heading: 'The Sweet Spots',
                text: `Graph databases excel when your queries are about <strong>how things are connected</strong>. Key use cases:\n\n• <strong>Social networks</strong> — friends-of-friends, influence, communities\n• <strong>Recommendation engines</strong> — "people who bought X also bought Y"\n• <strong>Fraud detection</strong> — find suspicious patterns across transactions\n• <strong>Knowledge graphs</strong> — semantic search, AI context\n• <strong>Network topology</strong> — IT infrastructure, dependencies\n• <strong>Supply chain</strong> — trace origins, find bottlenecks\n• <strong>Identity & access management</strong> — who can access what through which roles`,
            },
            {
                type: 'quiz',
                heading: 'Scenario Time',
                text: 'A bank needs to detect money laundering by finding circular transaction chains across multiple accounts. Best database choice?',
                choices: [
                    { text: 'Relational database (PostgreSQL)', correct: false },
                    { text: 'Graph database (Neo4j / Neptune)', correct: true },
                    { text: 'Document database (MongoDB)', correct: false },
                    { text: 'Key-value store (Redis)', correct: false },
                ],
                feedback: {
                    correct: 'Perfect! Finding circular transaction chains is a classic graph traversal problem. Graph DBs can detect cycles and complex patterns across accounts in real time — something that would require many recursive JOINs in SQL.',
                    wrong: 'A graph database is ideal here. Detecting circular money flows (A→B→C→A) is a cycle-detection problem — the bread and butter of graph traversals. SQL would need recursive CTEs or multiple self-joins, which get very slow at scale.'
                }
            },
            {
                type: 'info',
                heading: 'When NOT to Use a Graph DB',
                text: `Graph databases are <strong>not the right tool for everything</strong>. Avoid them when:\n\n• <strong>Simple CRUD</strong> — flat records with no meaningful relationships (use SQL or document DB)\n• <strong>Heavy analytics / OLAP</strong> — massive aggregations, pivots, window functions (use a data warehouse)\n• <strong>Time-series data</strong> — sensor readings, metrics (use TimescaleDB, InfluxDB)\n• <strong>Full-text search</strong> — searching document content (use Elasticsearch, Meilisearch)\n• <strong>Blob storage</strong> — images, videos, files (use object storage)\n• <strong>High-volume writes with no relationships</strong> — append-heavy logs (use Kafka + columnar store)`,
            },
            {
                type: 'quiz',
                heading: 'Anti-Pattern Check',
                text: 'Your team is building a blog platform. Posts have a title, body, tags, and an author ID. Most queries are "get post by ID" or "list recent posts." What DB should you use?',
                choices: [
                    { text: 'Graph database — relationships everywhere!', correct: false },
                    { text: 'A relational or document database — this is basic CRUD', correct: true },
                    { text: 'Time-series database', correct: false },
                ],
                feedback: {
                    correct: 'Exactly! A simple blog is classic CRUD territory. There are relationships, but they\'re simple (author → post). A relational or document DB handles this perfectly without the overhead of a graph engine.',
                    wrong: 'A blog platform is basic CRUD. While there ARE relationships (author → posts), they\'re simple and don\'t require deep traversals. PostgreSQL or MongoDB would be the right choice.'
                }
            },
            {
                type: 'quiz',
                heading: 'Decision Framework',
                text: 'Which question BEST indicates you should consider a graph database?',
                choices: [
                    { text: '"How fast can we write 100K events per second?"', correct: false },
                    { text: '"What is the average order value per region?"', correct: false },
                    { text: '"How are these entities connected, and what patterns exist in their connections?"', correct: true },
                    { text: '"What is the latest sensor reading from device #4829?"', correct: false },
                ],
                feedback: {
                    correct: 'Exactly! The telltale sign is when your core questions are about connections, paths, patterns, and influence between entities. If you\'re asking "how is X related to Y?" — that\'s graph territory.',
                    wrong: 'The key signal is connection-oriented questions: "How is X related to Y?", "What patterns exist between these entities?", "Who influences whom?" When your queries are fundamentally about relationships, reach for a graph DB.'
                }
            },
        ]
    },
    {
        id: 'cypher',
        num: 3,
        title: 'Speaking Cypher',
        desc: 'Learn the basics of Cypher — the most popular graph query language with its ASCII-art syntax.',
        tags: ['Cypher', 'Querying'],
        accent: '#ff00e5',
        steps: [
            {
                type: 'info',
                heading: 'Cypher: The ASCII Art of Queries',
                text: `<strong>Cypher</strong> is Neo4j's query language, now an open standard. Its killer feature: the syntax looks like the patterns you're matching.\n\nNodes use parentheses: <code>(person:Person)</code>\nRelationships use arrows: <code>-[:KNOWS]-></code>\nCombined: <code>(alice)-[:KNOWS]->(bob)</code>\n\nA basic query:\n<code>MATCH (p:Person {name: "Alice"})\nRETURN p</code>\n\nThis finds all Person nodes named "Alice" and returns them.`,
                graph: {
                    nodes: [
                        { id: 1, label: 'Alice', color: '#ff00e5' },
                        { id: 2, label: 'Bob', color: '#00e5ff' },
                        { id: 3, label: 'Carol', color: '#00e5ff' },
                        { id: 4, label: 'TechCo', color: '#ffab00' },
                    ],
                    edges: [
                        { from: 1, to: 2, label: 'KNOWS', color: { color: '#39ff14' } },
                        { from: 1, to: 3, label: 'KNOWS', color: { color: '#39ff14' } },
                        { from: 2, to: 4, label: 'WORKS_AT', color: { color: '#ff00e5' } },
                        { from: 3, to: 4, label: 'WORKS_AT', color: { color: '#ff00e5' } },
                    ]
                }
            },
            {
                type: 'quiz',
                heading: 'Read the Pattern',
                text: 'What does this Cypher query find?\n\n<code>MATCH (a:Person)-[:KNOWS]->(b:Person)-[:WORKS_AT]->(c:Company)\nWHERE a.name = "Alice"\nRETURN b.name, c.name</code>',
                choices: [
                    { text: 'All companies where Alice works', correct: false },
                    { text: 'The names of people Alice knows and the companies they work at', correct: true },
                    { text: 'All people who know Alice', correct: false },
                    { text: 'Companies that know Alice', correct: false },
                ],
                feedback: {
                    correct: 'You can read Cypher! The pattern starts at Alice, follows a KNOWS edge to other people (b), then follows WORKS_AT to companies (c). It returns b\'s and c\'s names.',
                    wrong: 'Read the arrows: Alice -[:KNOWS]-> b -[:WORKS_AT]-> c. It starts at Alice, follows KNOWS edges to find people she knows (b), then follows WORKS_AT to find their companies (c).'
                }
            },
            {
                type: 'info',
                heading: 'Variable-Length Paths',
                text: `One of Cypher's most powerful features is <strong>variable-length path matching</strong>:\n\n<code>MATCH (a)-[:KNOWS*1..3]->(b)</code>\n\nThis finds everyone reachable through 1 to 3 KNOWS hops. Perfect for "friends of friends of friends" queries.\n\nYou can also find the <strong>shortest path</strong>:\n\n<code>MATCH path = shortestPath(\n  (a:Person {name:"Alice"})\n  -[:KNOWS*]->\n  (b:Person {name:"Eve"})\n)\nRETURN path</code>`,
            },
            {
                type: 'quiz',
                heading: 'Pattern Matching',
                text: 'What does <code>MATCH (p)-[:KNOWS*2]->(friend)</code> find?',
                choices: [
                    { text: 'Direct friends only', correct: false },
                    { text: 'Friends of friends (exactly 2 hops)', correct: true },
                    { text: 'All friends within 2 hops', correct: false },
                    { text: 'People with exactly 2 friends', correct: false },
                ],
                feedback: {
                    correct: 'Spot on! *2 means exactly 2 hops — friends of friends. To include 1 AND 2 hops, you\'d write *1..2.',
                    wrong: 'The *2 means exactly 2 hops. So this finds friends-of-friends, not direct friends. For "1 or 2 hops" you\'d write *1..2.'
                }
            },
            {
                type: 'quiz',
                heading: 'Write the Query',
                text: 'You want to find all movies that actors who acted in "The Matrix" also acted in. Which Cypher pattern is correct?',
                choices: [
                    { text: '<code>MATCH (m:Movie {title:"The Matrix"})<-[:ACTED_IN]-(a)-[:ACTED_IN]->(other:Movie) RETURN other</code>', correct: true },
                    { text: '<code>MATCH (m:Movie)-[:ACTED_IN]->(a)-[:ACTED_IN]->(other) RETURN other</code>', correct: false },
                    { text: '<code>SELECT other FROM movies JOIN actors WHERE title = "The Matrix"</code>', correct: false },
                ],
                feedback: {
                    correct: 'Perfect Cypher! Start at The Matrix, follow ACTED_IN backwards to find actors, then forward to their other movies. Notice the arrow direction matters.',
                    wrong: 'The correct pattern: (The Matrix) <-[:ACTED_IN]- (actor) -[:ACTED_IN]-> (other movie). Arrow direction matters in Cypher: actors ACTED_IN movies, so the arrow points from actor to movie.'
                }
            },
        ]
    },
    {
        id: 'models',
        num: 4,
        title: 'Data Models & Query Languages',
        desc: 'Property graphs vs. RDF. Cypher vs. Gremlin vs. SPARQL. Understand the landscape.',
        tags: ['Architecture', 'Languages'],
        accent: '#ffab00',
        steps: [
            {
                type: 'info',
                heading: 'Two Graph Data Models',
                text: `The graph world has two main data models:\n\n<strong>1. Property Graph (LPG)</strong>\nNodes and edges with labels and key-value properties. Intuitive and expressive. Used by Neo4j, Neptune (via Gremlin/openCypher), TigerGraph, Memgraph.\n\n<strong>2. RDF (Resource Description Framework)</strong>\nTriple-based: subject → predicate → object. Designed for the semantic web and linked data. Used by Neptune (SPARQL mode), GraphDB, Stardog.\n\nProperty graphs are more popular for application development. RDF is preferred for knowledge management, linked open data, and semantic web applications.`,
            },
            {
                type: 'quiz',
                heading: 'Model Match',
                text: 'You\'re building a recommendation engine for an e-commerce site. Which graph data model fits best?',
                choices: [
                    { text: 'Property Graph — intuitive for application data with rich properties', correct: true },
                    { text: 'RDF — semantic triples are ideal for product catalogs', correct: false },
                    { text: 'Neither — use a relational model', correct: false },
                ],
                feedback: {
                    correct: 'Right! Property graphs are the natural choice for application data. Users, products, purchases, and reviews map directly to labeled nodes with properties.',
                    wrong: 'Property graphs are the best fit here. E-commerce data (users, products, purchases) maps naturally to labeled nodes with properties. RDF is better for semantic web / linked data scenarios.'
                }
            },
            {
                type: 'info',
                heading: 'Query Languages Compared',
                text: `<strong>Cypher</strong> (Neo4j / openCypher)\nDeclarative, pattern-matching. ASCII-art syntax.\n<code>MATCH (a)-[:KNOWS]->(b) RETURN b</code>\n\n<strong>Gremlin</strong> (Apache TinkerPop)\nImperative, step-by-step traversal. Very flexible.\n<code>g.V().has('name','Alice').out('KNOWS')</code>\n\n<strong>SPARQL</strong> (W3C standard for RDF)\nDeclarative, triple-pattern matching.\n<code>SELECT ?friend WHERE { :Alice :knows ?friend }</code>\n\n<strong>GQL</strong> (ISO standard, 2024)\nThe new ISO standard — combines ideas from Cypher, SQL, and PGQL. The future of the space.`,
            },
            {
                type: 'quiz',
                heading: 'Language Pick',
                text: 'Your team is using Amazon Neptune. Which query languages can you use?',
                choices: [
                    { text: 'Only Cypher', correct: false },
                    { text: 'Gremlin, openCypher, and SPARQL', correct: true },
                    { text: 'Only Gremlin', correct: false },
                    { text: 'SQL with graph extensions', correct: false },
                ],
                feedback: {
                    correct: 'Neptune is a polyglot graph DB! It supports Gremlin and openCypher for property graphs, and SPARQL for RDF graphs. You can even use both models in the same database.',
                    wrong: 'Amazon Neptune supports multiple languages: Gremlin and openCypher for property graph workloads, and SPARQL for RDF workloads. This multi-model approach is one of Neptune\'s key features.'
                }
            },
            {
                type: 'quiz',
                heading: 'Gremlin Translation',
                text: 'The Gremlin query <code>g.V().has("Person","name","Alice").out("KNOWS").values("name")</code> does what?',
                choices: [
                    { text: 'Creates a new person named Alice and connects her friends', correct: false },
                    { text: 'Finds Alice, traverses outgoing KNOWS edges, returns friend names', correct: true },
                    { text: 'Finds everyone who knows Alice', correct: false },
                    { text: 'Deletes Alice\'s KNOWS relationships', correct: false },
                ],
                feedback: {
                    correct: 'You read Gremlin! g.V() starts at vertices, .has() filters to Alice, .out("KNOWS") traverses outgoing edges, .values("name") extracts the name property.',
                    wrong: 'Gremlin reads step-by-step: g.V() = all vertices → .has() = filter to Alice → .out("KNOWS") = follow outgoing KNOWS edges → .values("name") = get name property of those friends.'
                }
            },
        ]
    },
    {
        id: 'managed',
        num: 5,
        title: 'Managed Services Landscape',
        desc: 'Navigate the cloud options: AWS Neptune, Azure Cosmos DB, Neo4j Aura, and beyond.',
        tags: ['Cloud', 'Services'],
        accent: '#00e5ff',
        steps: [
            {
                type: 'info',
                heading: 'The Managed Graph DB Market',
                text: `Running a graph database in production means choosing a managed service or self-hosting. Here's the landscape:\n\n<strong>AWS: Amazon Neptune</strong>\nFully managed, supports property graph (Gremlin, openCypher) and RDF (SPARQL). Serverless option. Deep AWS integration (IAM, VPC, CloudWatch, S3 bulk loading).\n\n<strong>Azure: Cosmos DB (Gremlin API)</strong>\nMulti-model database with a Gremlin-compatible graph API. Global distribution, SLA-backed latency. Good when you need graph alongside document/key-value in one service.\n\n<strong>GCP</strong>\nNo native first-party graph database. <strong>Neo4j Aura</strong> is available via the GCP Marketplace. Spanner and BigQuery have some graph query features (BigQuery now supports graph patterns).`,
            },
            {
                type: 'quiz',
                heading: 'Cloud Match',
                text: 'Your company is all-in on AWS. You need a managed graph DB that supports both property graphs AND RDF. Which service?',
                choices: [
                    { text: 'Amazon Neptune', correct: true },
                    { text: 'Amazon DynamoDB with graph extensions', correct: false },
                    { text: 'Neo4j Aura on AWS Marketplace', correct: false },
                    { text: 'Amazon Redshift', correct: false },
                ],
                feedback: {
                    correct: 'Neptune is the native choice! It\'s the only AWS service that supports both property graph (Gremlin/openCypher) and RDF (SPARQL) in one managed service, with deep AWS integration.',
                    wrong: 'Amazon Neptune is the answer. It\'s AWS\'s native managed graph DB supporting both property graph (Gremlin, openCypher) and RDF (SPARQL). Deep integration with IAM, VPC, CloudWatch.'
                }
            },
            {
                type: 'info',
                heading: 'Independent Managed Vendors',
                text: `Beyond the hyperscalers, several vendors offer managed graph databases:\n\n<strong>Neo4j Aura</strong>\nManaged Neo4j as a service. Available on AWS, GCP, and Azure marketplaces. Free tier available. Native Cypher, APOC procedures, Graph Data Science library. The most popular graph DB vendor.\n\n<strong>TigerGraph Cloud</strong>\nManaged distributed graph analytics platform. GSQL query language. Strong in deep-link analytics and real-time graph analytics at scale. Available on AWS, Azure, GCP.\n\n<strong>ArangoDB Cloud (ArangoGraph)</strong>\nMulti-model: graph + document + key-value in one engine. AQL query language.\n\n<strong>Dgraph Cloud</strong>\nGraphQL-native distributed graph database.\n\n<strong>Memgraph</strong>\nIn-memory, Cypher-compatible. Focused on real-time streaming graph analytics.`,
            },
            {
                type: 'quiz',
                heading: 'Vendor Eval',
                text: 'You need a managed graph DB with a free tier, Cypher support, and a graph data science library for running PageRank and community detection. Best pick?',
                choices: [
                    { text: 'Amazon Neptune', correct: false },
                    { text: 'Neo4j Aura', correct: true },
                    { text: 'Azure Cosmos DB Gremlin API', correct: false },
                    { text: 'TigerGraph Cloud', correct: false },
                ],
                feedback: {
                    correct: 'Neo4j Aura checks all boxes: free tier, native Cypher, and the Graph Data Science (GDS) library with PageRank, Louvain community detection, node similarity, and 60+ algorithms.',
                    wrong: 'Neo4j Aura is the best fit: free tier, Cypher, Graph Data Science library with PageRank, community detection, and 60+ algorithms. Neptune uses Gremlin/openCypher (no GDS library), Cosmos uses Gremlin only.'
                }
            },
            {
                type: 'quiz',
                heading: 'GCP Strategy',
                text: 'Your team uses Google Cloud. How do you get a managed graph database?',
                choices: [
                    { text: 'Use Google Cloud\'s native graph database service', correct: false },
                    { text: 'Deploy Neo4j Aura via the GCP Marketplace', correct: true },
                    { text: 'Graph databases don\'t work on GCP', correct: false },
                    { text: 'Use Cloud Spanner — it\'s a graph database', correct: false },
                ],
                feedback: {
                    correct: 'Right! GCP doesn\'t have a native graph DB, but Neo4j Aura (and others) are available via the GCP Marketplace. Spanner has some graph features but is not a dedicated graph DB.',
                    wrong: 'GCP doesn\'t offer a native first-party graph database. The best option is Neo4j Aura via the GCP Marketplace. Spanner has graph query features but is fundamentally a relational database.'
                }
            },
        ]
    },
    {
        id: 'practical',
        num: 6,
        title: 'Graph Thinking in Practice',
        desc: 'Apply everything: model a real-world problem, choose the right tools, and think in graphs.',
        tags: ['Applied', 'Final Mission'],
        accent: '#ff00e5',
        steps: [
            {
                type: 'info',
                heading: 'Modeling a Real Problem',
                text: `Let's model a <strong>fraud detection system</strong> for a fintech company. The entities:\n\n• <strong>User</strong> — has name, email, IP address, device fingerprint\n• <strong>Account</strong> — bank account with routing/account numbers\n• <strong>Transaction</strong> — amount, timestamp, from/to account\n• <strong>Device</strong> — device ID, OS, location\n• <strong>IP Address</strong> — IP, geolocation, ISP\n\nRelationships tell the fraud story:\n• User -[:OWNS]-> Account\n• Account -[:SENT {amount, timestamp}]-> Account\n• User -[:USED_DEVICE]-> Device\n• User -[:LOGGED_IN_FROM]-> IP Address`,
                graph: {
                    nodes: [
                        { id: 1, label: 'User A', color: '#00e5ff' },
                        { id: 2, label: 'User B', color: '#00e5ff' },
                        { id: 3, label: 'Acct 1', color: '#39ff14' },
                        { id: 4, label: 'Acct 2', color: '#39ff14' },
                        { id: 5, label: 'Device X', color: '#ffab00' },
                        { id: 6, label: 'IP: 1.2.3.4', color: '#ff00e5' },
                    ],
                    edges: [
                        { from: 1, to: 3, label: 'OWNS', color: { color: '#555f73' } },
                        { from: 2, to: 4, label: 'OWNS', color: { color: '#555f73' } },
                        { from: 3, to: 4, label: 'SENT $5K', color: { color: '#ff3d3d' } },
                        { from: 4, to: 3, label: 'SENT $4.9K', color: { color: '#ff3d3d' } },
                        { from: 1, to: 5, label: 'USED', color: { color: '#ffab00' } },
                        { from: 2, to: 5, label: 'USED', color: { color: '#ffab00' } },
                        { from: 1, to: 6, label: 'FROM_IP', color: { color: '#ff00e5' } },
                        { from: 2, to: 6, label: 'FROM_IP', color: { color: '#ff00e5' } },
                    ]
                }
            },
            {
                type: 'quiz',
                heading: 'Spot the Red Flag',
                text: 'Looking at the graph above: two users share the same device AND same IP, and their accounts send money back and forth in similar amounts. What fraud pattern is this?',
                choices: [
                    { text: 'Phishing attack', correct: false },
                    { text: 'Synthetic identity fraud / money laundering (circular transactions)', correct: true },
                    { text: 'Credit card skimming', correct: false },
                    { text: 'Nothing suspicious — friends can share devices', correct: false },
                ],
                feedback: {
                    correct: 'Exactly! Shared device + shared IP + circular transactions is a classic synthetic identity / money mule pattern. A graph DB spots this in real-time by traversing connections that SQL would need multiple complex JOINs to uncover.',
                    wrong: 'This is a synthetic identity / money laundering pattern: two "different" users share the same device and IP (likely one person) and circular transactions suggest money laundering. Graph DBs can detect this pattern in real-time.'
                }
            },
            {
                type: 'quiz',
                heading: 'Architecture Decision',
                text: 'For this fraud detection system, which architecture makes the most sense?',
                choices: [
                    { text: 'Neo4j Aura for real-time fraud graph + PostgreSQL for user profiles and transaction records', correct: true },
                    { text: 'Only a graph database for everything — user profiles, transactions, logs, all of it', correct: false },
                    { text: 'Only PostgreSQL — add graph queries later if needed', correct: false },
                    { text: 'MongoDB for everything — it can handle relationships with $lookup', correct: false },
                ],
                feedback: {
                    correct: 'Polyglot persistence! Use the graph DB for what it\'s best at (relationship analysis, pattern detection) and a relational DB for what IT\'S best at (structured records, reporting, ACID transactions). This is how real-world systems work.',
                    wrong: 'The best practice is polyglot persistence: graph DB for relationship analysis and fraud pattern detection, relational DB for structured user/transaction records and reporting. Each database type handles what it\'s best at.'
                }
            },
            {
                type: 'quiz',
                heading: 'Final Challenge',
                text: 'A Cypher query to find users who share a device with at least 3 other users (potential fraud ring):',
                choices: [
                    { text: '<code>MATCH (u:User)-[:USED_DEVICE]->(d:Device)<-[:USED_DEVICE]-(other:User) WITH d, collect(DISTINCT other) AS users WHERE size(users) >= 3 RETURN d, users</code>', correct: true },
                    { text: '<code>SELECT * FROM users WHERE device_count > 3</code>', correct: false },
                    { text: '<code>MATCH (u:User) WHERE u.devices > 3 RETURN u</code>', correct: false },
                ],
                feedback: {
                    correct: 'Expert-level Cypher! This finds devices used by multiple users, collects those users, and filters for groups of 3+. This is exactly how fraud analysts query graph databases in production.',
                    wrong: 'The Cypher approach: MATCH users connected to the same device, collect them, and filter for groups >= 3. The graph pattern (u)-[:USED_DEVICE]->(d)<-[:USED_DEVICE]-(other) captures the shared-device relationship directly.'
                }
            },
            {
                type: 'info',
                heading: 'You\'re a Graph Expert Now',
                text: `Congratulations! You've completed all missions. Here's what you now know:\n\n• <strong>Fundamentals</strong> — nodes, edges, properties, labels, traversals\n• <strong>When to use</strong> — sweet spots (connections, patterns) vs. anti-patterns (flat CRUD, OLAP)\n• <strong>Cypher</strong> — pattern matching, variable paths, shortest paths\n• <strong>Data models</strong> — property graph vs. RDF, Cypher vs. Gremlin vs. SPARQL\n• <strong>Managed services</strong> — Neptune, Cosmos DB, Neo4j Aura, TigerGraph, and more\n• <strong>Real-world application</strong> — polyglot persistence, fraud detection patterns\n\nHead to the <strong>Query Lab</strong> to practice hands-on, or use the <strong>Cheat Sheet</strong> as your reference.`,
            },
        ]
    },
];

// ---- Graph Rendering ----
function renderGraph(containerId, graphData) {
    if (!graphData) return;
    const container = document.getElementById(containerId);
    if (!container) return;

    const nodes = new vis.DataSet(graphData.nodes.map(function(n) {
        return Object.assign({}, n, {
            font: { color: '#e4e8f0', size: 13, face: 'IBM Plex Sans' },
            shape: 'dot',
            size: 22,
            borderWidth: 2,
            borderWidthSelected: 3,
            shadow: { enabled: true, color: n.color, size: 10, x: 0, y: 0 },
        });
    }));

    const edges = new vis.DataSet(graphData.edges.map(function(e) {
        return Object.assign({}, e, {
            font: { color: '#8b95a8', size: 10, face: 'IBM Plex Sans', strokeWidth: 3, strokeColor: '#080b12' },
            arrows: { to: { enabled: true, scaleFactor: 0.6 } },
            width: 2,
            smooth: { type: 'curvedCW', roundness: 0.15 },
        });
    }));

    new vis.Network(container, { nodes: nodes, edges: edges }, {
        physics: {
            barnesHut: { gravitationalConstant: -3000, springLength: 150, springConstant: 0.04 },
            stabilization: { iterations: 100 },
        },
        interaction: { hover: true, tooltipDelay: 200, zoomView: false, dragView: false },
        layout: { improvedLayout: true },
    });
}

// ---- Screen Navigation ----
function showScreen(name) {
    document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
    document.getElementById('screen-' + name).classList.add('active');

    document.querySelectorAll('.topnav__link').forEach(function(l) { l.classList.remove('active'); });
    var navBtn = document.querySelector('.topnav__link[data-screen="' + name + '"]');
    if (navBtn) navBtn.classList.add('active');

    if (name === 'home') renderHome();
    if (name === 'query-sim') initQuerySim();
    window.scrollTo(0, 0);
}

// ---- Home Screen ----
function renderHome() {
    updateGlobalProgress();
    document.getElementById('statCompleted').textContent = state.completedMissions.length;
    document.getElementById('statScore').textContent = state.score;
    document.getElementById('statStreak').textContent = state.streak;

    var grid = document.getElementById('missionGrid');
    // Clear existing children safely
    while (grid.firstChild) grid.removeChild(grid.firstChild);

    MISSIONS.forEach(function(m, i) {
        var isCompleted = state.completedMissions.indexOf(m.id) !== -1;
        var isLocked = i > 0 && state.completedMissions.indexOf(MISSIONS[i - 1].id) === -1 && !isCompleted;

        var card = document.createElement('div');
        card.className = 'mission-card' + (isCompleted ? ' mission-card--completed' : '') + (isLocked ? ' mission-card--locked' : '');
        card.style.setProperty('--card-accent', m.accent);

        var numSpan = document.createElement('span');
        numSpan.className = 'mission-card__num';
        numSpan.textContent = 'Mission ' + m.num;
        card.appendChild(numSpan);

        var titleEl = document.createElement('h3');
        titleEl.className = 'mission-card__title';
        titleEl.textContent = m.title;
        card.appendChild(titleEl);

        var descEl = document.createElement('p');
        descEl.className = 'mission-card__desc';
        descEl.textContent = m.desc;
        card.appendChild(descEl);

        var metaDiv = document.createElement('div');
        metaDiv.className = 'mission-card__meta';
        m.tags.forEach(function(t) {
            var tag = document.createElement('span');
            tag.className = 'mission-card__tag';
            tag.textContent = t;
            metaDiv.appendChild(tag);
        });
        var stepSpan = document.createElement('span');
        stepSpan.textContent = m.steps.length + ' steps';
        metaDiv.appendChild(stepSpan);
        if (isLocked) {
            var lockSpan = document.createElement('span');
            lockSpan.textContent = 'Locked';
            metaDiv.appendChild(lockSpan);
        }
        card.appendChild(metaDiv);

        if (!isLocked) {
            (function(missionId) {
                card.onclick = function() { startMission(missionId); };
            })(m.id);
        }

        grid.appendChild(card);
    });

    // Render hero graph
    renderGraph('heroGraph', {
        nodes: [
            { id: 1, label: 'You', color: '#00e5ff' },
            { id: 2, label: 'Nodes', color: '#39ff14' },
            { id: 3, label: 'Edges', color: '#ff00e5' },
            { id: 4, label: 'Cypher', color: '#ffab00' },
            { id: 5, label: 'Neptune', color: '#00e5ff' },
            { id: 6, label: 'Neo4j', color: '#39ff14' },
        ],
        edges: [
            { from: 1, to: 2, label: 'learns', color: { color: '#2a3a4e' } },
            { from: 1, to: 3, label: 'learns', color: { color: '#2a3a4e' } },
            { from: 1, to: 4, label: 'writes', color: { color: '#2a3a4e' } },
            { from: 4, to: 5, label: 'queries', color: { color: '#2a3a4e' } },
            { from: 4, to: 6, label: 'queries', color: { color: '#2a3a4e' } },
            { from: 2, to: 3, label: 'connects', color: { color: '#1e2a3a' } },
        ]
    });
}

function updateGlobalProgress() {
    var pct = (state.completedMissions.length / MISSIONS.length) * 100;
    document.getElementById('globalProgress').style.width = pct + '%';
    document.getElementById('globalProgressText').textContent = state.completedMissions.length + '/' + MISSIONS.length;
}

// ---- Mission Play ----
function startMission(id) {
    var mission = MISSIONS.find(function(m) { return m.id === id; });
    if (!mission) return;

    state.currentMission = mission;
    state.currentStep = 0;
    state.missionScore = 0;

    showScreen('mission');
    document.getElementById('missionNum').textContent = 'Mission ' + mission.num;
    document.getElementById('missionTitle').textContent = mission.title;

    renderStep();
}

function renderStep() {
    var mission = state.currentMission;
    var step = mission.steps[state.currentStep];
    var content = document.getElementById('missionContent');
    var vizEl = document.getElementById('missionViz');

    document.getElementById('missionStep').textContent = (state.currentStep + 1) + ' / ' + mission.steps.length;
    var pct = ((state.currentStep + 1) / mission.steps.length) * 100;
    document.getElementById('missionProgressFill').style.width = pct + '%';

    // Graph viz
    if (step.graph) {
        vizEl.classList.add('visible');
        setTimeout(function() { renderGraph('missionViz', step.graph); }, 50);
    } else {
        vizEl.classList.remove('visible');
    }

    // Clear content safely
    while (content.firstChild) content.removeChild(content.firstChild);
    content.style.animation = 'none';
    void content.offsetHeight;
    content.style.animation = '';

    if (step.heading) {
        var headingEl = document.createElement('h2');
        headingEl.className = 'mc-heading';
        headingEl.textContent = step.heading;
        content.appendChild(headingEl);
    }

    if (step.text) {
        var textDiv = document.createElement('div');
        textDiv.className = 'mc-text';
        // Content is hardcoded developer-controlled strings only (from MISSIONS array)
        textDiv.innerHTML = formatText(step.text);
        content.appendChild(textDiv);
    }

    if (step.type === 'quiz') {
        var choicesDiv = document.createElement('div');
        choicesDiv.className = 'mc-choices';

        step.choices.forEach(function(c, i) {
            var btn = document.createElement('button');
            btn.className = 'mc-choice';

            var marker = document.createElement('span');
            marker.className = 'mc-choice__marker';
            marker.textContent = String.fromCharCode(65 + i);
            btn.appendChild(marker);

            var textSpan = document.createElement('span');
            // Choice text may contain <code> tags from hardcoded data
            textSpan.innerHTML = c.text;
            btn.appendChild(textSpan);

            (function(idx) {
                btn.onclick = function() { handleAnswer(idx, step, choicesDiv); };
            })(i);
            choicesDiv.appendChild(btn);
        });

        content.appendChild(choicesDiv);
    } else {
        var nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn--primary mc-next';
        nextBtn.textContent = state.currentStep < mission.steps.length - 1 ? 'Continue \u2192' : 'Complete Mission \u2713';
        nextBtn.onclick = function() { advanceStep(); };
        content.appendChild(nextBtn);
    }
}

function handleAnswer(choiceIdx, step, choicesDiv) {
    var choices = choicesDiv.querySelectorAll('.mc-choice');
    var chosen = step.choices[choiceIdx];
    var isCorrect = chosen.correct;

    choices.forEach(function(btn, i) {
        btn.classList.add('mc-choice--disabled');
        if (step.choices[i].correct) btn.classList.add('mc-choice--correct');
        if (i === choiceIdx && !isCorrect) btn.classList.add('mc-choice--wrong');
        btn.onclick = null;
    });

    var feedback = document.createElement('div');
    feedback.className = 'mc-feedback mc-feedback--' + (isCorrect ? 'correct' : 'wrong');
    feedback.textContent = isCorrect ? step.feedback.correct : step.feedback.wrong;
    choicesDiv.parentNode.insertBefore(feedback, choicesDiv.nextSibling);

    if (isCorrect) {
        state.missionScore += 10;
        state.streak++;
    } else {
        state.streak = 0;
    }

    var nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn--primary mc-next';
    nextBtn.textContent = state.currentStep < state.currentMission.steps.length - 1 ? 'Continue \u2192' : 'Complete Mission \u2713';
    nextBtn.onclick = function() { advanceStep(); };
    feedback.parentNode.insertBefore(nextBtn, feedback.nextSibling);
}

function advanceStep() {
    var mission = state.currentMission;
    if (state.currentStep < mission.steps.length - 1) {
        state.currentStep++;
        renderStep();
        window.scrollTo(0, 0);
    } else {
        completeMission();
    }
}

function completeMission() {
    var mission = state.currentMission;
    if (state.completedMissions.indexOf(mission.id) === -1) {
        state.completedMissions.push(mission.id);
        state.score += state.missionScore + 20;
    }
    save();

    document.getElementById('completeTitle').textContent = 'Mission ' + mission.num + ' Complete!';
    document.getElementById('completeText').textContent = mission.title;
    document.getElementById('completeScore').textContent = state.missionScore + 20;

    var nextIdx = MISSIONS.findIndex(function(m) { return m.id === mission.id; }) + 1;
    var nextBtnEl = document.getElementById('nextMissionBtn');
    if (nextIdx < MISSIONS.length) {
        nextBtnEl.style.display = '';
        nextBtnEl.onclick = function() { closeOverlay(); startMission(MISSIONS[nextIdx].id); };
    } else {
        nextBtnEl.style.display = 'none';
    }

    document.getElementById('overlay-complete').classList.add('active');
}

function startNextMission() {
    var idx = MISSIONS.findIndex(function(m) { return m.id === state.currentMission.id; }) + 1;
    if (idx < MISSIONS.length) {
        closeOverlay();
        startMission(MISSIONS[idx].id);
    }
}

function closeOverlay() {
    document.querySelectorAll('.overlay').forEach(function(o) { o.classList.remove('active'); });
}

function formatText(text) {
    return text.replace(/\n/g, '<br>');
}

// ---- Query Simulator ----
var SCENARIOS = {
    social: {
        title: 'Social Network',
        nodes: [
            { id: 1, label: 'Alice', color: '#00e5ff', group: 'person' },
            { id: 2, label: 'Bob', color: '#00e5ff', group: 'person' },
            { id: 3, label: 'Carol', color: '#00e5ff', group: 'person' },
            { id: 4, label: 'Dave', color: '#00e5ff', group: 'person' },
            { id: 5, label: 'Eve', color: '#00e5ff', group: 'person' },
            { id: 6, label: 'GraphCo', color: '#ffab00', group: 'company' },
            { id: 7, label: 'DataInc', color: '#ffab00', group: 'company' },
        ],
        edges: [
            { from: 1, to: 2, label: 'KNOWS', color: { color: '#39ff14' } },
            { from: 1, to: 3, label: 'KNOWS', color: { color: '#39ff14' } },
            { from: 2, to: 4, label: 'KNOWS', color: { color: '#39ff14' } },
            { from: 3, to: 5, label: 'KNOWS', color: { color: '#39ff14' } },
            { from: 4, to: 5, label: 'KNOWS', color: { color: '#39ff14' } },
            { from: 1, to: 6, label: 'WORKS_AT', color: { color: '#ff00e5' } },
            { from: 2, to: 6, label: 'WORKS_AT', color: { color: '#ff00e5' } },
            { from: 3, to: 7, label: 'WORKS_AT', color: { color: '#ff00e5' } },
            { from: 4, to: 7, label: 'WORKS_AT', color: { color: '#ff00e5' } },
        ],
        legend: [
            { label: 'Person', color: '#00e5ff' },
            { label: 'Company', color: '#ffab00' },
            { label: 'KNOWS', color: '#39ff14' },
            { label: 'WORKS_AT', color: '#ff00e5' },
        ],
        querySteps: [
            {
                label: 'Start from...',
                options: [
                    { value: '', text: '\u2014 Select \u2014' },
                    { value: 'alice', text: 'Alice (Person)' },
                    { value: 'bob', text: 'Bob (Person)' },
                    { value: 'graphco', text: 'GraphCo (Company)' },
                ]
            },
            {
                label: 'Follow relationship...',
                options: [
                    { value: '', text: '\u2014 Select \u2014' },
                    { value: 'knows_out', text: '\u2014KNOWS\u2192 (outgoing)' },
                    { value: 'knows_in', text: '\u2190KNOWS\u2014 (incoming)' },
                    { value: 'works_at', text: '\u2014WORKS_AT\u2192' },
                    { value: 'works_at_in', text: '\u2190WORKS_AT\u2014 (who works here)' },
                ]
            },
            {
                label: 'Then...',
                options: [
                    { value: '', text: '\u2014 Select (optional) \u2014' },
                    { value: 'knows_out2', text: '\u2014KNOWS\u2192 (2nd hop)' },
                    { value: 'works_at2', text: '\u2014WORKS_AT\u2192' },
                    { value: 'works_at_in2', text: '\u2190WORKS_AT\u2014 (co-workers)' },
                ]
            },
        ],
    },
    movie: {
        title: 'Movie Database',
        nodes: [
            { id: 1, label: 'The Matrix', color: '#39ff14', group: 'movie' },
            { id: 2, label: 'John Wick', color: '#39ff14', group: 'movie' },
            { id: 3, label: 'Speed', color: '#39ff14', group: 'movie' },
            { id: 4, label: 'Keanu', color: '#00e5ff', group: 'actor' },
            { id: 5, label: 'Carrie-Anne', color: '#00e5ff', group: 'actor' },
            { id: 6, label: 'Laurence', color: '#00e5ff', group: 'actor' },
            { id: 7, label: 'Sci-Fi', color: '#ff00e5', group: 'genre' },
            { id: 8, label: 'Action', color: '#ff00e5', group: 'genre' },
        ],
        edges: [
            { from: 4, to: 1, label: 'ACTED_IN', color: { color: '#39ff14' } },
            { from: 5, to: 1, label: 'ACTED_IN', color: { color: '#39ff14' } },
            { from: 6, to: 1, label: 'ACTED_IN', color: { color: '#39ff14' } },
            { from: 4, to: 2, label: 'ACTED_IN', color: { color: '#39ff14' } },
            { from: 4, to: 3, label: 'ACTED_IN', color: { color: '#39ff14' } },
            { from: 1, to: 7, label: 'HAS_GENRE', color: { color: '#ff00e5' } },
            { from: 1, to: 8, label: 'HAS_GENRE', color: { color: '#ff00e5' } },
            { from: 2, to: 8, label: 'HAS_GENRE', color: { color: '#ff00e5' } },
            { from: 3, to: 8, label: 'HAS_GENRE', color: { color: '#ff00e5' } },
        ],
        legend: [
            { label: 'Movie', color: '#39ff14' },
            { label: 'Actor', color: '#00e5ff' },
            { label: 'Genre', color: '#ff00e5' },
        ],
        querySteps: [
            {
                label: 'Start from...',
                options: [
                    { value: '', text: '\u2014 Select \u2014' },
                    { value: 'matrix', text: 'The Matrix (Movie)' },
                    { value: 'keanu', text: 'Keanu (Actor)' },
                    { value: 'action', text: 'Action (Genre)' },
                ]
            },
            {
                label: 'Follow relationship...',
                options: [
                    { value: '', text: '\u2014 Select \u2014' },
                    { value: 'acted_in', text: '\u2014ACTED_IN\u2192 (to movies)' },
                    { value: 'acted_in_rev', text: '\u2190ACTED_IN\u2014 (who acted)' },
                    { value: 'has_genre', text: '\u2014HAS_GENRE\u2192' },
                    { value: 'has_genre_rev', text: '\u2190HAS_GENRE\u2014 (movies in genre)' },
                ]
            },
            {
                label: 'Then...',
                options: [
                    { value: '', text: '\u2014 Select (optional) \u2014' },
                    { value: 'acted_in2', text: '\u2014ACTED_IN\u2192 (their movies)' },
                    { value: 'acted_in_rev2', text: '\u2190ACTED_IN\u2014 (co-actors)' },
                    { value: 'has_genre2', text: '\u2014HAS_GENRE\u2192 (genre)' },
                ]
            },
        ],
    },
    fraud: {
        title: 'Fraud Detection',
        nodes: [
            { id: 1, label: 'User A', color: '#00e5ff', group: 'user' },
            { id: 2, label: 'User B', color: '#00e5ff', group: 'user' },
            { id: 3, label: 'User C', color: '#00e5ff', group: 'user' },
            { id: 4, label: 'Acct 101', color: '#39ff14', group: 'account' },
            { id: 5, label: 'Acct 202', color: '#39ff14', group: 'account' },
            { id: 6, label: 'Acct 303', color: '#39ff14', group: 'account' },
            { id: 7, label: 'Device X', color: '#ffab00', group: 'device' },
            { id: 8, label: 'IP 10.0.1.1', color: '#ff00e5', group: 'ip' },
        ],
        edges: [
            { from: 1, to: 4, label: 'OWNS', color: { color: '#555f73' } },
            { from: 2, to: 5, label: 'OWNS', color: { color: '#555f73' } },
            { from: 3, to: 6, label: 'OWNS', color: { color: '#555f73' } },
            { from: 4, to: 5, label: 'SENT $5K', color: { color: '#ff3d3d' } },
            { from: 5, to: 6, label: 'SENT $4.8K', color: { color: '#ff3d3d' } },
            { from: 6, to: 4, label: 'SENT $4.5K', color: { color: '#ff3d3d' } },
            { from: 1, to: 7, label: 'USED', color: { color: '#ffab00' } },
            { from: 2, to: 7, label: 'USED', color: { color: '#ffab00' } },
            { from: 1, to: 8, label: 'FROM_IP', color: { color: '#ff00e5' } },
            { from: 2, to: 8, label: 'FROM_IP', color: { color: '#ff00e5' } },
            { from: 3, to: 8, label: 'FROM_IP', color: { color: '#ff00e5' } },
        ],
        legend: [
            { label: 'User', color: '#00e5ff' },
            { label: 'Account', color: '#39ff14' },
            { label: 'Device', color: '#ffab00' },
            { label: 'IP', color: '#ff00e5' },
            { label: 'Transaction', color: '#ff3d3d' },
        ],
        querySteps: [
            {
                label: 'Start from...',
                options: [
                    { value: '', text: '\u2014 Select \u2014' },
                    { value: 'userA', text: 'User A' },
                    { value: 'deviceX', text: 'Device X' },
                    { value: 'ip', text: 'IP 10.0.1.1' },
                ]
            },
            {
                label: 'Follow relationship...',
                options: [
                    { value: '', text: '\u2014 Select \u2014' },
                    { value: 'owns', text: '\u2014OWNS\u2192 (to account)' },
                    { value: 'used_rev', text: '\u2190USED\u2014 (who used this)' },
                    { value: 'from_ip_rev', text: '\u2190FROM_IP\u2014 (who from this IP)' },
                    { value: 'sent', text: '\u2014SENT\u2192 (money flow)' },
                ]
            },
            {
                label: 'Then...',
                options: [
                    { value: '', text: '\u2014 Select (optional) \u2014' },
                    { value: 'sent2', text: '\u2014SENT\u2192 (follow the money)' },
                    { value: 'owns_rev', text: '\u2190OWNS\u2014 (account owner)' },
                    { value: 'used2', text: '\u2014USED\u2192 (shared devices)' },
                ]
            },
        ],
    }
};

var QUERY_MAP = {
    // Social
    'alice|knows_out|': { cypher: 'MATCH (a:Person {name: "Alice"})-[:KNOWS]->(friend)\nRETURN friend.name', explanation: 'Start at Alice, follow outgoing KNOWS edges. Returns all people Alice directly knows: Bob and Carol.', results: '\u2192 Bob\n\u2192 Carol' },
    'alice|knows_out|knows_out2': { cypher: 'MATCH (a:Person {name: "Alice"})-[:KNOWS]->(f)-[:KNOWS]->(fof)\nWHERE fof <> a\nRETURN DISTINCT fof.name', explanation: 'Two-hop KNOWS traversal from Alice. Friends of Alice\'s friends (excluding Alice herself). This is the classic "friend of a friend" query.', results: '\u2192 Dave (via Bob)\n\u2192 Eve (via Carol)' },
    'alice|works_at|': { cypher: 'MATCH (a:Person {name: "Alice"})-[:WORKS_AT]->(c:Company)\nRETURN c.name', explanation: 'Follow Alice\'s WORKS_AT relationship to find her company.', results: '\u2192 GraphCo' },
    'alice|knows_out|works_at2': { cypher: 'MATCH (a:Person {name: "Alice"})-[:KNOWS]->(f)-[:WORKS_AT]->(c)\nRETURN f.name, c.name', explanation: 'Find where Alice\'s friends work. First hop: KNOWS to friends. Second hop: WORKS_AT to their companies.', results: '\u2192 Bob works at GraphCo\n\u2192 Carol works at DataInc' },
    'bob|knows_out|': { cypher: 'MATCH (b:Person {name: "Bob"})-[:KNOWS]->(friend)\nRETURN friend.name', explanation: 'Start at Bob, traverse outgoing KNOWS edges.', results: '\u2192 Dave' },
    'graphco|works_at_in|': { cypher: 'MATCH (c:Company {name: "GraphCo"})<-[:WORKS_AT]-(emp)\nRETURN emp.name', explanation: 'Reverse traversal: find all people who WORK_AT GraphCo. The arrow points toward the company, so we reverse it.', results: '\u2192 Alice\n\u2192 Bob' },
    'graphco|works_at_in|knows_out2': { cypher: 'MATCH (c:Company {name: "GraphCo"})<-[:WORKS_AT]-(emp)-[:KNOWS]->(friend)\nRETURN emp.name, friend.name', explanation: 'Find GraphCo employees and who they know. Two hops: reverse WORKS_AT to find employees, then KNOWS to find their connections.', results: '\u2192 Alice knows Bob, Carol\n\u2192 Bob knows Dave' },
    'alice|knows_in|': { cypher: 'MATCH (a:Person {name: "Alice"})<-[:KNOWS]-(who)\nRETURN who.name', explanation: 'Reverse KNOWS: who knows Alice? Follow incoming KNOWS edges.', results: '(No incoming KNOWS to Alice in this dataset)' },
    'bob|knows_in|': { cypher: 'MATCH (b:Person {name: "Bob"})<-[:KNOWS]-(who)\nRETURN who.name', explanation: 'Who knows Bob? Follow incoming KNOWS relationships.', results: '\u2192 Alice' },
    'alice|works_at|works_at_in2': { cypher: 'MATCH (a:Person {name: "Alice"})-[:WORKS_AT]->(c)<-[:WORKS_AT]-(coworker)\nWHERE coworker <> a\nRETURN coworker.name', explanation: 'Find Alice\'s co-workers! Go to her company, then find others who work there. This pattern (A\u2192C\u2190B) is very common for finding co-occurrences.', results: '\u2192 Bob' },

    // Movie
    'matrix|acted_in_rev|': { cypher: 'MATCH (m:Movie {title: "The Matrix"})<-[:ACTED_IN]-(actor)\nRETURN actor.name', explanation: 'Who acted in The Matrix? Reverse ACTED_IN traversal from the movie to actors.', results: '\u2192 Keanu\n\u2192 Carrie-Anne\n\u2192 Laurence' },
    'keanu|acted_in|': { cypher: 'MATCH (a:Actor {name: "Keanu"})-[:ACTED_IN]->(m:Movie)\nRETURN m.title', explanation: 'What movies did Keanu act in? Follow ACTED_IN from actor to movies.', results: '\u2192 The Matrix\n\u2192 John Wick\n\u2192 Speed' },
    'keanu|acted_in|acted_in_rev2': { cypher: 'MATCH (a:Actor {name: "Keanu"})-[:ACTED_IN]->(m)<-[:ACTED_IN]-(costar)\nWHERE costar <> a\nRETURN DISTINCT costar.name', explanation: 'Find Keanu\'s co-stars! Go to his movies, then find other actors in those movies. The (A\u2192M\u2190B) pattern finds co-occurrences \u2014 same pattern as finding co-workers!', results: '\u2192 Carrie-Anne (The Matrix)\n\u2192 Laurence (The Matrix)' },
    'matrix|has_genre|': { cypher: 'MATCH (m:Movie {title: "The Matrix"})-[:HAS_GENRE]->(g:Genre)\nRETURN g.name', explanation: 'What genres is The Matrix? Follow HAS_GENRE edges.', results: '\u2192 Sci-Fi\n\u2192 Action' },
    'action|has_genre_rev|': { cypher: 'MATCH (g:Genre {name: "Action"})<-[:HAS_GENRE]-(m:Movie)\nRETURN m.title', explanation: 'Find all Action movies. Reverse traverse HAS_GENRE from the genre to movies.', results: '\u2192 The Matrix\n\u2192 John Wick\n\u2192 Speed' },
    'action|has_genre_rev|acted_in_rev2': { cypher: 'MATCH (g:Genre {name: "Action"})<-[:HAS_GENRE]-(m)<-[:ACTED_IN]-(actor)\nRETURN DISTINCT actor.name, collect(m.title)', explanation: 'Who acts in Action movies? Three-node traversal: Genre \u2190 Movie \u2190 Actor. Shows actors and their action films.', results: '\u2192 Keanu: The Matrix, John Wick, Speed\n\u2192 Carrie-Anne: The Matrix\n\u2192 Laurence: The Matrix' },
    'keanu|acted_in|has_genre2': { cypher: 'MATCH (a:Actor {name: "Keanu"})-[:ACTED_IN]->(m)-[:HAS_GENRE]->(g)\nRETURN DISTINCT g.name', explanation: 'What genres does Keanu act in? Follow ACTED_IN to his movies, then HAS_GENRE to genres.', results: '\u2192 Sci-Fi\n\u2192 Action' },
    'matrix|acted_in_rev|acted_in2': { cypher: 'MATCH (m:Movie {title: "The Matrix"})<-[:ACTED_IN]-(a)-[:ACTED_IN]->(other)\nWHERE other <> m\nRETURN DISTINCT other.title', explanation: 'Movies connected to The Matrix through shared actors. Find The Matrix actors, then find their other movies. Classic recommendation pattern!', results: '\u2192 John Wick (via Keanu)\n\u2192 Speed (via Keanu)' },

    // Fraud
    'userA|owns|': { cypher: 'MATCH (u:User {name: "User A"})-[:OWNS]->(acct:Account)\nRETURN acct.id', explanation: 'Find accounts owned by User A.', results: '\u2192 Acct 101' },
    'userA|owns|sent2': { cypher: 'MATCH (u:User {name: "User A"})-[:OWNS]->(acct)-[:SENT]->(target)\nRETURN acct.id, target.id', explanation: 'Follow the money from User A\'s account. Where did money go?', results: '\u2192 Acct 101 sent $5K to Acct 202' },
    'deviceX|used_rev|': { cypher: 'MATCH (d:Device {id: "X"})<-[:USED]-(user)\nRETURN user.name', explanation: 'Who used Device X? Reverse USED traversal. Finding shared devices is key for fraud detection.', results: '\u2192 User A\n\u2192 User B\n\u26a0 Multiple users on same device!' },
    'ip|from_ip_rev|': { cypher: 'MATCH (ip:IP {addr: "10.0.1.1"})<-[:FROM_IP]-(user)\nRETURN user.name', explanation: 'Who logged in from this IP? Three users from the same IP is a red flag.', results: '\u2192 User A\n\u2192 User B\n\u2192 User C\n\u26a0 Three users, one IP!' },
    'deviceX|used_rev|owns2': { cypher: 'MATCH (d:Device {id: "X"})<-[:USED]-(user)-[:OWNS]->(acct)\nRETURN user.name, acct.id', explanation: 'Find all accounts linked to Device X\'s users. This connects a shared device to financial accounts \u2014 a fraud investigation path.', results: '\u2192 User A \u2192 Acct 101\n\u2192 User B \u2192 Acct 202' },
    'ip|from_ip_rev|used2': { cypher: 'MATCH (ip:IP)<-[:FROM_IP]-(user)-[:USED]->(device)\nRETURN user.name, device.id', explanation: 'From an IP, find users and their devices. Cross-referencing IP and device data reveals identity clusters.', results: '\u2192 User A \u2192 Device X\n\u2192 User B \u2192 Device X\n\u2192 User C \u2192 (no device data)\n\u26a0 A & B share IP AND device!' },
};

var currentScenario = 'social';

function initQuerySim() {
    loadQueryScenario();
}

function loadQueryScenario() {
    currentScenario = document.getElementById('qsimScenario').value;
    var scenario = SCENARIOS[currentScenario];

    renderGraph('qsimGraph', scenario);

    // Legend
    var legendEl = document.getElementById('qsimLegend');
    while (legendEl.firstChild) legendEl.removeChild(legendEl.firstChild);
    scenario.legend.forEach(function(l) {
        var item = document.createElement('span');
        item.className = 'qsim__legend-item';
        var dot = document.createElement('span');
        dot.className = 'qsim__legend-dot';
        dot.style.background = l.color;
        item.appendChild(dot);
        item.appendChild(document.createTextNode(l.label));
        legendEl.appendChild(item);
    });

    // Query steps
    var stepsEl = document.getElementById('qsimSteps');
    while (stepsEl.firstChild) stepsEl.removeChild(stepsEl.firstChild);
    scenario.querySteps.forEach(function(step, i) {
        var div = document.createElement('div');
        div.className = 'qsim__step';

        var numSpan = document.createElement('span');
        numSpan.className = 'qsim__step-num';
        numSpan.textContent = i + 1;
        div.appendChild(numSpan);

        var select = document.createElement('select');
        select.id = 'qstep' + i;
        select.onchange = updateQueryPreview;
        step.options.forEach(function(o) {
            var opt = document.createElement('option');
            opt.value = o.value;
            opt.textContent = o.text;
            select.appendChild(opt);
        });
        div.appendChild(select);
        stepsEl.appendChild(div);
    });

    document.getElementById('qsimCypher').textContent = '// Select query steps above';
    document.getElementById('qsimExplanation').textContent = 'Choose a starting node and relationships to build a graph query step-by-step.';
    document.getElementById('qsimResults').classList.remove('visible');

    renderChallenges();
}

function updateQueryPreview() {
    var key = getQueryKey();
    var match = QUERY_MAP[key];

    if (match) {
        document.getElementById('qsimCypher').textContent = match.cypher;
        document.getElementById('qsimExplanation').textContent = match.explanation;
    } else {
        var steps = [];
        for (var i = 0; i < 3; i++) {
            var el = document.getElementById('qstep' + i);
            if (el && el.value) steps.push(el.options[el.selectedIndex].text);
        }
        if (steps.length > 0) {
            document.getElementById('qsimCypher').textContent = '// Building: ' + steps.join(' \u2192 ');
            document.getElementById('qsimExplanation').textContent = 'This combination isn\'t pre-mapped. Try different steps to explore available query patterns!';
        }
    }
    document.getElementById('qsimResults').classList.remove('visible');
}

function getQueryKey() {
    var vals = [];
    for (var i = 0; i < 3; i++) {
        var el = document.getElementById('qstep' + i);
        vals.push(el ? el.value : '');
    }
    return vals.join('|');
}

function runQuery() {
    var key = getQueryKey();
    var match = QUERY_MAP[key];
    var resultsEl = document.getElementById('qsimResults');

    if (match) {
        resultsEl.textContent = 'Results:\n' + match.results;
        resultsEl.classList.add('visible');
    } else {
        resultsEl.textContent = 'No results \u2014 try a different query combination.';
        resultsEl.classList.add('visible');
    }
}

function renderChallenges() {
    var challenges = [
        { title: 'Find Friends of Friends', desc: 'Starting from Alice, find everyone 2 hops away via KNOWS.', difficulty: 'easy', scenario: 'social', hint: 'alice|knows_out|knows_out2' },
        { title: 'Co-Worker Discovery', desc: 'Find Alice\'s co-workers at GraphCo.', difficulty: 'easy', scenario: 'social', hint: 'alice|works_at|works_at_in2' },
        { title: 'Movie Recommendation', desc: 'Find movies connected to The Matrix through shared actors.', difficulty: 'medium', scenario: 'movie', hint: 'matrix|acted_in_rev|acted_in2' },
        { title: 'Keanu\'s Co-Stars', desc: 'Find all actors who appeared in movies with Keanu.', difficulty: 'medium', scenario: 'movie', hint: 'keanu|acted_in|acted_in_rev2' },
        { title: 'Shared Device Alert', desc: 'Find all users who used Device X.', difficulty: 'easy', scenario: 'fraud', hint: 'deviceX|used_rev|' },
        { title: 'Follow the Money', desc: 'Trace money flow from User A\'s account.', difficulty: 'medium', scenario: 'fraud', hint: 'userA|owns|sent2' },
        { title: 'IP Identity Cluster', desc: 'From IP 10.0.1.1, find users and their devices to spot shared identities.', difficulty: 'hard', scenario: 'fraud', hint: 'ip|from_ip_rev|used2' },
    ];

    var listEl = document.getElementById('qsimChallenges');
    while (listEl.firstChild) listEl.removeChild(listEl.firstChild);

    challenges.forEach(function(ch) {
        var card = document.createElement('div');
        card.className = 'qsim__challenge-card';

        var h4 = document.createElement('h4');
        h4.textContent = ch.title;
        card.appendChild(h4);

        var p = document.createElement('p');
        p.textContent = ch.desc;
        card.appendChild(p);

        var diff = document.createElement('span');
        diff.className = 'qsim__challenge-difficulty qsim__challenge-difficulty--' + ch.difficulty;
        diff.textContent = ch.difficulty;
        card.appendChild(diff);

        (function(challenge) {
            card.onclick = function() {
                document.getElementById('qsimScenario').value = challenge.scenario;
                loadQueryScenario();
                var parts = challenge.hint.split('|');
                for (var i = 0; i < parts.length; i++) {
                    var el = document.getElementById('qstep' + i);
                    if (el) el.value = parts[i];
                }
                updateQueryPreview();
                var layoutEl = document.querySelector('.qsim__layout');
                if (layoutEl) {
                    window.scrollTo({ top: layoutEl.offsetTop - 80, behavior: 'smooth' });
                }
            };
        })(ch);

        listEl.appendChild(card);
    });
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', function() {
    renderHome();
});

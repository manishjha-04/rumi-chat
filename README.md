# Rumi Chat
## Overview
The Rumi Chat visualization system allows users to interact with various data visualizations through natural language queries. The system supports multiple visualization types including line charts, pie charts, bar charts, tables, and rich text content.

## Available Visualizations

### 1. Sales Trends
**Query Examples:**
- "Show me sales trends"
- "Display sales over time"
- "What are the sales trends for the last 6 months?"

**Returns:** A line chart showing monthly sales data from January to June.

### 2. Revenue Distribution
**Query Examples:**
- "Show revenue distribution"
- "What's the revenue breakdown?"
- "Display revenue distribution across products"

**Returns:** A pie chart showing revenue distribution across Products A-D and Others.

### 3. Customer Demographics
**Query Examples:**
- "Show customer demographics"
- "Display customer age groups"
- "What are our customer demographics?"

**Returns:** A table showing customer distribution across age groups with counts and percentages.

### 4. Performance Comparison
**Query Examples:**
- "Show performance vs target"
- "Display quarterly performance"
- "How are we performing against targets?"

**Returns:** A bar chart comparing actual performance against targets for each quarter.

### 5. Key Metrics
**Query Examples:**
- "Show key metrics"
- "Display KPIs"
- "What are our key performance indicators?"

**Returns:** A formatted text display showing key metrics including revenue, growth, and satisfaction scores.

### 6. Media Gallery
**Query Examples:**
- "Show company events"
- "Display media gallery"
- "Show me recent company events"
- "Display images"

**Returns:** An image gallery showing recent company events with captions.

### 7. Quarterly Report
**Query Examples:**
- "Show quarterly report"
- "Display Q2 summary"
- "Show me the latest report"

**Returns:** A rich text document containing the quarterly report with formatting and embedded media.



## Error Handling
- If no matching visualization is found for a query, the system returns `null`
- All queries are case-insensitive for better user experience



## Supported Visualization Types
- `line-chart`: Temporal data visualization
- `pie-chart`: Proportional data visualization
- `bar-chart`: Comparative data visualization
- `table`: Structured data presentation
- `text`: Formatted text content
- `images`: Media gallery

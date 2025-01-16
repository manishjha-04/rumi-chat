export const mockVisualizations = {
  "sales_trend": {
    type: 'line-chart',
    data: [
      { month: 'January', sales: 4200 },
      { month: 'February', sales: 3800 },
      { month: 'March', sales: 5100 },
      { month: 'April', sales: 4800 },
      { month: 'May', sales: 6200 },
      { month: 'June', sales: 7500 }
    ],
    xKey: 'month',
    yKey: 'sales',
    title: 'Sales Trends - Last 6 Months'
  },

  "revenue_distribution": {
    type: 'pie-chart',
    data: [
      { category: 'Product A', value: 35 },
      { category: 'Product B', value: 25 },
      { category: 'Product C', value: 20 },
      { category: 'Product D', value: 15 },
      { category: 'Others', value: 5 }
    ],
    dataKey: 'value',
    nameKey: 'category',
    title: 'Revenue Distribution by Product'
  },

  "customer_demographics": {
    type: 'table',
    data: [
      { age_group: '18-24', count: 1200, percentage: '15%' },
      { age_group: '25-34', count: 2500, percentage: '31%' },
      { age_group: '35-44', count: 2100, percentage: '26%' },
      { age_group: '45-54', count: 1500, percentage: '19%' },
      { age_group: '55+', count: 700, percentage: '9%' }
    ],
    columns: [
      { id: 'age_group', label: 'Age Group' },
      { id: 'count', label: 'Customer Count', numeric: true },
      { id: 'percentage', label: 'Percentage' }
    ]
  },

  "performance_comparison": {
    type: 'bar-chart',
    data: [
      { category: 'Q1', actual: 8500, target: 8000 },
      { category: 'Q2', actual: 9200, target: 8500 },
      { category: 'Q3', actual: 8800, target: 9000 },
      { category: 'Q4', actual: 10500, target: 9500 }
    ],
    xKey: 'category',
    yKey: 'actual',
    title: 'Quarterly Performance vs Target'
  },

  "key_metrics": {
    type: 'text',
    data: `# Key Performance Metrics
- **Total Revenue**: $1.2M
- **Customer Growth**: +15%
- **Average Order Value**: $250
- **Customer Satisfaction**: 4.5/5

## Highlights
- Achieved 120% of quarterly target
- Reduced customer churn by 5%
- Launched 3 new product lines
- Expanded to 2 new markets`
  },

  "media_gallery": {
    type: 'images',
    data: [
      { 
        url: 'https://picsum.photos/400/300?random=1', 
        alt: 'Product Launch Event',
        caption: 'Our latest product launch event in New York'
      },
      { 
        url: 'https://picsum.photos/400/300?random=2', 
        alt: 'Team Meeting',
        caption: 'Quarterly strategy meeting with global teams'
      },
      { 
        url: 'https://picsum.photos/400/300?random=3', 
        alt: 'Customer Workshop',
        caption: 'Customer engagement workshop in London'
      },
      { 
        url: 'https://picsum.photos/400/300?random=5', 
        alt: 'Customer ',
        caption: ' workshop in india'
      }
    ],
    title: 'Recent Company Events'
  },

  "rich_content": {
    type: 'text',
    data: ` Q2 2024 Quarterly Report

## Executive Summary
Our Q2 performance demonstrates strong growth across all key metrics.

### Financial Highlights
- Revenue: **$12.5M** _(↑15% YoY)_
- Gross Margin: **68%** _(↑3% from Q1)_
- Operating Expenses: **$8.2M** _(within budget)_

### Key Achievements
1. 🚀 Launched 3 new product features
2. 💼 Secured 2 enterprise partnerships
3. 🌟 Achieved 98% customer satisfaction

> "Our focus on customer-centric innovation continues to drive sustainable growth."
> *- CEO Statement*

![Quarterly Highlights](https://picsum.photos/800/400?random=4)
`
  }
};

export const getVisualizationResponse = (query) => {
  query = query.toLowerCase();
  
  if (query.includes('sales') && (query.includes('trend') || query.includes('over time'))) {
    return {
      message: "Here's the sales trend over the last 6 months. We can see a steady increase, with particularly strong growth in May and June.",
      visualization: mockVisualizations.sales_trend
    };
  }
  
  if (query.includes('revenue') && query.includes('distribution')) {
    return {
      message: "Here's how our revenue is distributed across different products. Product A is our strongest performer, contributing 35% of total revenue.",
      visualization: mockVisualizations.revenue_distribution
    };
  }
  
  if (query.includes('customer') && (query.includes('demographic') || query.includes('age'))) {
    return {
      message: "Here's a breakdown of our customer demographics by age group. The 25-34 age group represents our largest customer segment.",
      visualization: mockVisualizations.customer_demographics
    };
  }
  
  if (query.includes('performance') || query.includes('target')) {
    return {
      message: "Here's our quarterly performance compared to targets. We've exceeded targets in most quarters, with Q4 showing the strongest performance.",
      visualization: mockVisualizations.performance_comparison
    };
  }
  
  if (query.includes('metrics') || query.includes('kpi')) {
    return {
      message: "Here are our key performance metrics and highlights for the period:",
      visualization: mockVisualizations.key_metrics
    };
  }
  
  if (query.includes('media') || query.includes('gallery') || query.includes('images') || 
      query.includes('company event') || query.includes('recent event') || query.includes('show me recent company event')) {
    return {
      message: "Here are some highlights from our recent company events:",
      visualization: mockVisualizations.media_gallery
    };
  }

  if (query.includes('report') || query.includes('quarterly') || query.includes('summary')) {
    return {
      message: "Here's the latest quarterly report with detailed insights:",
      visualization: mockVisualizations.rich_content
    };
  }
  
  return null;
}; 
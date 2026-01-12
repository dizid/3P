// Decision templates for quick-start scenarios

export const templates = {
  // Template categories
  categories: [
    { id: 'career', name: 'Career', icon: '&#128188;' },
    { id: 'business', name: 'Business', icon: '&#128200;' },
    { id: 'personal', name: 'Personal', icon: '&#129489;' },
    { id: 'education', name: 'Education', icon: '&#127891;' },
    { id: 'finance', name: 'Finance', icon: '&#128176;' }
  ],

  // Templates per tool
  tententen: [
    {
      id: 'career-change',
      category: 'career',
      name: 'Career Change',
      description: 'Thinking about switching careers or jobs',
      data: {
        decision: 'Accept the new job offer',
        tenMinutes: 6,
        tenMonths: 7,
        tenYears: 8
      }
    },
    {
      id: 'big-purchase',
      category: 'finance',
      name: 'Big Purchase',
      description: 'Making a significant purchase decision',
      data: {
        decision: 'Buy the new house/car',
        tenMinutes: 4,
        tenMonths: 6,
        tenYears: 7
      }
    },
    {
      id: 'relationship',
      category: 'personal',
      name: 'Relationship Decision',
      description: 'Major relationship choices',
      data: {
        decision: 'Move in together',
        tenMinutes: 5,
        tenMonths: 7,
        tenYears: 8
      }
    }
  ],

  regret: [
    {
      id: 'startup',
      category: 'business',
      name: 'Start a Business',
      description: 'Launching your own venture',
      data: {
        decision: 'Start my own business',
        futureAge: 80,
        regretNotDoing: 8,
        regretDoing: 3
      }
    },
    {
      id: 'education-path',
      category: 'education',
      name: 'Further Education',
      description: 'Going back to school',
      data: {
        decision: 'Get a Master\'s degree',
        futureAge: 70,
        regretNotDoing: 7,
        regretDoing: 4
      }
    },
    {
      id: 'relocation',
      category: 'personal',
      name: 'Move to New City',
      description: 'Relocating for opportunity',
      data: {
        decision: 'Move to a new city',
        futureAge: 75,
        regretNotDoing: 7,
        regretDoing: 4
      }
    }
  ],

  pmi: [
    {
      id: 'job-offer',
      category: 'career',
      name: 'Job Offer Analysis',
      description: 'Evaluate a job opportunity',
      data: {
        decision: 'Accept the job offer at Company X',
        plusItems: [
          { id: 1, text: 'Higher salary', weight: 8 },
          { id: 2, text: 'Better growth opportunities', weight: 7 },
          { id: 3, text: 'New skills to learn', weight: 6 }
        ],
        minusItems: [
          { id: 4, text: 'Longer commute', weight: 5 },
          { id: 5, text: 'Unknown company culture', weight: 4 }
        ],
        interestingItems: [
          { id: 6, text: 'Work from home policy unclear', weight: 3 }
        ],
        nextId: 7
      }
    },
    {
      id: 'product-launch',
      category: 'business',
      name: 'Product Launch',
      description: 'Launch a new product',
      data: {
        decision: 'Launch the new product line',
        plusItems: [
          { id: 1, text: 'Expand market share', weight: 8 },
          { id: 2, text: 'Diversify revenue', weight: 7 }
        ],
        minusItems: [
          { id: 3, text: 'High initial investment', weight: 6 },
          { id: 4, text: 'Resource strain on team', weight: 5 }
        ],
        interestingItems: [
          { id: 5, text: 'Competitor response unknown', weight: 4 }
        ],
        nextId: 6
      }
    }
  ],

  swot: [
    {
      id: 'business-venture',
      category: 'business',
      name: 'Business Venture',
      description: 'Analyze a new business opportunity',
      data: {
        decision: 'Launch an online store',
        strengths: [
          { id: 1, text: 'Strong product knowledge', weight: 8 },
          { id: 2, text: 'Existing customer base', weight: 7 }
        ],
        weaknesses: [
          { id: 3, text: 'Limited marketing budget', weight: 6 },
          { id: 4, text: 'No e-commerce experience', weight: 5 }
        ],
        opportunities: [
          { id: 5, text: 'Growing online market', weight: 8 },
          { id: 6, text: 'Low competition in niche', weight: 7 }
        ],
        threats: [
          { id: 7, text: 'Established competitors', weight: 6 },
          { id: 8, text: 'Economic uncertainty', weight: 5 }
        ],
        nextId: 9
      }
    },
    {
      id: 'career-pivot',
      category: 'career',
      name: 'Career Pivot',
      description: 'Strategic career change analysis',
      data: {
        decision: 'Switch to tech industry',
        strengths: [
          { id: 1, text: 'Analytical skills', weight: 7 },
          { id: 2, text: 'Fast learner', weight: 8 }
        ],
        weaknesses: [
          { id: 3, text: 'No formal tech education', weight: 6 },
          { id: 4, text: 'Limited network in tech', weight: 5 }
        ],
        opportunities: [
          { id: 5, text: 'High demand for tech roles', weight: 9 },
          { id: 6, text: 'Remote work options', weight: 7 }
        ],
        threats: [
          { id: 7, text: 'Age discrimination', weight: 4 },
          { id: 8, text: 'Rapid technology changes', weight: 5 }
        ],
        nextId: 9
      }
    }
  ],

  opportunityCost: [
    {
      id: 'side-project',
      category: 'personal',
      name: 'Side Project',
      description: 'Start a side project vs. free time',
      data: {
        decision: 'Start a side project',
        optionAName: 'Start the project',
        optionBName: 'Keep free time',
        gains: [
          { id: 1, text: 'New skills', weight: 8 },
          { id: 2, text: 'Potential income', weight: 7 },
          { id: 3, text: 'Portfolio building', weight: 6 }
        ],
        sacrifices: [
          { id: 4, text: 'Less leisure time', weight: 6 },
          { id: 5, text: 'Increased stress', weight: 5 }
        ],
        nextId: 6
      }
    },
    {
      id: 'investment',
      category: 'finance',
      name: 'Investment Decision',
      description: 'Invest vs. save the money',
      data: {
        decision: 'Invest in stocks',
        optionAName: 'Invest',
        optionBName: 'Keep in savings',
        gains: [
          { id: 1, text: 'Potential high returns', weight: 8 },
          { id: 2, text: 'Learn about investing', weight: 6 }
        ],
        sacrifices: [
          { id: 3, text: 'Risk of loss', weight: 7 },
          { id: 4, text: 'Less liquid funds', weight: 5 }
        ],
        nextId: 5
      }
    }
  ],

  coinFlip: [
    {
      id: 'vacation',
      category: 'personal',
      name: 'Vacation Choice',
      description: 'Beach vs. Mountains',
      data: {
        decision: 'Where to go on vacation',
        optionA: 'Beach vacation',
        optionB: 'Mountain retreat'
      }
    },
    {
      id: 'dinner',
      category: 'personal',
      name: 'Dinner Decision',
      description: 'Quick everyday choice',
      data: {
        decision: 'What to have for dinner',
        optionA: 'Cook at home',
        optionB: 'Order takeout'
      }
    }
  ],

  fearRegret: [
    {
      id: 'public-speaking',
      category: 'career',
      name: 'Public Speaking',
      description: 'Give a keynote speech',
      data: {
        decision: 'Give a keynote speech at the conference',
        fearsOfAction: [
          { id: 1, text: 'Embarrassing myself', intensity: 7 },
          { id: 2, text: 'Forgetting my lines', intensity: 6 },
          { id: 3, text: 'Technical difficulties', intensity: 4 }
        ],
        fearsOfInaction: [
          { id: 4, text: 'Missing career opportunity', intensity: 8 },
          { id: 5, text: 'Regret of not trying', intensity: 7 },
          { id: 6, text: 'Never building this skill', intensity: 6 }
        ],
        nextId: 7
      }
    },
    {
      id: 'entrepreneurship',
      category: 'business',
      name: 'Start a Business',
      description: 'Leave job to start business',
      data: {
        decision: 'Quit my job and start my own company',
        fearsOfAction: [
          { id: 1, text: 'Financial insecurity', intensity: 8 },
          { id: 2, text: 'Business failure', intensity: 7 },
          { id: 3, text: 'Letting family down', intensity: 6 }
        ],
        fearsOfInaction: [
          { id: 4, text: 'Living with "what if"', intensity: 9 },
          { id: 5, text: 'Never knowing my potential', intensity: 8 },
          { id: 6, text: 'Being stuck forever', intensity: 7 }
        ],
        nextId: 7
      }
    }
  ]
}

// Helper to get templates for a specific tool
export function getTemplatesForTool(toolId) {
  return templates[toolId] || []
}

// Helper to get all categories
export function getCategories() {
  return templates.categories
}

// Helper to get templates by category
export function getTemplatesByCategory(toolId, categoryId) {
  const toolTemplates = templates[toolId] || []
  if (!categoryId) return toolTemplates
  return toolTemplates.filter(t => t.category === categoryId)
}

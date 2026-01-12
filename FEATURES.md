# Features

Complete feature documentation for the Decision Support App.

## Decision Tools (8 Total)

### 1. De 3 P's (Featured)
**Route**: `/tools/3ps`
**Origin**: Dutch business framework
**Purpose**: Evaluate projects based on personal values

**How it works**:
1. Set baseline values (0-100) for: Poen (Money), Pret (Fun), Prestige (Status)
2. Rate how the project affects each P (0-100)
3. Score = sum of (baseline × project) for each P
4. Threshold: 6000 = Go, below = Consider alternatives

**Use when**: Evaluating business opportunities, side projects, job offers

---

### 2. 10-10-10 Rule
**Route**: `/tools/10-10-10`
**Origin**: Suzy Welch
**Purpose**: Consider time-based impact of decisions

**How it works**:
1. Describe decision and options
2. Rate feelings about Option A vs B at:
   - 10 minutes from now
   - 10 months from now
   - 10 years from now
3. Weighted score: 15% (10min) + 35% (10mo) + 50% (10yr)

**Use when**: Emotional decisions, big life changes, long-term planning

---

### 3. Regret Minimization Framework
**Route**: `/tools/regret`
**Origin**: Jeff Bezos
**Purpose**: Minimize future regret at age 80

**How it works**:
1. Describe the decision
2. Rate: regret if not done, reversibility, values alignment, age-80 perspective
3. Score: 40% regret + 15% reversibility + 25% values + 20% age80

**Use when**: Career pivots, taking risks, once-in-a-lifetime opportunities

---

### 4. PMI Analysis
**Route**: `/tools/pmi`
**Origin**: Edward de Bono
**Purpose**: Structured pros/cons with interesting factors

**How it works**:
1. Add Plus points (benefits)
2. Add Minus points (drawbacks)
3. Add Interesting points (neutral observations)
4. Score = Plus - Minus + (Interesting × 0.5)

**Use when**: Complex decisions, team discussions, brainstorming

---

### 5. SWOT Analysis
**Route**: `/tools/swot`
**Origin**: Business strategy
**Purpose**: Strategic situation analysis

**How it works**:
1. List Strengths (internal positive)
2. List Weaknesses (internal negative)
3. List Opportunities (external positive)
4. List Threats (external negative)
5. Score = Strengths + Opportunities - Weaknesses - Threats

**Use when**: Business planning, competitive analysis, personal development

---

### 6. Coin Flip Gut Check
**Route**: `/tools/coinflip`
**Purpose**: Reveal true preferences through reaction

**How it works**:
1. Define Option A and Option B
2. Flip the animated coin
3. Notice your gut reaction to the result
4. Choose based on emotional response, not coin

**Use when**: Stuck between two options, decision paralysis, need quick clarity

---

### 7. Fear/Regret Matrix
**Route**: `/tools/fear-regret`
**Purpose**: Map fears against potential regrets

**How it works**:
1. Describe the decision
2. Rate fear of taking action (0-100)
3. Rate regret if you don't act (0-100)
4. Matrix analysis: high regret + low fear = Act

**Use when**: Anxiety about decisions, risk assessment, courage building

---

### 8. Opportunity Cost Calculator
**Route**: `/tools/opportunity`
**Purpose**: Compare against best alternative

**How it works**:
1. Describe primary option
2. Describe best alternative (what you give up)
3. Rate value of each option
4. Calculate opportunity cost differential

**Use when**: Resource allocation, time management, investment decisions

---

## History & Tracking

### Decision History
**Route**: `/history`

**Features**:
- Save any tool result to history
- Filter by tool, outcome status, date
- Sort by newest, oldest, score
- Outcome tracking (rate past decisions)
- Free: 10 decisions | Premium: Unlimited

### Outcome Tracking
- Rate past decisions (1-5 stars)
- Add notes on what happened
- Build decision-making wisdom over time

---

## Insights Dashboard
**Route**: `/insights`
**Premium only**

**Analytics**:
- Total decisions count
- Outcomes tracked
- Average outcome score
- Decisions this month
- Tool usage chart
- Score distribution
- Pattern recognition
- Recent activity feed

---

## Compare Tool
**Route**: `/compare`

**Features**:
- Select 2-3 tools to compare
- Side-by-side feature comparison
- See which tool fits your situation

---

## Help Section
**Route**: `/help`

**Includes**:
- Interactive "Which tool should I use?" guide
- Expandable tool explanations
- Decision-making tips
- Best practices

---

## Premium Features

### Pricing
- **Monthly**: €5.99/month
- **Yearly**: €49.99/year (save 30%)

### What's Included

| Feature | Free | Premium |
|---------|------|---------|
| All 8 decision tools | ✓ | ✓ |
| Compare tools | ✓ | ✓ |
| Basic history (10) | ✓ | ✓ |
| Unlimited history | - | ✓ |
| Insights dashboard | - | ✓ |
| AI-powered advice | - | ✓ |
| PDF/JSON export | - | ✓ |
| Priority support | - | ✓ |

---

## AI Advice (Premium, Coming Soon)

### Summary Mode
After completing any tool analysis:
- Key insight from your analysis
- Potential blind spots
- Confidence assessment

### Guidance Mode
Interactive follow-up:
- Clarifying questions
- Alternative perspectives
- Action recommendations

---

## Additional Features

### Dark Mode
- System preference detection
- Manual toggle
- Persisted preference

### PWA Support
- Installable on mobile/desktop
- Offline-capable (future)
- App-like experience

### Export Options
- Copy to clipboard (free)
- PDF export (premium)
- JSON export (premium)

### i18n Foundation
- English (default)
- Dutch (partial)
- Extensible locale system

---

## Technical Features

### State Persistence
- LocalStorage for all tool states
- History saved locally
- Theme preference saved
- Subscription status cached

### Animations
- Smooth page transitions
- Staggered card animations
- Confetti on positive results
- Animated counters
- Coin flip physics

### Responsive Design
- Mobile-first approach
- Tablet-optimized layouts
- Desktop enhancements
- Touch-friendly controls

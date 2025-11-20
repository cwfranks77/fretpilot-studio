# Roadmap Prioritization Framework – FretPilot Studio & School

## Purpose
This framework guides decision-making for post-v1.0.0 feature development based on user feedback, technical feasibility, and strategic alignment with FretPilot's vision: **"Refine. Evolve. Own Your Craft."**

---

## Prioritization Criteria

### 1. User Impact (Weight: 40%)
**Score:** 1-5 (1 = niche, 5 = universally valuable)

**Evaluation questions:**
- How many users will benefit? (All users = 5, <10% = 1)
- Does it solve a top-3 reported pain point?
- Will it increase daily active usage?

**FretPilot examples:**
- Cloud sync (Score 5): All users benefit from cross-device progress
- Advanced ear training (Score 3): Subset of users (intermediate+)
- Multiplayer jam (Score 2): Social feature, not core practice tool

---

### 2. Technical Feasibility (Weight: 25%)
**Score:** 1-5 (1 = complex/risky, 5 = straightforward)

**Factors:**
- Development time (< 1 week = 5, > 1 month = 1)
- Dependencies on external services (Firebase, OpenAI API)
- Risk of introducing regressions
- Maintenance burden

**FretPilot examples:**
- Practice streak notifications (Score 5): Simple local notifications
- Real-time multiplayer jam (Score 1): WebRTC, server infrastructure, latency challenges
- Alternate tunings support (Score 4): UI expansion, minor pitch algorithm adjustments

---

### 3. Strategic Alignment (Weight: 20%)
**Score:** 1-5 (1 = off-brand, 5 = core mission)

**Alignment with pillars:**
- **Adaptive Intelligence:** AI-driven personalization
- **Precision Feedback:** Mistake tracking, performance metrics
- **Deliberate Practice:** Tools that enforce intentionality, not gamification
- **Craft Mastery:** Long-term skill development

**FretPilot examples:**
- AI lesson expansion (Score 5): Core adaptive intelligence
- Social sharing/leaderboards (Score 2): Gamification, less aligned with "own your craft"
- Guitar tone simulator (Score 1): Off-brand, not practice-focused

---

### 4. Business Value (Weight: 15%)
**Score:** 1-5 (1 = no monetization potential, 5 = premium feature driver)

**Considerations:**
- Does it unlock premium subscriptions?
- Does it increase retention (reduce churn)?
- Does it attract new users (viral/marketing potential)?

**FretPilot examples:**
- Cloud sync (Score 5): Premium feature, high retention impact
- Advanced analytics overlays (Score 4): Premium tier differentiator
- Dark mode (Score 2): Table stakes, not monetizable but expected

---

## Scoring Formula

**Total Score = (User Impact × 0.4) + (Technical Feasibility × 0.25) + (Strategic Alignment × 0.2) + (Business Value × 0.15)**

**Priority tiers:**
- **P0 (Critical):** Score ≥4.0 – Plan for next minor release (v1.1, v1.2)
- **P1 (High):** Score 3.0-3.9 – Plan for next major release (v2.0)
- **P2 (Medium):** Score 2.0-2.9 – Roadmap consideration (v2.1+)
- **P3 (Low):** Score <2.0 – Parking lot / future exploration

---

## Candidate Features (Post-v1.0.0)

### Feature 1: Cloud Sync (Cross-Device Progress)
**Description:** Sync practice data, heatmaps, and mastery metrics across devices via Firebase Firestore.

**Scoring:**
- User Impact: 5 (all users benefit, frequently requested)
- Technical Feasibility: 4 (Firebase integration straightforward, but auth + data migration adds complexity)
- Strategic Alignment: 4 (supports long-term craft mastery)
- Business Value: 5 (premium subscription driver)

**Total Score:** **4.55** → **P0 (Critical)**

**Implementation plan:**
- v1.1: Firebase Auth integration, basic data sync (practice sessions)
- v1.2: Full heatmap sync, conflict resolution

---

### Feature 2: Advanced Ear Training Module
**Description:** Interval recognition, chord quality drills, relative pitch exercises.

**Scoring:**
- User Impact: 3 (valuable for intermediate+ players, not beginners)
- Technical Feasibility: 3 (audio generation + recognition algorithm, moderate complexity)
- Strategic Alignment: 5 (core adaptive intelligence + precision feedback)
- Business Value: 4 (premium feature)

**Total Score:** **3.65** → **P1 (High)**

**Implementation plan:**
- v2.0: Interval recognition (2-12 semitones)
- v2.1: Chord quality drills (major, minor, diminished, augmented)

---

### Feature 3: Multiplayer Jam Session
**Description:** Real-time jam sessions with other users, synced metronome, shared backing tracks.

**Scoring:**
- User Impact: 2 (social feature, not core practice need)
- Technical Feasibility: 1 (WebRTC, server infrastructure, latency critical)
- Strategic Alignment: 2 (less aligned with "deliberate practice" focus)
- Business Value: 3 (viral potential but high infrastructure cost)

**Total Score:** **1.95** → **P3 (Low)**

**Implementation plan:**
- Parking lot – explore post-v3.0 if user demand increases

---

### Feature 4: Alternate Tunings Support
**Description:** Drop D, DADGAD, Open G, etc. tuning profiles in tuner + heatmap.

**Scoring:**
- User Impact: 4 (many players use alternate tunings)
- Technical Feasibility: 4 (UI expansion, pitch algorithm adjustments)
- Strategic Alignment: 4 (enhances precision feedback)
- Business Value: 2 (table stakes, not premium-exclusive)

**Total Score:** **3.6** → **P1 (High)**

**Implementation plan:**
- v1.3: Add 5-10 common tunings to tuner
- v2.0: Heatmap adapts to tuning-specific string layouts

---

### Feature 5: Practice Streak Notifications
**Description:** Local push notifications for practice reminders, streak milestones.

**Scoring:**
- User Impact: 4 (retention booster)
- Technical Feasibility: 5 (simple Android notifications)
- Strategic Alignment: 3 (useful but not core craft mastery)
- Business Value: 3 (retention = long-term revenue)

**Total Score:** **3.8** → **P1 (High)**

**Implementation plan:**
- v1.2: Daily practice reminder (user-configurable time)
- v1.3: Milestone notifications (7-day streak, 30-day streak)

---

### Feature 6: AI Lesson Expansion (Genre-Specific)
**Description:** Lessons tailored to blues, jazz, metal, fingerstyle genres.

**Scoring:**
- User Impact: 5 (all users benefit from personalized genres)
- Technical Feasibility: 3 (requires expanded lesson database + genre classification)
- Strategic Alignment: 5 (core adaptive intelligence)
- Business Value: 5 (premium tier differentiator)

**Total Score:** **4.55** → **P0 (Critical)**

**Implementation plan:**
- v1.2: Genre selector in AI Lesson Generator
- v1.3: Genre-specific technique libraries (e.g., blues bends, jazz voicings)

---

### Feature 7: Video Lesson Integration
**Description:** Embedded instructional videos from YouTube/Vimeo linked to lessons.

**Scoring:**
- User Impact: 4 (valuable learning supplement)
- Technical Feasibility: 4 (YouTube API integration straightforward)
- Strategic Alignment: 3 (less AI-driven, more content curation)
- Business Value: 3 (potential partnerships with instructors)

**Total Score:** **3.6** → **P1 (High)**

**Implementation plan:**
- v2.0: Curated video library per lesson category
- v2.1: AI recommends videos based on heatmap gaps

---

### Feature 8: Advanced Analytics Overlays (Performance Insights)
**Description:** Deeper metrics: consistency over time, weak-strong string analysis, tempo mastery curves.

**Scoring:**
- User Impact: 3 (power users, not casual players)
- Technical Feasibility: 4 (mostly data visualization, minimal backend changes)
- Strategic Alignment: 5 (precision feedback pillar)
- Business Value: 5 (premium feature)

**Total Score:** **4.05** → **P0 (Critical)**

**Implementation plan:**
- v1.3: String-level accuracy breakdown
- v1.4: Tempo mastery curve (shows tempo ramp-up over weeks)

---

### Feature 9: Offline Mode Enhancement (Full Lesson Library Cache)
**Description:** Pre-cache AI lesson database for fully offline operation.

**Scoring:**
- User Impact: 3 (valuable for users without consistent internet)
- Technical Feasibility: 4 (local storage + sync logic)
- Strategic Alignment: 3 (useful but not transformative)
- Business Value: 2 (table stakes, not premium-exclusive)

**Total Score:** **3.05** → **P1 (High)**

**Implementation plan:**
- v1.2: Cache last 50 generated lessons locally
- v1.3: Full lesson library (~500 lessons) pre-downloaded on Wi-Fi

---

### Feature 10: Social Sharing (Progress Posts)
**Description:** Share heatmaps, streak milestones, lesson completions to social media.

**Scoring:**
- User Impact: 2 (niche – some users want to share, most don't)
- Technical Feasibility: 5 (simple Share API integration)
- Strategic Alignment: 2 (gamification, not core craft mastery)
- Business Value: 3 (viral growth potential)

**Total Score:** **2.65** → **P2 (Medium)**

**Implementation plan:**
- v2.1: Share streak milestones to Twitter/Instagram
- v2.2: Share anonymized heatmaps with progress comparison

---

## Priority Roadmap Summary

### v1.1 (Planned Q1 2026)
- **P0:** Cloud sync (basic – practice sessions)
- **P0:** AI lesson expansion (genre selector)
- **P1:** Practice streak notifications

### v1.2 (Planned Q2 2026)
- **P0:** Cloud sync (full – heatmaps, conflicts)
- **P0:** Advanced analytics overlays (string-level accuracy)
- **P1:** Offline mode enhancement (lesson cache)

### v1.3 (Planned Q3 2026)
- **P1:** Alternate tunings support (tuner + heatmap)
- **P1:** Milestone notifications (streak achievements)

### v2.0 (Planned Q4 2026)
- **P1:** Advanced ear training module (interval recognition)
- **P1:** Video lesson integration (curated library)
- **P2:** Social sharing (opt-in progress posts)

### v2.1+ (2027)
- **P2:** Ear training expansion (chord quality drills)
- **P3:** Multiplayer jam session (if demand increases)

---

## Decision-Making Process

### When new feature idea arises:
1. **Score it:** Apply scoring framework (User Impact, Feasibility, Alignment, Business Value)
2. **Compare:** Rank against existing roadmap features
3. **Consult feedback:** Check Play Store reviews, tester survey responses for related pain points
4. **Prototype (if uncertain):** Build quick proof-of-concept to validate feasibility
5. **Communicate:** Share decision with team + testers (transparency builds trust)

### When to deprioritize:
- **Scope creep:** Feature complexity increases mid-development → push to next release
- **Low adoption:** If beta users don't engage with prototype → parking lot
- **Technical blockers:** External dependency unavailable (e.g., API deprecation) → defer

### When to fast-track:
- **Critical bug fix:** Security vulnerability, data loss risk → hotfix immediately
- **Competitive pressure:** Competitor launches similar feature with high adoption → accelerate
- **Tester consensus:** 80%+ of testers request same feature → bump to P0

---

## Feedback Integration

### Quarterly Review (After Each Release)
- Analyze top 5 feature requests from Play Store reviews
- Survey active users (Google Form): "What one feature would make FretPilot indispensable?"
- Score new ideas using framework
- Adjust roadmap priorities

### Continuous Feedback Loop
- Tag reviews in Play Console: "Feature Request – [Category]"
- Maintain Trello/Notion board: "Feature Ideas" → "Scored" → "Roadmap"
- Respond to high-value requests: "Great idea! We've added this to our roadmap for v1.3"

---

## Success Metrics (Per Feature)

### Cloud Sync (v1.1)
- **Adoption:** 60% of users enable sync within 30 days
- **Retention:** 15% increase in Day 30 retention

### AI Lesson Expansion (v1.1)
- **Engagement:** 40% of users try genre-specific lessons
- **Session duration:** 20% increase in avg session length

### Alternate Tunings (v1.3)
- **Adoption:** 30% of users enable alternate tunings
- **Feedback:** <5% 1-star reviews mentioning missing tunings

### Advanced Analytics (v1.3)
- **Premium conversion:** 10% of free users upgrade for analytics
- **Usage:** 50% of premium users engage with advanced metrics

---

**Status:** Prioritization framework established. Ready to score new feature ideas ✅

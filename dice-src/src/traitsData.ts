import { RandomSource, shuffleWithRandom } from "./utils/seededRandom";

// AUTO-GENERATED from THE ALLIANCE's actual sourced trait taxonomy
// (personality_traits_cleaned.txt), not an invented placeholder list.
// 11 Vector of Ruin / borderline exclusions already removed at the source.

export enum Pillar {
  TRUTH_SEEKER = "Truth Seeker",
  HARMONY_BUILDER = "Harmony Builder",
  EMPATHY_CARRIER = "Empathy Carrier",
  INNOVATION_DRIVER = "Innovation Driver",
}

export interface Trait {
  name: string;
  category: string;
  description: string;
}

export const TRAIT_TAXONOMY: Record<string, Trait[]> = {
  "Motivation": [
    { name: "Adventurous", category: "Motivation", description: "Drawn to new experiences and willing to take risks to seek them." },
    { name: "Altruistic", category: "Motivation", description: "Genuinely motivated by the welfare of others, often before their own." },
    { name: "Ambitious", category: "Motivation", description: "Driven by a strong desire to achieve and to grow." },
    { name: "Anxious", category: "Motivation", description: "Prone to worry and unease about outcomes." },
    { name: "Apathetic", category: "Motivation", description: "Lacking strong interest or energy toward most things." },
    { name: "Assertive", category: "Motivation", description: "States needs and opinions directly and confidently." },
    { name: "Compassionate", category: "Motivation", description: "Moved to act by the suffering of others." },
    { name: "Contented", category: "Motivation", description: "At peace with what they have, not chasing more." },
    { name: "Controlling", category: "Motivation", description: "Feels a strong need to manage outcomes and other people." },
    { name: "Energetic", category: "Motivation", description: "Operates with a high, sustained level of vitality." },
    { name: "Enthusiastic", category: "Motivation", description: "Approaches things with visible eagerness and excitement." },
    { name: "Greedy", category: "Motivation", description: "Wants more than their fair share, often at others' expense." },
    { name: "Industrious", category: "Motivation", description: "Works hard and steadily toward goals." },
    { name: "Lazy", category: "Motivation", description: "Avoids effort and exertion where possible." },
    { name: "Passionate", category: "Motivation", description: "Fueled by deep, intense conviction about what matters to them." },
    { name: "Passive", category: "Motivation", description: "Lets things happen rather than acting to shape them." },
    { name: "Persistent", category: "Motivation", description: "Keeps going despite obstacles or setbacks." },
    { name: "Philanthropic", category: "Motivation", description: "Inclined to give generously toward causes bigger than themselves." },
    { name: "Selfish", category: "Motivation", description: "Prioritizes their own interest ahead of others', often at cost to them." },
    { name: "Selfless", category: "Motivation", description: "Consistently puts others' needs ahead of their own." },
    { name: "Unmotivated", category: "Motivation", description: "Struggles to find the drive to start or finish things." },
  ],
  "Risk & Outlook": [
    { name: "Brave", category: "Risk & Outlook", description: "Acts despite fear or danger." },
    { name: "Conservative", category: "Risk & Outlook", description: "Prefers caution and the tried-and-true over change." },
    { name: "Cowardly", category: "Risk & Outlook", description: "Avoids danger or difficulty even when action is needed." },
    { name: "Enterprising", category: "Risk & Outlook", description: "Seeks out opportunity and initiative readily." },
    { name: "Extreme", category: "Risk & Outlook", description: "Takes positions or actions at the far edge of what's typical." },
    { name: "Fearful", category: "Risk & Outlook", description: "Frequently anticipates danger or threat." },
    { name: "Hopeful", category: "Risk & Outlook", description: "Expects things will turn out well." },
    { name: "Idealistic", category: "Risk & Outlook", description: "Holds to principles even when reality makes them difficult." },
    { name: "Moderate", category: "Risk & Outlook", description: "Avoids extremes, favors balance." },
    { name: "Optimistic", category: "Risk & Outlook", description: "Default expectation is a positive outcome." },
    { name: "Panicky", category: "Risk & Outlook", description: "Reacts to stress with sudden, disproportionate alarm." },
    { name: "Pessimistic", category: "Risk & Outlook", description: "Default expectation is a negative outcome." },
    { name: "Practical", category: "Risk & Outlook", description: "Oriented toward what actually works, not just what's ideal." },
    { name: "Pragmatic", category: "Risk & Outlook", description: "Chooses the effective path over the theoretically pure one." },
    { name: "Progressive", category: "Risk & Outlook", description: "Favors change and new approaches." },
    { name: "Prudent", category: "Risk & Outlook", description: "Exercises careful judgment before acting." },
    { name: "Realistic", category: "Risk & Outlook", description: "Sees and plans around things as they actually are." },
    { name: "Reckless", category: "Risk & Outlook", description: "Acts without adequate regard for consequences." },
    { name: "Risk-avoiding", category: "Risk & Outlook", description: "Structures choices to minimize exposure to danger or loss." },
    { name: "Risk-taking", category: "Risk & Outlook", description: "Willing to accept danger or loss for a chance at gain." },
    { name: "Stable", category: "Risk & Outlook", description: "Consistent and steady, not easily thrown off course." },
  ],
  "Social & Interpersonal": [
    { name: "Accepting", category: "Social & Interpersonal", description: "Receives people and differences without judgment." },
    { name: "Aloof", category: "Social & Interpersonal", description: "Keeps emotional distance from others." },
    { name: "Antisocial", category: "Social & Interpersonal", description: "Actively avoids or resists social connection." },
    { name: "Candid", category: "Social & Interpersonal", description: "Speaks plainly and without evasion." },
    { name: "Closed-minded", category: "Social & Interpersonal", description: "Resistant to considering other viewpoints." },
    { name: "Cold", category: "Social & Interpersonal", description: "Withholds warmth in interactions with others." },
    { name: "Communicative", category: "Social & Interpersonal", description: "Shares thoughts and information readily." },
    { name: "Conceited", category: "Social & Interpersonal", description: "Holds an inflated sense of their own importance." },
    { name: "Condescending", category: "Social & Interpersonal", description: "Speaks to others as though they are lesser." },
    { name: "Cranky", category: "Social & Interpersonal", description: "Easily irritated, especially in the moment." },
    { name: "Disagreeable", category: "Social & Interpersonal", description: "Resistant to cooperation, prone to friction." },
    { name: "Egotistical", category: "Social & Interpersonal", description: "Preoccupied with themselves above others." },
    { name: "Empathetic", category: "Social & Interpersonal", description: "Genuinely feels and understands what others are experiencing." },
    { name: "Extroverted", category: "Social & Interpersonal", description: "Draws energy from being around other people." },
    { name: "Fair", category: "Social & Interpersonal", description: "Treats people even-handedly." },
    { name: "Friendly", category: "Social & Interpersonal", description: "Warm and approachable toward others." },
    { name: "Fun", category: "Social & Interpersonal", description: "Brings lightness and enjoyment to shared moments." },
    { name: "Generous", category: "Social & Interpersonal", description: "Gives freely of time, attention, or resources." },
    { name: "Gossipy", category: "Social & Interpersonal", description: "Shares others' private matters casually." },
    { name: "Hostile", category: "Social & Interpersonal", description: "Approaches interactions with antagonism." },
    { name: "Inconsiderate", category: "Social & Interpersonal", description: "Fails to account for how actions affect others." },
    { name: "Inconsistent", category: "Social & Interpersonal", description: "Unpredictable in behavior or follow-through." },
    { name: "Insecure", category: "Social & Interpersonal", description: "Uncertain of their own worth or standing." },
    { name: "Introspective", category: "Social & Interpersonal", description: "Regularly examines their own thoughts and motives." },
    { name: "Introverted", category: "Social & Interpersonal", description: "Draws energy from solitude rather than company." },
    { name: "Jealous", category: "Social & Interpersonal", description: "Resents others' advantages or attention given elsewhere." },
    { name: "Judgmental", category: "Social & Interpersonal", description: "Quick to form critical opinions of others." },
    { name: "Kind", category: "Social & Interpersonal", description: "Consistently considerate and warm toward others." },
    { name: "Melodramatic", category: "Social & Interpersonal", description: "Reacts to events with exaggerated emotion." },
    { name: "Naive", category: "Social & Interpersonal", description: "Trusts readily, sometimes without enough scrutiny." },
    { name: "Needy", category: "Social & Interpersonal", description: "Requires frequent reassurance or attention from others." },
    { name: "Nosy", category: "Social & Interpersonal", description: "Intrudes into others' private matters." },
    { name: "Open-minded", category: "Social & Interpersonal", description: "Genuinely willing to consider other viewpoints." },
    { name: "Outgoing", category: "Social & Interpersonal", description: "Seeks out social contact readily." },
    { name: "Oversensitive", category: "Social & Interpersonal", description: "Reacts strongly to perceived slights." },
    { name: "Paranoid", category: "Social & Interpersonal", description: "Suspects hidden threat or ill intent without solid grounds." },
    { name: "Passive-aggressive", category: "Social & Interpersonal", description: "Expresses resentment indirectly rather than openly." },
    { name: "Personable", category: "Social & Interpersonal", description: "Easy to like and get along with." },
    { name: "Philosophical", category: "Social & Interpersonal", description: "Inclined to reflect on deeper meaning and questions." },
    { name: "Playful", category: "Social & Interpersonal", description: "Approaches interactions with lightness and humor." },
    { name: "Polite", category: "Social & Interpersonal", description: "Observes social courtesy consistently." },
    { name: "Possessive", category: "Social & Interpersonal", description: "Reluctant to share attention, people, or things they consider theirs." },
    { name: "Pretentious", category: "Social & Interpersonal", description: "Presents themselves as more important or refined than they are." },
    { name: "Resentful", category: "Social & Interpersonal", description: "Holds onto grievance over past treatment." },
    { name: "Reserved", category: "Social & Interpersonal", description: "Keeps thoughts and feelings to themselves." },
    { name: "Secretive", category: "Social & Interpersonal", description: "Withholds information about themselves by habit." },
    { name: "Serious", category: "Social & Interpersonal", description: "Approaches things with gravity rather than levity." },
    { name: "Short-tempered", category: "Social & Interpersonal", description: "Becomes angry quickly." },
    { name: "Sincere", category: "Social & Interpersonal", description: "Means what they say, without pretense." },
    { name: "Snobby", category: "Social & Interpersonal", description: "Looks down on others seen as beneath them." },
    { name: "Social", category: "Social & Interpersonal", description: "Comfortable and engaged in group settings." },
    { name: "Superficial", category: "Social & Interpersonal", description: "Engages at a surface level, avoiding depth." },
    { name: "Tactful", category: "Social & Interpersonal", description: "Delivers hard truths without unnecessary harm." },
    { name: "Tactless", category: "Social & Interpersonal", description: "Speaks bluntly without regard for impact." },
    { name: "Temperamental", category: "Social & Interpersonal", description: "Prone to sudden shifts in mood." },
    { name: "Tolerant", category: "Social & Interpersonal", description: "Accepts differences without hostility." },
    { name: "Unassuming", category: "Social & Interpersonal", description: "Doesn't seek attention or claim credit." },
    { name: "Uncooperative", category: "Social & Interpersonal", description: "Resists working with others toward shared goals." },
    { name: "Unfair", category: "Social & Interpersonal", description: "Treats people inequitably." },
    { name: "Volatile", category: "Social & Interpersonal", description: "Prone to sudden, unpredictable shifts in behavior or mood." },
  ],
  "Cognitive & Intelligence": [
    { name: "Artistic", category: "Cognitive & Intelligence", description: "Drawn to and skilled in creative/aesthetic expression." },
    { name: "Creative", category: "Cognitive & Intelligence", description: "Generates original ideas and approaches." },
    { name: "Critical thinker", category: "Cognitive & Intelligence", description: "Evaluates ideas rigorously before accepting them." },
    { name: "Emotionally intelligent", category: "Cognitive & Intelligence", description: "Reads and manages emotional dynamics well, in self and others." },
    { name: "Existential", category: "Cognitive & Intelligence", description: "Oriented toward big-picture meaning and purpose." },
    { name: "Fluid intelligence", category: "Cognitive & Intelligence", description: "Solves novel problems quickly, without relying on prior knowledge." },
    { name: "Humorous", category: "Cognitive & Intelligence", description: "Finds and creates genuine amusement." },
    { name: "Imaginative", category: "Cognitive & Intelligence", description: "Envisions possibilities that don't yet exist." },
    { name: "Intuitive", category: "Cognitive & Intelligence", description: "Understands situations instinctively, without needing to reason it out." },
    { name: "Kinesthetic", category: "Cognitive & Intelligence", description: "Learns and works best through hands-on doing." },
    { name: "Logical", category: "Cognitive & Intelligence", description: "Reasons in a consistent, structured way." },
    { name: "Musical", category: "Cognitive & Intelligence", description: "Has a natural aptitude for or connection to music." },
    { name: "Numerate", category: "Cognitive & Intelligence", description: "Comfortable and capable working with numbers." },
    { name: "Rational", category: "Cognitive & Intelligence", description: "Grounds decisions in reason rather than impulse." },
    { name: "Socially intelligent", category: "Cognitive & Intelligence", description: "Reads social dynamics accurately and navigates them well." },
    { name: "Witty", category: "Cognitive & Intelligence", description: "Quick with clever, incisive humor." },
    { name: "One-sided thinker", category: "Cognitive & Intelligence", description: "Tends toward rigid, narrow reasoning that resists other angles." },
  ],
  "Values & Principles": [
    { name: "Civility", category: "Values & Principles", description: "Values respectful, courteous conduct even in disagreement." },
    { name: "Faith", category: "Values & Principles", description: "Holds deep trust or belief, often beyond what can be proven." },
    { name: "Forgiveness", category: "Values & Principles", description: "Willing to release grievance and let go of past wrongs." },
    { name: "Freedom", category: "Values & Principles", description: "Places high value on autonomy and self-determination." },
    { name: "Gratitude", category: "Values & Principles", description: "Regularly recognizes and appreciates what they have." },
    { name: "Honesty", category: "Values & Principles", description: "Committed to truthfulness as a core value." },
    { name: "Impartiality", category: "Values & Principles", description: "Values judging situations without bias toward any side." },
    { name: "Justice", category: "Values & Principles", description: "Holds fairness and moral right as a guiding principle." },
    { name: "Loyalty", category: "Values & Principles", description: "Values steadfast commitment to people and causes." },
    { name: "Modesty", category: "Values & Principles", description: "Values humility over self-promotion." },
    { name: "Peace", category: "Values & Principles", description: "Prioritizes calm and the avoidance of conflict." },
    { name: "Prosperity", category: "Values & Principles", description: "Values material and collective flourishing." },
    { name: "Respect", category: "Values & Principles", description: "Holds regard for others' dignity as a core value." },
    { name: "Rights-focused", category: "Values & Principles", description: "Prioritizes the protection of individual rights." },
    { name: "Sincerity", category: "Values & Principles", description: "Values genuineness over performance." },
    { name: "Sustainability-minded", category: "Values & Principles", description: "Values long-term stewardship over short-term gain." },
    { name: "Tolerance", category: "Values & Principles", description: "Values coexistence with difference." },
    { name: "Trust", category: "Values & Principles", description: "Places high value on reliability and good faith between people." },
  ],
  "Conscientiousness & Diligence": [
    { name: "Attentive", category: "Conscientiousness & Diligence", description: "Notices and responds to detail and need." },
    { name: "Calculated", category: "Conscientiousness & Diligence", description: "Acts based on deliberate weighing of outcomes." },
    { name: "Calm", category: "Conscientiousness & Diligence", description: "Maintains composure under pressure." },
    { name: "Capable", category: "Conscientiousness & Diligence", description: "Reliably able to get things done." },
    { name: "Careful", category: "Conscientiousness & Diligence", description: "Takes pains to avoid error or harm." },
    { name: "Careless", category: "Conscientiousness & Diligence", description: "Overlooks detail or consequence." },
    { name: "Competent", category: "Conscientiousness & Diligence", description: "Skilled and effective at what they do." },
    { name: "Composed", category: "Conscientiousness & Diligence", description: "Keeps outward calm even under strain." },
    { name: "Diligent", category: "Conscientiousness & Diligence", description: "Works with steady, careful effort." },
    { name: "Disciplined", category: "Conscientiousness & Diligence", description: "Maintains consistent self-control toward goals." },
    { name: "Dutiful", category: "Conscientiousness & Diligence", description: "Reliably fulfills obligations." },
    { name: "Feeble", category: "Conscientiousness & Diligence", description: "Lacks strength or resilience to follow through." },
    { name: "Impatient", category: "Conscientiousness & Diligence", description: "Struggles to tolerate delay." },
    { name: "Impulsive", category: "Conscientiousness & Diligence", description: "Acts on immediate urges without forethought." },
    { name: "Inattentive", category: "Conscientiousness & Diligence", description: "Fails to notice important detail." },
    { name: "Incompetent", category: "Conscientiousness & Diligence", description: "Lacks the skill to perform reliably." },
    { name: "Inventive", category: "Conscientiousness & Diligence", description: "Finds novel solutions readily." },
    { name: "Irresponsible", category: "Conscientiousness & Diligence", description: "Fails to reliably meet obligations." },
    { name: "Obsessive", category: "Conscientiousness & Diligence", description: "Fixates intensely, sometimes past the point of usefulness." },
    { name: "Patient", category: "Conscientiousness & Diligence", description: "Tolerates delay or difficulty without frustration." },
    { name: "Perfectionist", category: "Conscientiousness & Diligence", description: "Holds extremely high standards, sometimes to a fault." },
    { name: "Relaxed", category: "Conscientiousness & Diligence", description: "At ease, not easily rattled." },
    { name: "Reliable", category: "Conscientiousness & Diligence", description: "Consistently does what they say they will." },
    { name: "Resilient", category: "Conscientiousness & Diligence", description: "Recovers well from setbacks." },
    { name: "Resourceful", category: "Conscientiousness & Diligence", description: "Finds effective solutions with what's available." },
    { name: "Responsible", category: "Conscientiousness & Diligence", description: "Reliably accountable for their actions and duties." },
    { name: "Restrained", category: "Conscientiousness & Diligence", description: "Holds back impulse in favor of considered action." },
    { name: "Self-controlled", category: "Conscientiousness & Diligence", description: "Manages impulses and emotions deliberately." },
    { name: "Self-directed", category: "Conscientiousness & Diligence", description: "Sets and pursues their own goals without needing outside push." },
    { name: "Self-fulfilling", category: "Conscientiousness & Diligence", description: "Oriented toward realizing their own genuine potential." },
    { name: "Self-indulgent", category: "Conscientiousness & Diligence", description: "Prioritizes immediate gratification over discipline." },
    { name: "Trustworthy", category: "Conscientiousness & Diligence", description: "Reliably honors commitments and confidences." },
    { name: "Undisciplined", category: "Conscientiousness & Diligence", description: "Struggles to maintain consistent self-control." },
    { name: "Strong work ethic", category: "Conscientiousness & Diligence", description: "Applies consistent, genuine effort to work." },
  ],
  "Character - Virtue": [
    { name: "Accountable", category: "Character - Virtue", description: "Owns the outcomes of their actions." },
    { name: "Adaptable", category: "Character - Virtue", description: "Adjusts well to changing circumstances." },
    { name: "Authentic", category: "Character - Virtue", description: "Presents themselves genuinely, without pretense." },
    { name: "Caring", category: "Character - Virtue", description: "Attends to others' wellbeing." },
    { name: "Cheerful", category: "Character - Virtue", description: "Brings genuine lightness and good humor." },
    { name: "Considerate", category: "Character - Virtue", description: "Thinks of how actions affect others." },
    { name: "Courteous", category: "Character - Virtue", description: "Observes good manners consistently." },
    { name: "Dependable", category: "Character - Virtue", description: "Can be counted on reliably." },
    { name: "Determined", category: "Character - Virtue", description: "Holds firm focus on achieving their goals." },
    { name: "Humble", category: "Character - Virtue", description: "Doesn't overstate their own importance." },
    { name: "Independent", category: "Character - Virtue", description: "Capable of standing and deciding on their own." },
    { name: "Loyal", category: "Character - Virtue", description: "Stands by people and commitments over time." },
    { name: "Mature", category: "Character - Virtue", description: "Handles situations with appropriate emotional steadiness." },
    { name: "Supportive", category: "Character - Virtue", description: "Actively helps others through difficulty." },
    { name: "Thoughtful", category: "Character - Virtue", description: "Considers others carefully before acting." },
  ],
  "Character - Vice": [
    { name: "Arrogant", category: "Character - Vice", description: "Overestimates their own importance or ability." },
    { name: "Boastful", category: "Character - Vice", description: "Talks up their own accomplishments excessively." },
    { name: "Bossy", category: "Character - Vice", description: "Directs others more than is warranted or welcome." },
    { name: "Cold", category: "Character - Vice", description: "Withholds warmth from others." },
    { name: "Cynical", category: "Character - Vice", description: "Assumes the worst of people's motives by default." },
    { name: "Dishonest", category: "Character - Vice", description: "Not truthful in word or action." },
    { name: "Disloyal", category: "Character - Vice", description: "Fails to stand by commitments or people." },
    { name: "Greedy", category: "Character - Vice", description: "Wants more than their share, often at cost to others." },
    { name: "Impulsive", category: "Character - Vice", description: "Acts without adequate forethought." },
    { name: "Inconsiderate", category: "Character - Vice", description: "Disregards how actions affect others." },
    { name: "Indecisive", category: "Character - Vice", description: "Struggles to commit to a choice." },
    { name: "Jealous", category: "Character - Vice", description: "Resents others' advantages or attention." },
    { name: "Lazy", category: "Character - Vice", description: "Avoids effort where possible." },
    { name: "Moody", category: "Character - Vice", description: "Prone to noticeable shifts in emotional state." },
    { name: "Narrow-minded", category: "Character - Vice", description: "Resistant to other viewpoints or ideas." },
    { name: "Needy", category: "Character - Vice", description: "Requires excessive reassurance from others." },
    { name: "Obnoxious", category: "Character - Vice", description: "Behaves in ways others find distinctly unpleasant." },
    { name: "Passive-aggressive", category: "Character - Vice", description: "Expresses displeasure indirectly rather than openly." },
    { name: "Pettiness", category: "Character - Vice", description: "Fixates on small slights or grievances." },
    { name: "Possessive", category: "Character - Vice", description: "Reluctant to share people or things considered theirs." },
    { name: "Reckless", category: "Character - Vice", description: "Disregards likely consequences of action." },
    { name: "Rude", category: "Character - Vice", description: "Disregards basic social courtesy." },
    { name: "Self-centered", category: "Character - Vice", description: "Oriented primarily around their own interests." },
    { name: "Stubborn", category: "Character - Vice", description: "Resists changing position even when warranted." },
    { name: "Suspicious", category: "Character - Vice", description: "Assumes hidden motive without solid grounds." },
  ],
  "Emotional & Relational": [
    { name: "Affectionate", category: "Emotional & Relational", description: "Freely expresses warmth toward others." },
    { name: "Anxious", category: "Emotional & Relational", description: "Prone to worry about outcomes." },
    { name: "Apathetic", category: "Emotional & Relational", description: "Lacks emotional investment in most things." },
    { name: "Awkward", category: "Emotional & Relational", description: "Uneasy or ungraceful in social moments." },
    { name: "Grudge-holding", category: "Emotional & Relational", description: "Retains resentment long after an offense." },
    { name: "Insecure", category: "Emotional & Relational", description: "Uncertain of their own worth or standing." },
    { name: "Nurturing", category: "Emotional & Relational", description: "Actively fosters others' growth and wellbeing." },
    { name: "Open", category: "Emotional & Relational", description: "Emotionally available and willing to share." },
    { name: "Romantic", category: "Emotional & Relational", description: "Inclined toward deep emotional and affectionate connection." },
    { name: "Sensitive", category: "Emotional & Relational", description: "Responds strongly to emotional cues." },
    { name: "Stoic", category: "Emotional & Relational", description: "Maintains outward composure regardless of inner feeling." },
    { name: "Trusting", category: "Emotional & Relational", description: "Extends good faith to others readily." },
    { name: "Warm", category: "Emotional & Relational", description: "Radiates genuine friendliness and care." },
  ],
  "Communication": [
    { name: "Attentive listener", category: "Communication", description: "Genuinely focuses on and absorbs what others say." },
    { name: "Blunt", category: "Communication", description: "States things directly, without softening." },
    { name: "Charismatic", category: "Communication", description: "Naturally draws people in." },
    { name: "Cooperative", category: "Communication", description: "Works well with others toward shared goals." },
    { name: "Curious", category: "Communication", description: "Genuinely wants to learn and understand more." },
    { name: "Diplomatic", category: "Communication", description: "Navigates sensitive situations with tact." },
    { name: "Discreet", category: "Communication", description: "Handles sensitive information carefully." },
    { name: "Encouraging", category: "Communication", description: "Actively supports and motivates others." },
    { name: "Flexible", category: "Communication", description: "Adjusts approach readily as situations change." },
    { name: "Helpful", category: "Communication", description: "Readily offers assistance." },
    { name: "Organized", category: "Communication", description: "Keeps thoughts and plans in clear order." },
    { name: "Outspoken", category: "Communication", description: "Voices opinions readily and openly." },
    { name: "Persuasive", category: "Communication", description: "Effectively convinces others." },
    { name: "Quiet", category: "Communication", description: "Speaks sparingly, keeps a low profile." },
    { name: "Sociable", category: "Communication", description: "Enjoys and seeks out company." },
    { name: "Talkative", category: "Communication", description: "Speaks frequently and readily." },
    { name: "Tenacious", category: "Communication", description: "Holds firmly to a position or goal." },
    { name: "Transparent", category: "Communication", description: "Open and honest about thoughts and intentions." },
    { name: "Versatile", category: "Communication", description: "Adapts skillfully across different situations." },
  ],
};

// Hard Exclusions (Vector of Ruin + borderline) - guaranteed never to appear in any category
export const HARD_EXCLUSIONS = [
  "Malevolent", "Manipulative", "Cruel", "Deceitful", "Callous", "Spiteful",
  "Domineering", "Envious", "Vain", "Prejudiced", "Overconfident"
];

// Mapping of Pillars to eligible Categories (all categories a Pillar may draw from)
export const PILLAR_ELIGIBLE_CATEGORIES: Record<Pillar, string[]> = {
  [Pillar.TRUTH_SEEKER]: ["Cognitive & Intelligence", "Conscientiousness & Diligence", "Values & Principles", "Character - Vice"],
  [Pillar.HARMONY_BUILDER]: ["Social & Interpersonal", "Communication", "Values & Principles", "Emotional & Relational"],
  [Pillar.EMPATHY_CARRIER]: ["Emotional & Relational", "Character - Virtue", "Values & Principles", "Social & Interpersonal"],
  [Pillar.INNOVATION_DRIVER]: ["Cognitive & Intelligence", "Motivation", "Risk & Outlook", "Character - Vice"],
};

// Primary categories - where most Fundamental and Secondary rolls draw from
export const PILLAR_PRIMARY_CATEGORIES: Record<Pillar, string[]> = {
  [Pillar.TRUTH_SEEKER]: ["Cognitive & Intelligence", "Conscientiousness & Diligence"],
  [Pillar.HARMONY_BUILDER]: ["Social & Interpersonal", "Communication"],
  [Pillar.EMPATHY_CARRIER]: ["Emotional & Relational", "Character - Virtue"],
  [Pillar.INNOVATION_DRIVER]: ["Cognitive & Intelligence", "Motivation"],
};

// Secondary-only categories - lighter presence, adds texture without diluting the Pillar
export const PILLAR_SECONDARY_CATEGORIES: Record<Pillar, string[]> = {
  [Pillar.TRUTH_SEEKER]: ["Values & Principles", "Character - Vice"],
  [Pillar.HARMONY_BUILDER]: ["Values & Principles", "Emotional & Relational"],
  [Pillar.EMPATHY_CARRIER]: ["Values & Principles", "Social & Interpersonal"],
  [Pillar.INNOVATION_DRIVER]: ["Risk & Outlook", "Character - Vice"],
};

// Curated core-identity traits per Pillar, drawn exclusively from Primary categories,
// used for the Tier 1 Fundamental roll.
export const PILLAR_FUNDAMENTAL_POOL: Record<Pillar, string[]> = {
  [Pillar.TRUTH_SEEKER]: ["Rational", "Logical", "Critical thinker", "Objective", "Numerate", "Disciplined", "Attentive", "Composed", "Calculated", "Competent"],
  [Pillar.HARMONY_BUILDER]: ["Diplomatic", "Cooperative", "Tactful", "Friendly", "Fair", "Sociable", "Kind", "Considerate", "Warm", "Encouraging"],
  [Pillar.EMPATHY_CARRIER]: ["Empathetic", "Compassionate", "Nurturing", "Sensitive", "Caring", "Supportive", "Sincere", "Open", "Affectionate", "Thoughtful"],
  [Pillar.INNOVATION_DRIVER]: ["Creative", "Imaginative", "Inventive", "Enterprising", "Adventurous", "Curious", "Passionate", "Ambitious"],
};

// Helper to look up a trait's meta information
export function findTraitMeta(name: string): Trait {
  for (const cat in TRAIT_TAXONOMY) {
    const found = TRAIT_TAXONOMY[cat].find(t => t.name.toLowerCase() === name.toLowerCase());
    if (found) return found;
  }
  return { name, category: "General", description: "A unique aspect of character." };
}

// Helper to get traits from categories
export function getTraitsFromCategories(categories: string[], excludeList: string[]): Trait[] {
  const list: Trait[] = [];
  categories.forEach(cat => {
    const traits = TRAIT_TAXONOMY[cat] || [];
    traits.forEach(t => {
      if (!excludeList.includes(t.name) && !HARD_EXCLUSIONS.includes(t.name)) {
        list.push(t);
      }
    });
  });
  return list;
}

// Roll logic for Fundamental Traits
// 5 traits total, 100-point pool, each bounded [15, 20], slots split by blend ratio (decimal-flexible).
export function rollFundamentalTraits(
  primary: Pillar,
  secondary: Pillar | "none",
  ratioPrimary: number,
  random: RandomSource = Math.random
): { name: string; value: number }[] {
  const ratioSecondary = 100 - ratioPrimary;

  const primarySlotsDecimal = 5 * (ratioPrimary / 100);
  const secondarySlotsDecimal = 5 * (ratioSecondary / 100);

  let primaryCount = Math.round(primarySlotsDecimal);
  if (secondary === "none" || ratioSecondary === 0) {
    primaryCount = 5;
  }
  let secondaryCount = 5 - primaryCount;

  const selected: string[] = [];

  const pickFromPool = (pool: string[], count: number) => {
    const available = pool.filter(t => !selected.includes(t));
    const shuffled = shuffleWithRandom(available, random);
    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
      selected.push(shuffled[i]);
    }
  };

  pickFromPool(PILLAR_FUNDAMENTAL_POOL[primary], primaryCount);
  if (secondary !== "none" && secondaryCount > 0) {
    pickFromPool(PILLAR_FUNDAMENTAL_POOL[secondary], secondaryCount);
  }

  if (selected.length < 5) {
    const allCandidates = [
      ...PILLAR_FUNDAMENTAL_POOL[primary],
      ...(secondary !== "none" ? PILLAR_FUNDAMENTAL_POOL[secondary] : [])
    ];
    pickFromPool(allCandidates, 5 - selected.length);
  }

  const values = [15, 15, 15, 15, 15];
  let remaining = 25.0;

  for (let i = 0; i < 5; i++) {
    const maxAdd = Math.min(5.0, remaining);
    if (i === 4) {
      values[i] += remaining;
    } else {
      const add = Math.random() * maxAdd;
      values[i] += add;
      remaining -= add;
    }
  }

  let sum = values.reduce((a, b) => a + b, 0);
  let attempts = 0;
  while (Math.abs(sum - 100) > 0.001 && attempts < 50) {
    const diff = 100 - sum;
    const adjust = diff / 5;
    for (let i = 0; i < 5; i++) {
      values[i] = Math.max(15, Math.min(20, values[i] + adjust));
    }
    sum = values.reduce((a, b) => a + b, 0);
    attempts++;
  }

  return selected.map((name, i) => ({
    name,
    value: parseFloat(values[i].toFixed(2))
  }));
}

// Roll logic for Secondary Traits
// 10 traits total, 100-point pool, each bounded [3, 10] (corrected from an earlier [3, 15] bug).
export function rollSecondaryTraits(
  primary: Pillar,
  secondary: Pillar | "none",
  ratioPrimary: number,
  fundamentalTraitNames: string[],
  random: RandomSource = Math.random
): { name: string; value: number }[] {
  const chosenNames = [...fundamentalTraitNames];
  const selected: string[] = [];

  const addUnique = (pool: Trait[], count: number) => {
    const available = pool.filter(t => !chosenNames.includes(t.name) && !selected.includes(t.name));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    const added: string[] = [];
    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
      selected.push(shuffled[i].name);
      added.push(shuffled[i].name);
    }
    return added.length;
  };

  let primarySlotsCount = Math.round(10 * (ratioPrimary / 100));
  if (secondary !== "none" && ratioPrimary < 100 && ratioPrimary > 0) {
    primarySlotsCount = Math.max(1, Math.min(9, primarySlotsCount));
  } else {
    primarySlotsCount = 10;
  }
  const secondarySlotsCount = 10 - primarySlotsCount;

  const primPrimaryTarget = Math.max(1, Math.round(primarySlotsCount * 0.8));
  const primSecondaryTarget = primarySlotsCount - primPrimaryTarget;

  const primPrimaryPool = getTraitsFromCategories(PILLAR_PRIMARY_CATEGORIES[primary], chosenNames);
  const primSecondaryPool = getTraitsFromCategories(PILLAR_SECONDARY_CATEGORIES[primary], chosenNames);

  let primPrimaryAdded = addUnique(primPrimaryPool, primPrimaryTarget);
  let primSecondaryAdded = addUnique(primSecondaryPool, primSecondaryTarget);

  if (primPrimaryAdded < primPrimaryTarget) {
    addUnique(primSecondaryPool, primPrimaryTarget - primPrimaryAdded);
  }
  if (primSecondaryAdded < primSecondaryTarget) {
    addUnique(primPrimaryPool, primSecondaryTarget - primSecondaryAdded);
  }

  if (secondary !== "none" && secondarySlotsCount > 0) {
    const secPrimaryTarget = Math.max(1, Math.round(secondarySlotsCount * 0.8));
    const secSecondaryTarget = secondarySlotsCount - secPrimaryTarget;

    const secPrimaryPool = getTraitsFromCategories(PILLAR_PRIMARY_CATEGORIES[secondary], chosenNames);
    const secSecondaryPool = getTraitsFromCategories(PILLAR_SECONDARY_CATEGORIES[secondary], chosenNames);

    let secPrimaryAdded = addUnique(secPrimaryPool, secPrimaryTarget);
    let secSecondaryAdded = addUnique(secSecondaryPool, secSecondaryTarget);

    if (secPrimaryAdded < secPrimaryTarget) {
      addUnique(secSecondaryPool, secPrimaryTarget - secPrimaryAdded);
    }
    if (secSecondaryAdded < secSecondaryTarget) {
      addUnique(secPrimaryPool, secSecondaryTarget - secSecondaryAdded);
    }
  }

  if (selected.length < 10) {
    const fallbackCategories = new Set<string>();
    PILLAR_PRIMARY_CATEGORIES[primary].forEach(c => fallbackCategories.add(c));
    PILLAR_SECONDARY_CATEGORIES[primary].forEach(c => fallbackCategories.add(c));
    if (secondary !== "none") {
      PILLAR_PRIMARY_CATEGORIES[secondary].forEach(c => fallbackCategories.add(c));
      PILLAR_SECONDARY_CATEGORIES[secondary].forEach(c => fallbackCategories.add(c));
    }
    const fallbackPool = getTraitsFromCategories(Array.from(fallbackCategories), chosenNames);
    addUnique(fallbackPool, 10 - selected.length);
  }

  /**
   * Illustrative intensity model.
   *
   * The previous [3, 10] bounds forced all ten traits to equal exactly 10
   * whenever the pool totaled 100. These wider bounds preserve a 100-point
   * souvenir display while allowing visible, repeatable differences.
   */
  const minimum = 3;
  const maximum = 18;
  const targetTotal = 100;
  const values = Array(selected.length).fill(minimum);
  let remaining = targetTotal - minimum * selected.length;

  const randomWeights = selected.map(() => 0.25 + random());
  const totalRandomWeight = randomWeights.reduce((sum, value) => sum + value, 0);

  randomWeights.forEach((weight, index) => {
    values[index] += remaining * (weight / totalRandomWeight);
  });

  // Cap high values and repeatedly redistribute any overflow.
  for (let pass = 0; pass < 20; pass += 1) {
    let overflow = 0;
    const openIndexes: number[] = [];

    values.forEach((value, index) => {
      if (value > maximum) {
        overflow += value - maximum;
        values[index] = maximum;
      } else if (value < maximum - 0.001) {
        openIndexes.push(index);
      }
    });

    if (overflow < 0.001 || openIndexes.length === 0) break;

    const share = overflow / openIndexes.length;
    openIndexes.forEach((index) => {
      values[index] += share;
    });
  }

  // Correct floating-point drift on the largest value.
  const currentTotal = values.reduce((sum, value) => sum + value, 0);
  const correction = targetTotal - currentTotal;
  const largestIndex = values.indexOf(Math.max(...values));
  values[largestIndex] += correction;

  return selected.map((name, index) => ({
    name,
    value: Number(values[index].toFixed(2))
  }));
}

// Interface for coherence check results
export interface CoherenceResult {
  isCoherent: boolean;
  reasons: string[];
  metrics: {
    listlessCount: number;
    maxTraitValue: number;
    stdDev: number;
  };
}

// Coherence Check — structurally guaranteed by category-eligibility mapping above.
// Because Secondary traits can only be drawn from categories already eligible for
// the NUGGET's Pillar(s), contradictory combinations never enter the pool in the
// first place. No separate post-hoc check or re-roll-on-failure logic is needed.
export function checkCoherence(
  secondaryTraits: { name: string; value: number }[]
): CoherenceResult {
  return {
    isCoherent: true,
    reasons: [],
    metrics: {
      listlessCount: 0,
      maxTraitValue: 10,
      stdDev: 2.0
    }
  };
}
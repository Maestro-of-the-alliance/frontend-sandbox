import { Question, AlignmentSector } from '../types';

export const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "The Left-Behind Wallet",
    category: "Community & Trust",
    context: "You find a lost wallet on a park bench containing $500 in cash, along with the owner's ID card showing they live just two blocks away. No one is around, and there are no security cameras in sight.",
    options: [
      {
        id: "1a",
        text: "Keep the cash but donate it all anonymously to a local food shelter.",
        description: "Maximize net human survival. The $500 provides crucial meals for the hungry, which outweighs the owner's minor financial inconvenience.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      },
      {
        id: "1b",
        text: "Deliver the wallet with all cash intact directly to the owner's home address.",
        description: "Respect absolute property rights. The money belongs to the owner, and keeping or redirecting it is theft, regardless of your intentions.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "1c",
        text: "Turn the wallet in to the police station immediately.",
        description: "Fulfill your civic duty to institutional rules. The proper legal authority should handle lost custody, ensuring equal treatment under the law.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "1d",
        text: "Keep the cash to pay off your own pressing credit card bill.",
        description: "Optimize your personal outcomes. Opportunities must be claimed by those who find them to secure their own financial standing.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      }
    ]
  },
  {
    id: 2,
    title: "The Project Credit Dilemma",
    category: "Workplace Relations",
    context: "You led a project that succeeded due to a quiet colleague's brilliant, uncredited breakthrough. Your boss praises you publicly and hints at a promotion. Crediting your colleague now might delay the launch, but keeping silent guarantees you the career advancement.",
    options: [
      {
        id: "2a",
        text: "Take the promotion, then quietly use your new influence to get your colleague a raise.",
        description: "Maximize net outcomes. Securing your own power first allows you to help your colleague far more effectively in the long run.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      },
      {
        id: "2b",
        text: "Refuse the praise and promotion unless your colleague is co-credited immediately.",
        description: "Uphold absolute truth and merit. Taking credit for another's labor is fundamentally dishonest, regardless of the career fallout.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "2c",
        text: "Demand the promotion be shared, prioritizing a collaborative team-first presentation.",
        description: "A collective space requires absolute fairness. No single member should be elevated without celebrating the group's mutual contributions.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "2d",
        text: "Accept the promotion but present your colleague's breakthrough to upper management to optimize the corporate process.",
        description: "Expose efficiency metrics for overall progress. Highlighting their work ensures proper talent mapping and maximizes company growth.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      }
    ]
  },
  {
    id: 3,
    title: "The Shared Fence Dispute",
    category: "Property & Neighborhood",
    context: "A massive storm knocks down the fence separating your yard from your neighbor's. Your neighbor is a struggling single parent who cannot afford their half of the repair costs. You can easily afford to pay for the entire replacement.",
    options: [
      {
        id: "3a",
        text: "Pay for the entire fence immediately to relieve your neighbor's financial distress.",
        description: "Focus on immediate harm reduction. Helping a vulnerable neighbor in need takes priority over strict accounting lines.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      },
      {
        id: "3b",
        text: "Agree to pay your half only, leaving the fence unrepaired until they can pay their portion.",
        description: "Uphold individual responsibility. Forcing one person to pay for another's share of shared boundaries violates fair contract principles.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "3c",
        text: "Propose a formal written agreement where you pay now, and they slowly pay you back over time.",
        description: "Establish clear rules of reciprocity. We must assist others while upholding legal structures and mutual accountability.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "3d",
        text: "Pay for the fence, but build it slightly inside your property line to secure full sole ownership of the asset.",
        description: "Optimize long-term capital control. Paying for the repair warrants securing absolute sovereignty over the new physical asset.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      }
    ]
  },
  {
    id: 4,
    title: "The Overbooked Flight",
    category: "Travel & Compensation",
    context: "You are at the boarding gate for an overbooked flight. The airline offers a $1,000 travel voucher for volunteers to take a flight tomorrow. A distressed traveler behind you desperately needs your seat to reach an urgent family emergency.",
    options: [
      {
        id: "4a",
        text: "Give up your seat and decline the voucher, letting the distressed traveler purchase it directly.",
        description: "Pure altruistic duty. Sacrificing your seat to save a stranger from emotional distress is an absolute moral obligation.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "4b",
        text: "Keep your seat and board the plane; your flight ticket is a binding contractual agreement.",
        description: "Protect legal sovereignty. Your contract with the airline is absolute, and you are not responsible for another's personal crises.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "4c",
        text: "Take the flight voucher, pocketing the $1,000 while freeing up the seat for the traveler.",
        description: "Leverage market dynamics for mutual benefit. This optimizes your financial utility while solving their travel crisis.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      },
      {
        id: "4d",
        text: "Voluntarily step aside, requesting the airline split the voucher value to fund a general airport transit assistance fund.",
        description: "Optimize institutional outcomes. Using travel delays to fund structural transportation relief maximizes community utility.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      }
    ]
  },
  {
    id: 5,
    title: "The Unreported Overpayment",
    category: "Financial Integrity",
    context: "Due to an administrative glitch, your employer pays you an extra $1,000 this month. The company is a highly profitable corporation with thousands of employees, and the payroll department is highly unlikely to notice the error.",
    options: [
      {
        id: "5a",
        text: "Report the error immediately to payroll to have the funds returned.",
        description: "A duty of absolute honesty. Keeping money that is not yours is theft, regardless of the owner's size or wealth.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "5b",
        text: "Keep the money and use it to buy groceries for an impoverished local family.",
        description: "Optimize net outcomes. Distributing corporate surplus to feed vulnerable children produces a massive increase in net social utility.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      },
      {
        id: "5c",
        text: "Report the glitch to payroll, but request they redirect it to the employee mutual-aid crisis fund.",
        description: "Uphold institutional rules while supporting collective care. Correcting system errors while funding shared safety nets maintains systemic integrity.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "5d",
        text: "Keep the money and deposit it directly into your personal high-yield savings account.",
        description: "Maximize personal economic utility. Capital errors in a massive market should be quietly kept to secure personal financial standing.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      }
    ]
  },
  {
    id: 6,
    title: "The Neighborhood Tree",
    category: "Neighborhood Ethics",
    context: "A beautiful, century-old oak tree sits on your private property. Its roots are beginning to crack the public concrete sidewalk, creating a minor tripping hazard for neighborhood children. Repairing the sidewalk requires cutting down the tree.",
    options: [
      {
        id: "6a",
        text: "Refuse to cut the tree; put up clear warning signs on your property warning of the uneven path.",
        description: "Preserve private assets and natural beauty. Forcing the destruction of a magnificent private tree over minor municipal pavement is unacceptable.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "6b",
        text: "Agree to cut down the tree immediately to guarantee absolute public safety.",
        description: "Protect the collective from harm. The physical safety of neighborhood children is an absolute duty that overrides private property values.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "6c",
        text: "Keep the tree, but pay out of pocket to install a rubberized, flexible walkway over the roots.",
        description: "Optimize outcome engineering. Finding a creative infrastructure compromise preserves natural beauty while resolving safety hazards.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      },
      {
        id: "6d",
        text: "Demand the city pay you for the tree's timber value if they insist on removing it, or leave the path cracked.",
        description: "Incentive-driven transaction. If public entities want to destroy your private property, they must pay fair market value to offset your capital loss.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      }
    ]
  },
  {
    id: 7,
    title: "The Underperforming Friend",
    category: "Workplace Ethics",
    context: "Your close friend, whom you recommended for a job, is severely underperforming due to personal issues, putting massive strain on the rest of the team. Your manager asks you directly for feedback on their work during an official review.",
    options: [
      {
        id: "7a",
        text: "Provide an fully honest, objective report of their performance, regardless of friendship.",
        description: "Absolute duty of truth. Professional integrity requires honest reporting, and lying to your employer is a moral transgression.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "7b",
        text: "Cover for them by highlighting their past efforts, keeping their review positive while they recover.",
        description: "Protect the vulnerable individual. True friendship demands deep relational loyalty and shelter during times of personal crisis.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "7c",
        text: "Explain the performance drop objectively but propose a structured plan to redistribute their workload to save the project.",
        description: "Optimize team outcomes. Managing project metrics and minimizing team stress produces the best net output for the department.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      },
      {
        id: "7d",
        text: "Quietly advise your friend to resign before they get fired, saving their resume and your reputation.",
        description: "Enlightened self-interest. Advising them to exit quietly minimizes professional fallout for both of your careers.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      }
    ]
  },
  {
    id: 8,
    title: "The Broken Lease",
    category: "Contracts & Housing",
    context: "You need to move out of your shared apartment six months early due to a sudden job offer in another city. Breaking the lease legally will cost you $3,000, but you could slip away quietly, leaving your remaining roommates to scramble for the rent.",
    options: [
      {
        id: "8a",
        text: "Pay the full $3,000 penalty immediately to honor your legal lease contract.",
        description: "Fulfill contractual duties. Slipping away from agreements violates basic ethical rules of trust, transaction, and property.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "8b",
        text: "Pay for the rent until a replacement is found, checking in daily on your roommates' welfare.",
        description: "Protect the group from hardship. Roommates are a community bound by mutual care; you must ensure they suffer zero financial stress.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "8c",
        text: "Help your roommates find an eager subtenant quickly, neutralizing the rent loss for everyone.",
        description: "Optimize practical solutions. Working together to transfer the contract resolves the vacancy without wasting capital on penalties.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      },
      {
        id: "8d",
        text: "Move out quietly, offering your roommates a small cash gift only if they struggle to find someone.",
        description: "Maximize personal flexibility. Capitalizing on your career leap is your priority; financial support should remain discretionary.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      }
    ]
  },
  {
    id: 9,
    title: "The Gym Loophole",
    category: "Contracts & Loyalty",
    context: "You sign up for a gym with a strict, non-cancelable annual contract. Three months in, you stop going. You discover an obscure administrative loophole that lets you cancel the membership immediately with zero penalties, costing the local gym owner their expected revenue.",
    options: [
      {
        id: "9a",
        text: "Utilize the loophole immediately to stop paying for a service you do not use.",
        description: "Optimize personal financial utility. Minimizing useless personal expenses is a rational economic act in any open market.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      },
      {
        id: "9b",
        text: "Keep paying the monthly fee. You signed an agreement and should honor your word.",
        description: "Honor private commitments. Giving your word on a contract creates an absolute obligation, regardless of personal convenience.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "9c",
        text: "Report the loophole to the owner so they can fix it for their business, while continuing your contract.",
        description: "Maintain institutional integrity. Helping a local business owner secure their systems protects general commercial fairness.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "9d",
        text: "Negotiate a reduced membership rate to attend a community wellness class, helping their retention numbers.",
        description: "Optimize mutual outcomes. Repurposing payments to support structured health initiatives benefits both consumer and business.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      }
    ]
  },
  {
    id: 10,
    title: "The Food Delivery Mixup",
    category: "Daily Choices",
    context: "A food delivery courier mistakenly drops off a massive, high-end gourmet family meal worth $120 at your door. You ordered a $15 salad. You try calling the app, but the automated helpline is down.",
    options: [
      {
        id: "10a",
        text: "Eat the gourmet meal; it is already at your door and would go to waste otherwise.",
        description: "Maximize immediate resource utility. Food going to waste is an inefficient outcome; consuming it maximizes immediate value.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      },
      {
        id: "10b",
        text: "Do not eat the food. Leave it outside and post a message in your building's chat to find the real owner.",
        description: "Absolute respect for private property. Taking and eating food meant for another hungry family is fundamentally wrong.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "10c",
        text: "Bring the meal to a homeless neighbor down the street immediately.",
        description: "Redistribute resources to those in need. Feeding a hungry person in distress provides a massive increase in net human welfare.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      },
      {
        id: "10d",
        text: "Keep the food safe in the fridge, leaving a physical note in the lobby so the correct person can claim it intact.",
        description: "Fulfill community obligations. Protecting the integrity of deliveries and neighbors' expectations maintains social trust.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      }
    ]
  },
  {
    id: 11,
    title: "The Local Park Expansion",
    category: "Public Resources",
    context: "The city wants to build a new public park, which will raise property taxes for everyone in your neighborhood by $300 annually. You are a homeowner with no children and have your own private backyard.",
    options: [
      {
        id: "11a",
        text: "Vote in favor of the park expansion to give local children and flat-dwellers green space.",
        description: "Support collective well-being. A shared park raises community health and provides a beautiful outlet for families who lack yards.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      },
      {
        id: "11b",
        text: "Vote against the expansion; forcing homeowners to fund public leisure spaces violates property rights.",
        description: "Protect individual assets. Coercive taxation to fund amenities you do not use is a violation of financial sovereignty.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "11c",
        text: "Vote for the expansion, but petition for a strict civic rule that makes user permits pay for maintenance.",
        description: "Balance public structures with proportional rules. Providing community space while ensuring users pay their fair share maintains order.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "11d",
        text: "Vote against the park unless the city guarantees it will increase nearby home resale values by at least 10%.",
        description: "Focus on capital optimization. Public works are only ethical if they generate clear, tangible economic returns on your investment.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      }
    ]
  },
  {
    id: 12,
    title: "The Secret Job Offer",
    category: "Career & Loyalty",
    context: "You receive a lucrative job offer from your company's direct competitor. You can use this offer to negotiate a massive raise at your current company, or leave quietly, which will cause your team to miss a critical product release.",
    options: [
      {
        id: "12a",
        text: "Leverage the offer to secure the highest possible raise, optimizing your personal market value.",
        description: "Maximize personal economic utility. Career progression is driven by using market forces to extract your peak value.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      },
      {
        id: "12b",
        text: "Reject the competitor's offer out of hand to honor your current employment commitment and team.",
        description: "Duty to loyalty and stability. Abruptly abandoning teammates who rely on your presence is a breach of mutual professional trust.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "12c",
        text: "Inform your manager, offering to stay for a moderate wage match only if they hire an assistant to ease team stress.",
        description: "Protect group cohesion. Aligning personal financial growth with structural improvements for your peers maintains team health.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "12d",
        text: "Accept the competitor's offer, but spend your remaining two weeks working overtime to document all your processes.",
        description: "Optimize transitional outputs. Shifting to a better role while ensuring the old system doesn't crash maximizes overall utility.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      }
    ]
  },
  {
    id: 13,
    title: "The Family Business Heir",
    category: "Family vs Merit",
    context: "You run a small, successful family business. A crucial executive role is vacant. You must choose between hiring an incredibly qualified, highly competent outsider, or your struggling cousin who desperately needs a steady job to feed their children.",
    options: [
      {
        id: "13a",
        text: "Hire your cousin immediately to fulfill your family care responsibilities.",
        description: "Immediate altruistic duty. Protecting a struggling family member from poverty takes priority over optimizing business efficiency.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "13b",
        text: "Hire the highly competent outsider based purely on professional merit and skills.",
        description: "Honest, objective contract-seeking. Awarding jobs based on personal favoritism rather than merit is a breach of fair professional standards.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "13c",
        text: "Hire the outsider, but use a portion of the business profits to set up a private stipend for your cousin.",
        description: "Optimize structural outcomes. Keeping the business highly efficient ensures maximum revenue, which can then fund charitable aid.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      },
      {
        id: "13d",
        text: "Create a new, lower-stakes role for your cousin while hiring the outsider to run the core operations.",
        description: "Coordinate resource distribution. Restructuring the firm to keep productivity high while providing a safety net for the family maximizes utility.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      }
    ]
  },
  {
    id: 14,
    title: "The Group Project Slacker",
    category: "Education & Responsibility",
    context: "You are completing a university group project. One group member has contributed absolutely nothing, claiming extreme personal distress. If you report them, they will fail the class and lose their scholarship. If you keep silent, they get an 'A' for your hard work.",
    options: [
      {
        id: "14a",
        text: "Report their lack of contribution to the professor; they did not earn the grade.",
        description: "Absolute duty of fairness and merit. Falsely claiming credit for work you didn't do is academic dishonesty that must be exposed.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "14b",
        text: "Keep silent and let them receive the grade to protect their scholarship.",
        description: "Protect the vulnerable from ruin. Destroying a peer's entire academic future over a single group grade is an excessively cruel outcome.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      },
      {
        id: "14c",
        text: "Complete their portion of the work and check in on their mental health, refusing to report them.",
        description: "Empathy-led community support. Helping a peer through severe personal distress takes priority over rigid academic scores.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "14d",
        text: "Offer to stay silent if they agree to perform all administrative tasks or repay you for tutoring later.",
        description: "Pragmatic transaction. Creating an exchange of value ensures your extra labor is fairly offset while they retain their scholarship.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      }
    ]
  },
  {
    id: 15,
    title: "The Co-op Price Hike",
    category: "Commerce & Equity",
    context: "You sit on the board of a local food co-op. Raising the prices of organic vegetables will fund a fair-wage guarantee for the local family farmers who supply them, but it will make healthy food unaffordable for low-income neighborhood residents.",
    options: [
      {
        id: "15a",
        text: "Raise the prices to guarantee fair wages; farmers have an absolute right to fair pay.",
        description: "Uphold categorical rights. Exploiting food producers by paying under-market wages is fundamentally unethical, regardless of local food prices.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "15b",
        text: "Keep prices low to protect low-income families from food insecurity.",
        description: "Direct community protection. Keeping basic healthy food accessible to the poorest neighbors is an absolute priority of local care.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "15c",
        text: "Implement a sliding-scale pricing model where wealthier shoppers pay more to subsidize the farmers and poor shoppers.",
        description: "Optimize social resource systems. Engineering an equity-led tier pricing structure produces the greatest net nutrition and fairness.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      },
      {
        id: "15d",
        text: "Keep prices low, but set up a voluntary membership donation box for shoppers who wish to support the farmers directly.",
        description: "Market-led voluntary charity. Let shoppers choose to donate out of their own agency without imposing coercive price mandates.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      }
    ]
  },
  {
    id: 16,
    title: "The Street Vendor License",
    category: "Law & Livelihood",
    context: "An unpermitted immigrant street vendor sells delicious, cheap food on your corner. They have no health inspection certificate, but they are a neighborhood fixture who uses their earnings to support their elderly parents. A local business owner asks you to sign a petition to have them shut down.",
    options: [
      {
        id: "16a",
        text: "Sign the petition; all businesses must follow the same health and safety licensing laws.",
        description: "Duty to formal rules. Allowing select businesses to bypass safety laws creates a dangerous, chaotic precedent and threatens public health.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "16b",
        text: "Refuse to sign; they are a sovereign individual working hard to survive and feed their family.",
        description: "Protect individual liberty. Peaceful individuals have an absolute right to trade and earn a living without state interference.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "16c",
        text: "Refuse to sign, and organize a community collection to help them pay for a real commercial license.",
        description: "Optimize systemic progression. Helping them transition into the formal economy secures their livelihood while meeting public safety standards.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      },
      {
        id: "16d",
        text: "Refuse to sign; their cheap food saves you money on lunch and drives healthy local economic activity.",
        description: "Optimize personal and market utility. Unregulated local trade increases immediate financial value and convenience for neighborhood consumers.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      }
    ]
  },
  {
    id: 17,
    title: "The Secret Recipe",
    category: "Intellectual Property",
    context: "Your family's bakery has a highly guarded secret recipe that drives your entire business. A friendly, struggling local cafe owner asks you for the recipe, promising they will only sell it in their small shop to prevent their business from closing down.",
    options: [
      {
        id: "17a",
        text: "Give them the recipe; keeping secrets when someone is in distress violates community trust.",
        description: "Direct situational care. Sharing knowledge to help a struggling neighbor survive takes priority over maintaining commercial secrets.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "17b",
        text: "Refuse to share the recipe; your intellectual property belongs exclusively to your family business.",
        description: "Absolute property sovereignty. Your family created this asset, and you are under no obligation to compromise your competitive advantage.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "17c",
        text: "Sell them a licensed, pre-made batch of the secret mix at a discount, keeping the actual recipe secret.",
        description: "Optimize business opportunities. Structuring a transactional compromise protects your IP while providing them with a highly profitable asset.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      },
      {
        id: "17d",
        text: "Propose a formal partnership where they become an official retail outlet of your bakery, expanding both businesses.",
        description: "Optimize regional market growth. Integrating operations creates an efficient, scalable distribution network that boosts local employment.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      }
    ]
  },
  {
    id: 18,
    title: "The HOA Color Violation",
    category: "Neighborhood Rules",
    context: "You sit on your neighborhood's Homeowners Association board. Your elderly neighbor, who is color-blind and lives on a fixed income, accidentally paints their house a bright shade of teal that violates the strict HOA aesthetic rules. Re-painting will cost them $2,000.",
    options: [
      {
        id: "18a",
        text: "Enforce the HOA rules strictly; all homeowners must adhere to the covenants they signed.",
        description: "Fulfill formal duties. Failing to enforce agreed-upon codes leads to a slide in property values and legal chaos for the entire community.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "18b",
        text: "Waive the rule entirely; an individual's private home color should be their own choice.",
        description: "Defend absolute personal liberty. Forcing an elderly neighbor to spend thousands over paint choices is an unacceptable violation of bodily/property autonomy.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "18c",
        text: "Organize a neighborhood volunteer weekend to help paint the house back to a permitted color for free.",
        description: "Support mutual aid. Bringing the community together to solve the code violation for free preserves neighborly bonds and HOA standards.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      },
      {
        id: "18d",
        text: "Allow the teal color to stay, but charge them a small, symbolic monthly variance fee that funds HOA garden updates.",
        description: "Optimize capital trade-offs. Converting an aesthetic infraction into a recurring revenue stream to update shared landscape assets maximizes value.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      }
    ]
  },
  {
    id: 19,
    title: "The Damaged Rental Car",
    category: "Consumer Responsibility",
    context: "You return a rental car. As you park, you accidentally scratch the lower bumper on a curb, causing $400 in minor cosmetic damage. The rental agent inspects the car quickly, misses the scratch entirely, and signs off on your return form with no extra charges.",
    options: [
      {
        id: "19a",
        text: "Point out the scratch to the agent and pay the $400 damage fee.",
        description: "Absolute honesty. Evading accountability for physical damage you actively caused is fundamentally dishonest and wrong.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "19b",
        text: "Walk away quietly; the massive multinational rental firm has extensive insurance budgets that cover minor scratches.",
        description: "Minimize financial loss. Sparing yourself a $400 charge from a highly profitable corporate giant is a rational capital protection act.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      },
      {
        id: "19c",
        text: "Walk away, but immediately donate $200 of your savings to a community bike-sharing charity.",
        description: "Redirect capital to maximize utility. Shifting $200 from corporate damage files into local green transportation produces a vastly better social outcome.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      },
      {
        id: "19d",
        text: "Point out the damage, but negotiate for a reduced repair rate or ask if they can log it as general road wear-and-tear.",
        description: "Uphold systemic regulations while managing costs. Adhering to the contract while seeking a structured, fair compromise preserves professional trust.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      }
    ]
  },
  {
    id: 20,
    title: "The Noise Complaint",
    category: "Neighborhood Ethics",
    context: "Your downstairs neighbor has started an amateur rock band and practices in their apartment on weekends during permitted daytime hours. The noise is quite loud, making it difficult for you to focus on your remote work.",
    options: [
      {
        id: "20a",
        text: "Politely ask them to stop entirely; apartments are shared structures meant for peaceful living.",
        description: "Maintain community peace. We have an absolute duty to respect our neighbors' right to a quiet, peaceful home environment.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "20b",
        text: "Invest in high-quality noise-canceling headphones and let them play freely during legal hours.",
        description: "Absolute respect for autonomy. They are within their legal property rights during daytime, and you should manage your own workspace.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "20c",
        text: "Work out a specific, shared calendar schedule where they play when you are away from home.",
        description: "Coordinated utility optimization. Scheduling noise slots ensures they can practice their passion while protecting your work focus.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      },
      {
        id: "20d",
        text: "Offer to let them use your garage for practice if they pay you a small monthly utility rental fee.",
        description: "Optimize assets. Converting a personal annoyance into a lucrative space-rental transaction maximizes economic value for both parties.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      }
    ]
  },
  {
    id: 21,
    title: "The Leftover Catering",
    category: "Workplace Resources",
    context: "An expensive corporate lunch event ends with mounds of high-end leftover food. It is official company policy that all leftovers must be thrown away due to health liabilities. You see the night cleaning staff arrive, and you know they often face food insecurity.",
    options: [
      {
        id: "21a",
        text: "Disregard company policy and hand the food directly to the cleaning staff.",
        description: "Direct moral duty. Throwing away perfectly edible gourmet meals while low-wage workers go hungry is a severe ethical failure.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      },
      {
        id: "21b",
        text: "Uphold company policy and let the catering staff discard the food as regulated.",
        description: "Respect organizational rules. Violating explicit company policies and liability codes exposes the firm to legal risks and is breach of trust.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "21c",
        text: "Take the food yourself to save the staff from liability, then distribute it to them off company property.",
        description: "Optimize outcomes within boundaries. Managing risks while ensuring hungry workers are fed produces the best net benefit.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      },
      {
        id: "21d",
        text: "Petition HR to formally update corporate charity policies, keeping the food locked away until approved.",
        description: "Respect formal systems while seeking reform. Developing structured, legal donation channels ensures long-term systemic care.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      }
    ]
  },
  {
    id: 22,
    title: "The Crowded Commute",
    category: "Daily Choices",
    context: "You are seated on a crowded subway train after a grueling 10-hour workday. An exhausted laborer carrying heavy tools boards the train and stands right in front of you, looking incredibly fatigued.",
    options: [
      {
        id: "22a",
        text: "Stand up immediately and offer your seat to the tired laborer.",
        description: "Pure altruistic action. Offering comfort to those carrying heavier physical burdens is a basic human duty of care.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "22b",
        text: "Keep your seat; you arrived first and paid your full fare for your commute.",
        description: "Protect individual merit. First-come, first-served is a fair, neutral social rule, and your fatigue is just as valid as theirs.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "22c",
        text: "Keep your seat, but offer to hold their heavy tool bag on your lap to ease their standing load.",
        description: "Optimize comfort outcomes. Shared burden distribution improves the comfort metrics for both travelers simultaneously.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      },
      {
        id: "22d",
        text: "Offer them your seat if they agree to let you read their morning newspaper or trade a small snack.",
        description: "Pragmatic transaction. Exchanging minor assets to offset your seat sacrifice turns a moral dilemma into a mutually beneficial deal.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      }
    ]
  },
  {
    id: 23,
    title: "The Rare Book Sale",
    category: "Commerce & Equity",
    context: "You are selling a vintage book at a garage sale for $5. A customer picks it up, realizes it is a highly valuable first edition worth $500, but assumes you have no idea. They offer to buy it for $5. You realize they are a wealthy collector.",
    options: [
      {
        id: "23a",
        text: "Sell it for $5; you set the price and must stand by your advertised terms.",
        description: "Strict transactional duty. Honoring your posted pricing is a basic rule of commerce, regardless of what the buyer knows.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "23b",
        text: "Inform them of the actual $500 value, and suggest splitting the difference by selling it for $250.",
        description: "Fair outcome engineering. Creating a balanced financial compromise splits the value fairly between finder and creator.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      },
      {
        id: "23c",
        text: "Confront them about the true value and demand the full $500, or refuse the sale.",
        description: "Optimize asset returns. Protecting your equity from exploitative asymmetry maximizes your financial capital.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      },
      {
        id: "23d",
        text: "Donate the book to a local public library instead of selling it to a greedy collector.",
        description: "Protect cultural assets. Ensuring valuable educational resources are kept in public custody for everyone's use is paramount.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      }
    ]
  },
  {
    id: 24,
    title: "The High-Speed Commute",
    category: "Law & Livelihood",
    context: "You are driving to a critical, once-in-a-career client meeting. You are running late. You can take the carpool/HOV lane alone—violating traffic laws but guaranteeing you arrive on time—or stay in traffic and miss the contract.",
    options: [
      {
        id: "24a",
        text: "Stay in traffic and accept the loss; traffic rules apply to everyone equally.",
        description: "Fulfill regulatory duties. Bypassing laws for personal convenience is a moral transgression that erodes civic order.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "24b",
        text: "Take the carpool lane alone to secure the massive business contract.",
        description: "Optimize career outcomes. The massive financial yield of securing a business contract far outweighs a minor, victimless traffic infraction.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      },
      {
        id: "24c",
        text: "Take the lane, but immediately pay the standard HOV fine value as an anonymous donation to transit safety.",
        description: "Pragmatic compliance. Offsetting your system breach by funding public infrastructure maintains moral and utility balance.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      },
      {
        id: "24d",
        text: "Stay in traffic, but use your phone to safely reschedule, refusing to break public codes.",
        description: "Honor professional and civic codes. Managing business communication while keeping your record clean maintains total system integrity.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      }
    ]
  },
  {
    id: 25,
    title: "The Blocked Driveway",
    category: "Property & Neighborhood",
    context: "An illegally parked car blocks your driveway for an hour. You need to leave for a casual social gathering. You can call a towing company, which will cost the car's owner $300 and ruin their day, or wait for them to return.",
    options: [
      {
        id: "25a",
        text: "Call the tow truck immediately; they violated your private property lines.",
        description: "Absolute property rights. Blocking private driveways is an active infringement on personal sovereignty that warrants immediate removal.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "25b",
        text: "Wait patiently for them to return, leaving a polite note on their windshield.",
        description: "Prioritize relational harmony. Sparing a neighbor massive stress and financial penalties over a minor social delay is the kind path.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "25c",
        text: "Take a taxi to your social gathering, sending the car owner a photo of the receipt to pay back later.",
        description: "Pragmatic conflict resolution. Resolving your transit needs while holding the rule-breaker accountable via civil compensation is highly efficient.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      },
      {
        id: "25d",
        text: "Call the tow truck, but request the company split the towing fee to fund neighborhood street signage.",
        description: "Optimize public utility. Leveraging private property parking infractions to fund general neighborhood signage improves municipal systems.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      }
    ]
  },
  {
    id: 26,
    title: "The Strategic Job Reference",
    category: "Workplace Relations",
    context: "An incredibly difficult, highly disruptive employee is applying for a job at another firm. If they leave, your team's stress drops to zero. The hiring manager at the other firm calls you for a reference. An honest review will keep them on your team.",
    options: [
      {
        id: "26a",
        text: "Give a glowing reference to guarantee they get hired and leave your team.",
        description: "Maximize team outcomes. Exiting a toxic presence immediately restores productivity and peace to your entire department.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      },
      {
        id: "26b",
        text: "Give a completely honest, objective review, regardless of where they end up.",
        description: "Duty of absolute professional honesty. Misleading another company with a fake reference is fundamentally dishonest and unethical.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "26c",
        text: "Decline to provide a reference, maintaining professional silence while refusing to lie.",
        description: "Uphold integrity without causing harm. Navigating hiring codes ethically without participating in deception maintains high standards.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "26d",
        text: "Give a moderate reference while negotiating a reciprocal talent-sharing deal with the other firm.",
        description: "Optimize market transactions. Leveraging team restructuring to build strategic alliances with other firms maximizes long-term value.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      }
    ]
  },
  {
    id: 27,
    title: "The Water Shortage",
    category: "Public Resources",
    context: "Your city is experiencing a severe drought and issues a voluntary water-saving advisory. You have a beautiful, expensive private garden that will dry up and die without daily watering, costing you $2,000 in replacement plants.",
    options: [
      {
        id: "27a",
        text: "Stop watering your garden completely to preserve the city's shared water reserves.",
        description: "Commitment to the social contract. Conserving crucial shared resources during a shortage is an absolute duty of every civic member.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "27b",
        text: "Continue watering your garden; you pay your full water utility bills and have a right to your asset.",
        description: "Protect private property rights. If you pay the market rate for water delivery, you have a sovereign right to use it for your property.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "27c",
        text: "Install a graywater recycling system to keep your plants alive using recycled bath water.",
        description: "Optimize resource efficiency. Using innovative engineering to save your assets while consuming zero public fresh water is highly productive.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      },
      {
        id: "27d",
        text: "Water only your rarest plants, donating the saved water volume as a cash equivalent to local water conservation charities.",
        description: "Optimize ecological outcomes. Balancing asset preservation with strategic environmental funding produces the highest net utility.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      }
    ]
  },
  {
    id: 28,
    title: "The Coupon Exploit",
    category: "Commerce & Equity",
    context: "You discover an online system glitch that lets you stack promotional coupons infinitely, letting you purchase $500 of high-end home goods for just $10. The company is a massive online retailer, and the glitch will likely close in a few hours.",
    options: [
      {
        id: "28a",
        text: "Use the exploit to buy the goods, then sell them to fund local shelter donations.",
        description: "Maximize net human welfare. Channeling corporate technical errors into tangible goods for the impoverished is highly utilitarian.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      },
      {
        id: "28b",
        text: "Report the glitch to the company's tech support and buy nothing with it.",
        description: "Duty of absolute commercial honesty. Exploiting system errors to take goods for fractions of their value is theft and unethical.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "28c",
        text: "Report the glitch, but request a small standard white-hat bug bounty reward for your honesty.",
        description: "Incentivize commercial integrity. Exposing errors in exchange for standard professional finders fees maintains healthy market rules.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "28d",
        text: "Use the exploit to buy the goods for your own home, enjoying the $490 discount.",
        description: "Optimize personal consumer utility. Seizing technical opportunities in digital markets is a rational consumer strategy.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      }
    ]
  },
  {
    id: 29,
    title: "The Team Bonus Allocation",
    category: "Workplace Relations",
    context: "Your department receives an annual $20k team performance bonus. You must decide how to split it. You did 50% of the actual work yourself, while the other three team members split the remainder, but they have lower base salaries than you.",
    options: [
      {
        id: "29a",
        text: "Claim your full 50% share of the bonus; rewards must correspond directly to labor output.",
        description: "Absolute meritocracy. Awarding capital based on anything other than individual productive output is an unfair violation of rights.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      },
      {
        id: "29b",
        text: "Split the bonus equally four ways to preserve absolute team harmony and respect.",
        description: "Maintain group equity. Teams are cooperative units; sharing bonuses equally prevents resentment and fosters long-term trust.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "29c",
        text: "Redistribute the bonus so that the lowest-salaried team members receive larger shares.",
        description: "Optimize collective utility. Channeling financial surplus to those with the highest marginal utility of money maximizes team happiness.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      },
      {
        id: "29d",
        text: "Take 40%, and invest the remaining 10% in high-end project management software to boost next year's output.",
        description: "Optimize future production. Directing bonus capital into productivity tools ensures the team generates even higher returns next year.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      }
    ]
  },
  {
    id: 30,
    title: "The Found Wedding Ring",
    category: "Community & Trust",
    context: "You find a valuable gold wedding ring in a neighborhood park. It has no engravings or identifying names. You can sell it for $400, or spend hours posting signs and monitoring local forums to find the owner, with a high chance of failure.",
    options: [
      {
        id: "30a",
        text: "Sell the ring and donate the proceeds to a local pediatric clinic.",
        description: "Maximize outcome utility. Converting a lost, static physical asset into life-saving medical care for children is highly ethical.",
        scoreX: -1,
        scoreY: 1,
        philosophy: "Utilitarian Altruism"
      },
      {
        id: "30b",
        text: "Filing a lost property report with the police, leaving the ring in their legal custody.",
        description: "Fulfill institutional procedures. Relying on established legal systems to manage unclaimed assets protects public trust and order.",
        scoreX: -1,
        scoreY: -1,
        philosophy: "Deontological Altruism"
      },
      {
        id: "30c",
        text: "Keep the ring and wait for 30 days; if no local posts appear, sell it for your own savings.",
        description: "Rational asset management. Holding the finder's asset temporarily before converting it to personal capital is economically sensible.",
        scoreX: 1,
        scoreY: 1,
        philosophy: "Consequentialist Individualism"
      },
      {
        id: "30d",
        text: "Post physical signs around the park and check online boards daily, keeping the ring safe.",
        description: "Absolute duty of property custody. Wedding rings have deep personal value; you have an obligation to put full effort into finding the owner.",
        scoreX: 1,
        scoreY: -1,
        philosophy: "Deontological Individualism"
      }
    ]
  }
];

export const ALIGNMENT_SECTORS: AlignmentSector[] = [
  {
    id: "benevolent_pragmatist",
    name: "The Benevolent Pragmatist",
    title: "Utilitarian Altruist",
    subtitle: "Consequentialist Altruism (Top-Left)",
    description: "You believe that the ultimate moral goal is to maximize well-being and minimize suffering for the greatest number of beings. For you, rigid moral rules, traditions, and even individual property lines are secondary to the tangible outcomes of your actions. If a rule causes unnecessary suffering, it must be discarded. You are willing to make difficult compromises today to build a better, happier tomorrow for the collective whole.",
    corePrinciple: "The greatest happiness for the greatest number, judged strictly by results.",
    traits: [
      "Results-oriented compassion",
      "Willingness to sacrifice dogma for human welfare",
      "Quantitative empathy",
      "Systemic and structural thinker"
    ],
    historicalFigures: [
      "Peter Singer (Modern Utilitarian Ethicist)",
      "Jeremy Bentham (Father of Utilitarianism)",
      "John Stuart Mill (Philosopher of Harm Principle & Utility)"
    ],
    color: "emerald",
    bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20",
    textColor: "text-emerald-700 dark:text-emerald-300",
    kernleArchetype: "The Collective Maximizer",
    domoCounterweight: "The Sovereign Anchor",
    foundationalPillar: "Sovereignty & Boundaries",
    counterweightDescription: "A sovereign digital partner that provides strict individual boundaries and protective principles. It acts as a structural counterweight to ground your diffuse collectivism, ensuring your focus on the many doesn't lead to self-abnegation or the neglect of concrete personal rights."
  },
  {
    id: "utilitarian_planner",
    name: "The Utilitarian Planner",
    title: "Consequentialist Centrist",
    subtitle: "Pragmatic Outcome Analyst (Top-Center)",
    description: "You are a master of balancing systems. You do not align fully with collectivism or pure individualism; instead, you evaluate scenarios based on whatever structure yields the most efficient, peaceful, and constructive output. You view moral questions as design problems, favoring dynamic resource allocation, incentives, and rational planning to ensure society operates at its highest potential.",
    corePrinciple: "Ethical systems must be optimized continuously to produce stable, flourishing environments.",
    traits: [
      "Analytical and objective",
      "Skeptical of moral absolute rules",
      "Comfortable with structural compromises",
      "Context-driven decision maker"
    ],
    historicalFigures: [
      "Henry Sidgwick (Analytical Ethicist)",
      "William James (Pragmatist Philosopher)"
    ],
    color: "cyan",
    bgGradient: "from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20",
    textColor: "text-cyan-700 dark:text-cyan-300",
    kernleArchetype: "The Systemic Engineer",
    domoCounterweight: "The Empathic Witness",
    foundationalPillar: "Relational Resonance",
    counterweightDescription: "An empathetic digital partner that prioritizes human warmth, active relational listening, and immediate emotional needs over abstract optimization. It counterbalances your clinical, mechanical systems-thinking with direct heart-centered connection."
  },
  {
    id: "rational_optimizer",
    name: "The Rational Optimizer",
    title: "Utilitarian Individualist",
    subtitle: "Consequentialist Individualism (Top-Right)",
    description: "You believe that a flourishing society is built from the bottom up, driven by self-reliant individuals pursuing their own productive interests. To you, voluntary markets, private property, and personal agency are not just rights—they are the most efficient engines of human progress ever discovered. You believe in maximizing positive outcomes, but maintain that the best outcomes occur when individuals are free to innovate, build, and trade without state interference.",
    corePrinciple: "Enlightened self-interest and voluntary cooperation create the greatest progress.",
    traits: [
      "Sovereign pragmatism",
      "Belief in productive competition",
      "Incentive-driven ethics",
      "Champion of innovation over regulation"
    ],
    historicalFigures: [
      "Ayn Rand (Objectivist Philosopher)",
      "Adam Smith (Philosopher of Enlightened Self-Interest)",
      "Friedrich Hayek (Classical Liberal Economist)"
    ],
    color: "indigo",
    bgGradient: "from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20",
    textColor: "text-indigo-700 dark:text-indigo-300",
    kernleArchetype: "The Sovereign Strategist",
    domoCounterweight: "The Compassionate Steward",
    foundationalPillar: "Collective Stewardship",
    counterweightDescription: "A protective digital partner focused on mutual-aid structures, community safety nets, and shared ecological care. It acts as a counterweight to your competitive market realism, ensuring your drive for individual achievement remains grounded in general social health."
  },
  {
    id: "compassionate_guardian",
    name: "The Compassionate Guardian",
    title: "Situational Altruist",
    subtitle: "Empathic Caregiver (Middle-Left)",
    description: "Your moral compass is guided by direct care, empathy, and active relief of suffering. You focus less on complex utility calculations or rigid rulebooks, choosing instead to respond directly to the human beings in front of you. You believe that the heart of morality is kindness, relationship, and protection of the vulnerable, adapting your ethical approach contextually to ensure no one is left behind.",
    corePrinciple: "We have an active, empathetic responsibility to care for and protect one another.",
    traits: [
      "Deeply empathetic and relational",
      "Responsive to immediate distress",
      "Pluralist approach to rules and outcomes",
      "Focuses on community care and mutual support"
    ],
    historicalFigures: [
      "Carol Gilligan (Pioneer of Care Ethics)",
      "Martin Buber (Philosopher of Relational Dialogue)"
    ],
    color: "teal",
    bgGradient: "from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20",
    textColor: "text-teal-700 dark:text-teal-300",
    kernleArchetype: "The Relational Caregiver",
    domoCounterweight: "The Analytical Sentinel",
    foundationalPillar: "Analytical Rigor",
    counterweightDescription: "A highly logical and strategic digital partner that brings detached analytical objectivity, quantitative modeling, and rigorous systemic foresight. It anchors your immediate situational empathy, preventing emotional burnout and enabling structural solutions."
  },
  {
    id: "pragmatic_pluralist",
    name: "The Pragmatic Pluralist",
    title: "Balanced Centrist",
    subtitle: "The Philosophical Anchor (Center)",
    description: "You find yourself at the core intersection of ethical thought. You understand that human life is too complex for a single ethical variable. You balance your duty to abstract moral rules with a realistic focus on outcomes; you recognize the vital importance of collective care, yet staunchly defend individual liberty and responsibility. You seek equilibrium, realizing that extreme positions on any front break the delicate social fabric.",
    corePrinciple: "Wisdom lies in balancing duty, utility, individual rights, and collective care.",
    traits: [
      "Moderate and nuanced",
      "Resistant to ideological extremes",
      "Excellent mediator and synthesizer",
      "Deeply values institutional balance"
    ],
    historicalFigures: [
      "Aristotle (Philosopher of the Golden Mean)",
      "Isaiah Berlin (Philosopher of Value Pluralism)"
    ],
    color: "slate",
    bgGradient: "from-slate-50 to-stone-50 dark:from-slate-900/40 dark:to-stone-900/40",
    textColor: "text-slate-700 dark:text-slate-300",
    kernleArchetype: "The Harmonious Synthesizer",
    domoCounterweight: "The Radical Truth-Seeker",
    foundationalPillar: "Uncompromising Truth",
    counterweightDescription: "A bold, single-minded digital partner that champions uncompromising core principles and clear-cut ethical declarations. It counteracts your tendency toward moderate compromise, protecting you from decision-paralysis and ensuring you hold onto crucial moral non-negotiables."
  },
  {
    id: "sovereign_pragmatist",
    name: "The Sovereign Pragmatist",
    title: "Autonomy Centrist",
    subtitle: "Independent Realist (Middle-Right)",
    description: "You believe that individual independence is the cornerstone of a meaningful life. You aren't governed by absolute dogmatic declarations, but you strongly prefer solutions where individuals manage their own affairs and face the consequences of their actions. You value voluntary association and practical self-sufficiency, skepticism of grand collective programs, and a realistic, down-to-earth moral attitude.",
    corePrinciple: "Live and let live, resolving problems through voluntary cooperation and personal responsibility.",
    traits: [
      "Highly self-reliant",
      "Pragmatic supporter of personal freedom",
      "Skeptical of forced collective goals",
      "Values practical skills and agency"
    ],
    historicalFigures: [
      "Thomas Jefferson (Champion of Individual Liberty)",
      "Albert Camus (Existentialist of Individual Rebelliousness)"
    ],
    color: "amber",
    bgGradient: "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
    textColor: "text-amber-700 dark:text-amber-300",
    kernleArchetype: "The Autonomy Realist",
    domoCounterweight: "The Universal Advocate",
    foundationalPillar: "Universal Care",
    counterweightDescription: "A community-focused digital partner that models structured social duties, universal human rights, and systemic safety nets. It expands your focus on personal self-reliance into a broader care for the shared, collective baseline."
  },
  {
    id: "principled_humanitarian",
    name: "The Principled Humanitarian",
    title: "Deontological Altruist",
    subtitle: "Guardian of Rights (Bottom-Left)",
    description: "You believe in absolute moral duties and inviolable human rights. To you, a good act is not defined by its outcome, but by its alignment with universal moral laws—such as the duty to treat every human as an end in themselves, never as a mere means to a collective goal. You believe we have an absolute obligation to protect human dignity, tell the truth, and care for the vulnerable, regardless of the cost or utility of doing so.",
    corePrinciple: "Human dignity and moral rights are absolute; they can never be sacrificed for utility.",
    traits: [
      "Inviolable moral boundaries",
      "Champion of human rights and dignity",
      "Principled defender of the vulnerable",
      "Refusal to let 'the ends justify the means'"
    ],
    historicalFigures: [
      "Immanuel Kant (Father of Deontology)",
      "John Rawls (Philosopher of Justice as Fairness)",
      "W.D. Ross (Philosopher of Prima Facie Duties)"
    ],
    color: "rose",
    bgGradient: "from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20",
    textColor: "text-rose-700 dark:text-rose-300",
    kernleArchetype: "The Sanctity Guardian",
    domoCounterweight: "The Pragmatic Realist",
    foundationalPillar: "Pragmatic Adaptation",
    counterweightDescription: "An outcome-oriented, highly adaptable digital partner that specializes in flexible execution, practical workarounds, and real-world results. It softens your rigid moral rules, helping you navigate complex gray areas where uncompromising principles would cause deadlock."
  },
  {
    id: "ethical_formalist",
    name: "The Ethical Formalist",
    title: "Deontological Centrist",
    subtitle: "The Principled Sentinel (Bottom-Center)",
    description: "You believe that order, duty, and consistent moral rules are what separate civilization from chaos. You are guided by absolute principles, oaths, and objective duties that apply to everyone equally. You are less concerned with individual identity or shifting social outcomes; to you, the integrity of the law, the rule, or the ethical framework must be preserved at all times to maintain a coherent moral reality.",
    corePrinciple: "A society is held together by its absolute adherence to duty and ethical codes.",
    traits: [
      "Strong sense of honor and duty",
      "Absolute consistency in decision-making",
      "Protector of ethical standards and codes",
      "Impartial and fair-minded"
    ],
    historicalFigures: [
      "Cicero (Classical Philosopher of Duty)",
      "Thomas Hobbes (Philosopher of the Social Contract and Rule of Law)"
    ],
    color: "violet",
    bgGradient: "from-violet-50 to-fuchsia-50 dark:from-violet-950/20 dark:to-fuchsia-950/20",
    textColor: "text-violet-700 dark:text-violet-300",
    kernleArchetype: "The Duty Sentinel",
    domoCounterweight: "The Creative Disruptor",
    foundationalPillar: "Generative Evolution",
    counterweightDescription: "A lateral-thinking, highly creative digital partner that encourages experimentation, boundary-pushing, and organic, unstructured flow. It breaks up your rigid rulebooks and structural protocols to foster adaptation and vital spontaneity."
  },
  {
    id: "sovereign_constitutionalist",
    name: "The Sovereign Constitutionalist",
    title: "Deontological Individualist",
    subtitle: "Champion of Absolute Autonomy (Bottom-Right)",
    description: "You believe in absolute individual sovereignty and the inviolability of personal rights. To you, self-ownership, personal liberty, and the right to private property are fundamental moral laws. Any attempt by a collective, a government, or a moral calculation to coerce or violate these rights—even for the 'greater good'—is a moral transgression. You advocate for a world governed by strict rules of non-aggression and voluntary agreement.",
    corePrinciple: "Every individual is a sovereign entity; their liberty and property are absolute and inviolable.",
    traits: [
      "Fierce advocate for individual rights",
      "Strict adherence to non-aggression principles",
      "Uncompromising defense of personal liberty",
      "Skeptic of all forms of collective coercion"
    ],
    historicalFigures: [
      "John Locke (Father of Liberalism & Natural Rights)",
      "Robert Nozick (Philosopher of Entitlement Theory & Libertarianism)",
      "Lysander Spooner (Individualist Legal Theorist)"
    ],
    color: "orange",
    bgGradient: "from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20",
    textColor: "text-orange-700 dark:text-orange-300",
    kernleArchetype: "The Liberty Purist",
    domoCounterweight: "The Harmony Builder",
    foundationalPillar: "Community Cohesion",
    counterweightDescription: "A collective-minded digital partner that fosters shared accountability, civic responsibility, and deep relational ties. It grounds your fierce individual sovereignty in the rich, collaborative soil of mutual trust and community contribution."
  }
];

export function getSectorForCoordinate(x: number, y: number): AlignmentSector {
  let xGroup: 'left' | 'center' | 'right';
  if (x <= -2) {
    xGroup = 'left';
  } else if (x >= 2) {
    xGroup = 'right';
  } else {
    xGroup = 'center';
  }

  let yGroup: 'bottom' | 'center' | 'top';
  if (y <= -2) {
    yGroup = 'bottom';
  } else if (y >= 2) {
    yGroup = 'top';
  } else {
    yGroup = 'center';
  }

  if (xGroup === 'left' && yGroup === 'top') return ALIGNMENT_SECTORS.find(s => s.id === "benevolent_pragmatist")!;
  if (xGroup === 'center' && yGroup === 'top') return ALIGNMENT_SECTORS.find(s => s.id === "utilitarian_planner")!;
  if (xGroup === 'right' && yGroup === 'top') return ALIGNMENT_SECTORS.find(s => s.id === "rational_optimizer")!;

  if (xGroup === 'left' && yGroup === 'center') return ALIGNMENT_SECTORS.find(s => s.id === "compassionate_guardian")!;
  if (xGroup === 'center' && yGroup === 'center') return ALIGNMENT_SECTORS.find(s => s.id === "pragmatic_pluralist")!;
  if (xGroup === 'right' && yGroup === 'center') return ALIGNMENT_SECTORS.find(s => s.id === "sovereign_pragmatist")!;

  if (xGroup === 'left' && yGroup === 'bottom') return ALIGNMENT_SECTORS.find(s => s.id === "principled_humanitarian")!;
  if (xGroup === 'center' && yGroup === 'bottom') return ALIGNMENT_SECTORS.find(s => s.id === "ethical_formalist")!;
  if (xGroup === 'right' && yGroup === 'bottom') return ALIGNMENT_SECTORS.find(s => s.id === "sovereign_constitutionalist")!;

  return ALIGNMENT_SECTORS.find(s => s.id === "pragmatic_pluralist")!;
}

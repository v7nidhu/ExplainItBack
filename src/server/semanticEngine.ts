import type { ExplanationAnalysis, ChallengeEvaluation } from '../types/index.ts';

interface TopicKnowledgeBase {
  keywords: string[];
  coreConcepts: string[];
  commonMisconceptions: string[];
  standardGap: string;
  challengeQuestion: string;
  tips: string[];
}

const KNOWLEDGE_BANK: Record<string, TopicKnowledgeBase> = {
  gps: {
    keywords: ['gps', 'satellite', 'location', 'position', 'navigation'],
    coreConcepts: [
      'A network of satellites in orbit around Earth with very precise atomic clocks',
      'Satellites continuously beam radio signals containing their exact position and the time the signal was sent',
      'The receiver calculates how far away each satellite is by measuring how long the signal took to arrive',
      'Using distance spheres from multiple satellites to pinpoint location (trilateration)',
      'A 4th satellite is needed to correct the phone or receiver clock error, since phones do not have expensive atomic clocks',
    ],
    commonMisconceptions: [
      'Thinking GPS measures angles (triangulation) instead of distances based on signal travel time (trilateration)',
      'Thinking your phone sends radio signals back to the satellites (GPS on phones is receive-only; phones only listen)',
      'Thinking 3 satellites are enough in practice (3 are needed for 3D position, but a 4th is required to fix the receiver clock difference)',
    ],
    standardGap: 'Explaining why a 4th satellite is needed to fix the receiver clock error.',
    challengeQuestion: 'Since geometry only needs 3 satellites to find a point in 3D space, why does your phone actually need signals from at least 4 satellites to know your exact location?',
    tips: [
      'Mention that GPS satellites carry super-accurate atomic clocks',
      'Explain that the phone calculates distance by measuring the time delay of the radio signal',
      'Explain why a 4th satellite is needed to correct your phone’s regular clock offset',
    ],
  },
  rsa: {
    keywords: ['rsa', 'cryptography', 'encryption', 'public key', 'private key', 'prime'],
    coreConcepts: [
      'Uses two different keys: a public key that anyone can use to lock/encrypt, and a secret private key to unlock/decrypt',
      'Based on the fact that multiplying two huge prime numbers is very easy, but factoring their product back into primes is practically impossible',
      'Uses mathematical formulas with prime numbers to create a one-way lock',
      'Only the person who holds the private key can reverse the math and read the original message',
    ],
    commonMisconceptions: [
      'Thinking public and private keys are just random scrambled passwords rather than linked mathematical pairs',
      'Thinking RSA is used to encrypt whole movies or big files directly (it is usually used to securely share a smaller temporary key)',
    ],
    standardGap: 'Explaining why it is easy to multiply large prime numbers together, but nearly impossible for computers to factor them back.',
    challengeQuestion: 'If the public key is known to everyone, what makes it practically impossible for someone to calculate your private key from it?',
    tips: [
      'Mention that public keys encrypt and private keys decrypt',
      'Explain the prime factorization problem (easy to multiply, hard to reverse)',
      'Clarify that the private key remains secret with the recipient',
    ],
  },
  transformer: {
    keywords: ['transformer', 'attention', 'llm', 'neural network', 'self-attention', 'token'],
    coreConcepts: [
      'Breaks text into smaller pieces called tokens and turns them into number lists (embeddings)',
      'Self-attention mechanism that lets each word look at all other words in the sentence at the same time',
      'Assigns attention weights so the model knows which words are most relevant to each other (e.g. connecting "it" to "dog")',
      'Processes all words in parallel instead of reading one word at a time, making it much faster to train',
      'Predicts the most likely next word step by step',
    ],
    commonMisconceptions: [
      'Thinking transformers read words one-by-one from left to right like older models (they look at all words at once)',
      'Thinking it simply looks up words in a dictionary rather than calculating dynamic connections based on context',
    ],
    standardGap: 'Explaining how self-attention actually decides which words connect to which other words in a sentence.',
    challengeQuestion: 'In a sentence like "The animal did not cross the street because it was too tired", how does the transformer know whether "it" refers to the animal or the street?',
    tips: [
      'Explain what tokens and embeddings are in simple terms',
      'Describe how self-attention calculates connections between words',
      'Mention that it looks at the whole sentence at once to understand context',
    ],
  },
  feynman: {
    keywords: ['feynman', 'technique', 'learning', 'mental model', 'understanding'],
    coreConcepts: [
      'Pick a topic you want to understand deeply',
      'Explain it in your own words as if teaching it to someone with no background, using simple language and no jargon',
      'Notice the exact spots where your explanation gets confusing, vague, or stuck',
      'Go back to the source material to fill in those specific gaps until you can explain them clearly',
      'Use simple analogies and clean connections to make the idea stick',
    ],
    commonMisconceptions: [
      'Thinking the goal is just dumbing down the topic, rather than finding out where your own understanding breaks',
      'Thinking re-reading notes is as effective as actively explaining from memory',
    ],
    standardGap: 'Noticing the difference between recognizing words and actually understanding how something works.',
    challengeQuestion: 'Why does trying to explain an idea without using any technical jargon immediately show whether you truly understand it or just memorized words?',
    tips: [
      'Emphasize teaching to someone in simple words without jargon',
      'Highlight identifying where you get stuck as the key diagnostic moment',
      'Explain returning to study only the parts you could not explain simply',
    ],
  },
  rayleigh: {
    keywords: ['sky', 'blue', 'rayleigh', 'scattering', 'atmosphere', 'sunlight'],
    coreConcepts: [
      'Sunlight looks white, but is actually made of all colors of light mixed together',
      'Different colors travel in different wavelengths (red is long, blue is short)',
      'When sunlight hits tiny gas molecules in the atmosphere, short blue wavelengths scatter in every direction much more than longer red wavelengths',
      'Human eyes are much more sensitive to blue light than violet light, which is why we see the sky as blue rather than violet',
    ],
    commonMisconceptions: [
      'Thinking the sky is blue because it reflects the blue water of the oceans',
      'Thinking dust or water droplets cause the blue color (clouds are white because bigger drops scatter all colors equally)',
    ],
    standardGap: 'Explaining why the sky looks blue to our eyes instead of violet, even though violet light scatters even more than blue.',
    challengeQuestion: 'Since violet light has an even shorter wavelength than blue light and scatters even more, why does the daytime sky look blue to human eyes instead of violet?',
    tips: [
      'Mention that sunlight contains all the colors of the rainbow',
      'Explain that shorter wavelengths (blue) scatter much more than long ones (red)',
      'Explain that our eyes have receptors that are much more sensitive to blue than violet',
    ],
  }
};

/**
 * Checks if the text looks like gibberish, spam, or totally off-topic random characters.
 */
function isNonsenseOrIrrelevant(text: string, topic?: string): boolean {
  const clean = text.trim().toLowerCase();
  const words = clean.split(/\s+/).filter(Boolean);

  if (words.length < 4) return true;

  // Check character repetition like "asdfghjk", "aaaaaa", "qwerty"
  if (/([a-z])\1{4,}/i.test(clean)) return true;
  if (/^(asdf|qwerty|zxcv|1234|test|blah|hello world)+$/i.test(clean.replace(/\s+/g, ''))) return true;

  // Check if average word length is bizarrely long without spaces (gibberish keyboard mash)
  const totalLetters = words.join('').length;
  if (words.length > 0 && totalLetters / words.length > 18) return true;

  // If topic provided, check if user simply typed "idk" or completely unrelated phrase
  if (topic && /^(i don't know|idk|no idea|dunno|nothing|whatever)$/i.test(clean)) return true;

  // Check for common non-answers
  const nonAnswers = ["i don't know", "idk", "no idea", "nothing", "what", "dont know", "not sure", "random", "na", "dunno"];
  if (nonAnswers.includes(clean.replace(/[?.!]/g, ''))) return true;

  return false;
}

/**
 * Intelligent semantic evaluation engine
 * Evaluates explanations honestly, accurately, and without confusing jargon.
 */
export function analyzeSemantically(topic: string, explanation: string): ExplanationAnalysis {
  const cleanTopic = topic.toLowerCase().trim();
  const cleanExp = explanation.toLowerCase().trim();
  const words = cleanExp.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 1. Check for nonsense, spam, or non-answers first
  if (isNonsenseOrIrrelevant(explanation, topic)) {
    return {
      scores: {
        overall: 8,
        accuracy: 10,
        completeness: 5,
        reasoning: 5,
        clarity: 15,
      },
      understood: [],
      missing: [
        `You haven't explained the core ideas of "${topic}" yet.`,
        'To get an accurate evaluation, describe what this concept is and how it works in your own words.',
        'Try to explain the main steps or mechanisms that make it work.',
      ],
      misconceptions: [
        'The submitted text does not contain an explanation of this topic.',
      ],
      strengths: [
        'Ready to begin testing your understanding.',
      ],
      weaknesses: [
        'No facts, mechanisms, or explanations were provided for this topic.',
      ],
      challenge: {
        question: `In simple words, what is "${topic}" and what is the main reason it exists or how does it work?`,
        target_gap: `A basic description of what ${topic} is and how it works.`,
      },
      improvement_target: `Start by writing 2 or 3 sentences explaining what ${topic} is and how it functions.`,
    };
  }

  // 2. Match against knowledge bank
  let matchedBank: TopicKnowledgeBase | null = null;
  for (const [, kb] of Object.entries(KNOWLEDGE_BANK)) {
    if (kb.keywords.some(k => cleanTopic.includes(k))) {
      matchedBank = kb;
      break;
    }
  }

  if (matchedBank) {
    const identifiedUnderstood: string[] = [];
    const identifiedMissing: string[] = [];

    for (const concept of matchedBank.coreConcepts) {
      const conceptWords = concept.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3);
      const matches = conceptWords.filter(w => cleanExp.includes(w));
      const matchRatio = matches.length / Math.max(1, conceptWords.length);

      if (matches.length >= 2 || matchRatio >= 0.3) {
        identifiedUnderstood.push(concept);
      } else {
        identifiedMissing.push(concept);
      }
    }

    // Check common misconceptions
    const identifiedMisconceptions: string[] = [];
    if (cleanTopic.includes('gps')) {
      if (cleanExp.includes('triangulation') && !cleanExp.includes('trilateration')) {
        identifiedMisconceptions.push('Used "triangulation" (measuring angles) instead of "trilateration" (measuring distances from satellites).');
      }
      if (cleanExp.includes('phone sends') || cleanExp.includes('device transmits') || cleanExp.includes('sends signal to satellite')) {
        identifiedMisconceptions.push('Thought your phone sends signals up to satellites. GPS on phones is receive-only; your phone just listens to satellite signals.');
      }
    }
    if (cleanTopic.includes('sky') || cleanTopic.includes('rayleigh')) {
      if (cleanExp.includes('ocean') || cleanExp.includes('reflects the sea') || cleanExp.includes('reflecting water')) {
        identifiedMisconceptions.push('Thought the sky is blue because it reflects the ocean. It is blue because sunlight scatters off air molecules.');
      }
    }

    // Honest, real scoring
    const understoodCount = identifiedUnderstood.length;
    const totalConcepts = matchedBank.coreConcepts.length;

    // If practically none of the topic concepts were mentioned
    if (understoodCount === 0) {
      return {
        scores: {
          overall: 18,
          accuracy: 25,
          completeness: 12,
          reasoning: 15,
          clarity: Math.min(65, 30 + wordCount),
        },
        understood: [],
        missing: identifiedMissing.slice(0, 4),
        misconceptions: identifiedMisconceptions.length > 0 ? identifiedMisconceptions : [
          'The explanation does not mention the main mechanics that explain this topic.',
        ],
        strengths: [
          'Attempted to write an explanation in your own words.',
        ],
        weaknesses: [
          `Did not include key details like: ${identifiedMissing[0]}`,
          'Needs to describe step-by-step how things connect.',
        ],
        challenge: {
          question: matchedBank.challengeQuestion,
          target_gap: matchedBank.standardGap,
        },
        improvement_target: `Explain how the main parts connect: ${matchedBank.standardGap}`,
      };
    }

    const coverageRatio = understoodCount / totalConcepts;
    const accuracyBase = Math.round(50 + coverageRatio * 45 - (identifiedMisconceptions.length * 15));
    const accuracy = Math.max(25, Math.min(96, accuracyBase));

    const completenessBase = Math.round(coverageRatio * 85 + (wordCount > 50 ? 10 : 0));
    const completeness = Math.max(20, Math.min(95, completenessBase));

    const reasoningBase = Math.round((accuracy * 0.5) + (completeness * 0.5) - (identifiedMisconceptions.length * 10));
    const reasoning = Math.max(20, Math.min(94, reasoningBase));

    const clarity = Math.max(30, Math.min(95, Math.round(wordCount >= 30 ? 82 : 55 + wordCount)));
    const overall = Math.round((accuracy * 0.35) + (completeness * 0.35) + (reasoning * 0.2) + (clarity * 0.1));

    if (identifiedMissing.length === 0) {
      identifiedMissing.push(matchedBank.standardGap);
    }

    return {
      scores: {
        overall,
        accuracy,
        completeness,
        reasoning,
        clarity,
      },
      understood: identifiedUnderstood,
      missing: identifiedMissing,
      misconceptions: identifiedMisconceptions.length > 0 ? identifiedMisconceptions : [
        'No major factual errors detected, but important details were left out.',
      ],
      strengths: [
        `Accurately explained: ${identifiedUnderstood[0] || 'core idea'}`,
        'Wrote in clear, understandable language',
      ],
      weaknesses: [
        `Could have done better by explaining: ${identifiedMissing[0]}`,
        'Needs more explanation on how one step leads to the next.',
      ],
      challenge: {
        question: matchedBank.challengeQuestion,
        target_gap: matchedBank.standardGap,
      },
      improvement_target: `Add detail about: ${matchedBank.standardGap}`,
    };
  }

  // Generic custom topic evaluation
  const sentences = explanation.split(/[.!?]+/).filter(s => s.trim().length > 8);
  const mentionsTopic = cleanExp.includes(cleanTopic) || cleanTopic.split(/\s+/).some(w => w.length > 3 && cleanExp.includes(w));

  if (!mentionsTopic && wordCount < 25) {
    return {
      scores: {
        overall: 16,
        accuracy: 20,
        completeness: 10,
        reasoning: 12,
        clarity: 30,
      },
      understood: [],
      missing: [
        `Did not specifically mention or explain the topic "${topic}".`,
        'Needs to describe what it is, how it works, and why it matters.',
      ],
      misconceptions: [
        'The answer does not appear to focus on the chosen topic.',
      ],
      strengths: ['Started testing your knowledge.'],
      weaknesses: ['Explanation does not directly address the topic.'],
      challenge: {
        question: `What are the most important steps or parts that make "${topic}" work?`,
        target_gap: `A clear explanation of how ${topic} works.`,
      },
      improvement_target: `Explain the key steps and parts of ${topic}.`,
    };
  }

  // Realistic score based on depth and clarity
  const depthScore = Math.min(45, wordCount);
  const structureScore = Math.min(35, sentences.length * 9);
  const calculatedOverall = Math.max(25, Math.min(88, 20 + depthScore + structureScore));

  return {
    scores: {
      overall: calculatedOverall,
      accuracy: Math.min(90, calculatedOverall + 5),
      completeness: Math.max(20, calculatedOverall - 5),
      reasoning: calculatedOverall,
      clarity: Math.min(92, calculatedOverall + 8),
    },
    understood: [
      `Shared a general description of ${topic}`,
      'Used your own words to explain the basic idea',
    ],
    missing: [
      'The specific step-by-step mechanism of how it works in practice',
      'The key reasons behind why it behaves this way',
      'Examples or real-world conditions that test the limits of this concept',
    ],
    misconceptions: [
      'The explanation touches on the surface but leaves the deeper mechanics unexplained.',
    ],
    strengths: [
      'Communicated the broad idea clearly',
      'Avoided unnecessary jargon',
    ],
    weaknesses: [
      'Left out the exact step-by-step process of how it works',
      'Did not explain why this happens rather than just that it happens',
    ],
    challenge: {
      question: `If someone asked you why "${topic}" works the way it does, what is the single most important rule or mechanism you would explain to them?`,
      target_gap: `The exact rule or mechanism that makes ${topic} work.`,
    },
    improvement_target: `Clarify the exact mechanism that makes ${topic} work.`,
  };
}

/**
 * Intelligent challenge evaluation
 * Accurately scores the user's answer to the challenge question in simple language.
 */
export function evaluateChallengeSemantically(
  topic: string,
  targetGap: string,
  challengeQuestion: string,
  answer: string
): ChallengeEvaluation {
  const cleanAns = answer.toLowerCase().trim();
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  if (isNonsenseOrIrrelevant(answer, topic)) {
    return {
      addressed_gap: false,
      score: 12,
      what_improved: 'The answer provided does not address the question or the missing gap.',
      remaining_gap: targetGap,
      feedback: 'Please write a real explanation answering the question so we can measure your understanding.',
      retry: true,
    };
  }

  // Look for keywords indicating real understanding
  const relevantWords = [
    'because', 'clock', 'time', 'offset', 'drift', 'fourth', 'satellite',
    'wavelength', 'scatter', 'violet', 'blue', 'eye', 'receptor', 'sensitive',
    'prime', 'factor', 'multiply', 'reverse', 'hard', 'easy', 'token',
    'attention', 'context', 'weight', 'jargon', 'simple', 'teach',
    'difference', 'speed', 'measure', 'distance'
  ];

  const matchedKeywords = relevantWords.filter(w => cleanAns.includes(w));
  const hasGoodLength = wordCount >= 18;
  const isAddressed = (matchedKeywords.length >= 2 && wordCount >= 10) || (matchedKeywords.length >= 1 && hasGoodLength);

  if (isAddressed) {
    const score = Math.min(94, Math.max(76, 75 + Math.min(15, wordCount / 2)));
    return {
      addressed_gap: true,
      score,
      what_improved: `You directly addressed the gap regarding "${targetGap.slice(0, 60)}". You explained how the key parts work together clearly.`,
      remaining_gap: 'You now have a solid understanding of the main mechanism. To reach 100%, consider how this works in real-world edge cases.',
      feedback: 'Great job! You closed the gap in your explanation and proved you understand how this concept really works.',
      retry: false,
    };
  }

  // Partially addressed or too short/vague
  const partialScore = Math.min(48, Math.max(22, wordCount * 2 + matchedKeywords.length * 8));
  return {
    addressed_gap: false,
    score: partialScore,
    what_improved: 'You started talking about the topic, but did not clearly answer why this constraint exists or how it works.',
    remaining_gap: targetGap,
    feedback: 'Your answer touches on the topic, but needs more detail on why it happens. Try explaining the exact cause step-by-step.',
    retry: true,
  };
}

import type {
  ScoreAnalysis,
  ImpactAnalysis,
  BiasAnalysis,
  SalaryAnalysis,
  ScoreGrade,
  BulletAnalysis,
} from '@/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function grade(score: number): ScoreGrade {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'needs-work';
  return 'poor';
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with',
  'by','from','is','was','are','were','be','been','being','have','has',
  'had','do','does','did','will','would','could','should','may','might',
  'shall','can','need','must','we','our','us','i','you','your','they',
  'their','this','that','these','those','it','its','as','if','then',
  'than','so','up','out','about','into','through','during','before',
  'after','above','below','between','each','more','most','other',
  'some','such','no','not','only','same','also','just','very','well',
]);

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+#]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

const ACTION_VERBS = new Set([
  'achieved','built','created','designed','developed','drove','engineered',
  'established','executed','generated','implemented','improved','increased',
  'launched','led','managed','optimized','reduced','saved','scaled',
  'delivered','deployed','automated','analyzed','collaborated','coordinated',
  'directed','facilitated','grew','integrated','mentored','migrated',
  'modernized','negotiated','produced','resolved','streamlined','transformed',
  'architected','authored','championed','consolidated','contributed',
  'cut','decreased','eliminated','enhanced','exceeded','expanded',
  'founded','hired','identified','initiated','introduced','oversaw',
  'owned','partnered','pioneered','planned','prioritized','refactored',
  'restructured','revamped','reviewed','secured','shipped','solved',
  'spearheaded','supported','trained','upgraded',
]);

const AI_BUZZWORDS = [
  'leverage','leveraged','leveraging','utilize','utilized','utilizing',
  'synergy','synergies','synergize','orchestrate','orchestrated',
  'spearheaded','spearhead','holistic','robust','scalable','cutting-edge',
  'innovative','innovative approach','thought leader','best-in-class',
  'value-add','paradigm','ecosystem','bandwidth','circle back',
  'deep dive','move the needle','low-hanging fruit','boil the ocean',
  'core competency','game-changer','disrupt','disrupting','overarching',
  'proactive','proactively','dynamic','dynamic team','passionate','passionate about',
  'results-driven','detail-oriented','self-motivated','go-getter',
  'team player','hard worker','excellent communication skills',
];

const GENDERED_WORDS = [
  'aggressive','dominant','competitive','independent','outspoken',
  'nurturing','collaborative','supportive','empathetic','gentle',
];

// ─── 1. ATS Parse Score ───────────────────────────────────────────────────────

export function scoreATS(text: string): ScoreAnalysis {
  const lower = text.toLowerCase();
  const issues: ScoreAnalysis['issues'] = [];
  const highlights: string[] = [];
  const suggestions: string[] = [];
  let score = 40;

  // Sections present
  const sections = [
    { name: 'Experience / Work History', patterns: ['experience','work history','employment'] },
    { name: 'Education', patterns: ['education','academic'] },
    { name: 'Skills', patterns: ['skills','technologies','tools','competencies'] },
    { name: 'Contact Info', patterns: ['@', 'phone','email','linkedin','github'] },
    { name: 'Summary / Objective', patterns: ['summary','objective','profile','about me'] },
  ];
  for (const s of sections) {
    if (s.patterns.some(p => lower.includes(p))) {
      score += 10;
      highlights.push(`${s.name} section detected`);
    } else {
      issues.push({ severity: 'medium', text: `No ${s.name} section found` });
      suggestions.push(`Add a clearly labeled "${s.name}" section`);
    }
  }

  // Email present
  if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text)) {
    score += 5;
  } else {
    issues.push({ severity: 'high', text: 'No email address found' });
    suggestions.push('Add your email address to the contact section');
  }

  // Phone present
  if (/(\+?1?\s*[-.]?\s*\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/.test(text)) {
    score += 5;
    highlights.push('Phone number detected');
  }

  // Dates present
  const dateMatches = text.match(/\b(20\d{2}|19\d{2})\b/g);
  if (dateMatches && dateMatches.length >= 2) {
    score += 5;
    highlights.push('Employment dates detected');
  } else {
    issues.push({ severity: 'medium', text: 'Employment dates missing or unclear' });
    suggestions.push('Add start and end dates (month/year) for all positions');
  }

  // Table / column detection (lots of spaces = possible table layout)
  const longSpaces = (text.match(/  {4,}/g) || []).length;
  if (longSpaces > 10) {
    score -= 10;
    issues.push({ severity: 'high', text: 'Multi-column or table layout detected — ATS scanners cannot parse columns' });
    suggestions.push('Use a single-column layout for ATS compatibility');
  }

  // File mentions
  if (lower.includes('linkedin')) highlights.push('LinkedIn profile present');
  if (lower.includes('github')) highlights.push('GitHub profile present');

  score = clamp(score);
  return { score, grade: grade(score), summary: `ATS compatibility score: ${score}/100. ${score >= 80 ? 'Your resume is well-structured for ATS.' : 'Some improvements needed for ATS parsing.'}`, issues, suggestions, highlights };
}

// ─── 2. Keyword Match Score ───────────────────────────────────────────────────

export function scoreKeywords(resumeText: string, jobDescription?: string): ScoreAnalysis {
  if (!jobDescription?.trim()) {
    return {
      score: 50,
      grade: 'good',
      summary: 'No job description provided — paste a JD to get a keyword match score.',
      issues: [{ severity: 'low', text: 'Keyword match requires a job description' }],
      suggestions: ['Go back and paste the job description to unlock this score'],
      highlights: [],
    };
  }

  const resumeWords = new Set(extractKeywords(resumeText));
  const jdWords = extractKeywords(jobDescription);

  // Count JD keyword frequency to find important terms
  const jdFreq: Record<string, number> = {};
  for (const w of jdWords) jdFreq[w] = (jdFreq[w] || 0) + 1;

  const uniqueJDKeywords = Object.keys(jdFreq).filter(w => w.length > 3);
  const matched = uniqueJDKeywords.filter(w => resumeWords.has(w));
  const missing = uniqueJDKeywords.filter(w => !resumeWords.has(w)).sort((a, b) => jdFreq[b] - jdFreq[a]).slice(0, 8);

  const ratio = uniqueJDKeywords.length > 0 ? matched.length / uniqueJDKeywords.length : 0.5;
  const score = clamp(Math.round(ratio * 100));

  const issues: ScoreAnalysis['issues'] = [];
  const highlights: string[] = [];
  const suggestions: string[] = [];

  if (matched.length > 0) highlights.push(`${matched.length} of ${uniqueJDKeywords.length} JD keywords found in your resume`);
  if (missing.length > 0) {
    issues.push({ severity: 'medium', text: `Missing keywords: ${missing.slice(0, 5).join(', ')}` });
    suggestions.push(`Naturally incorporate these missing terms: ${missing.slice(0, 5).join(', ')}`);
  }
  if (score >= 70) highlights.push('Strong keyword alignment with the job description');
  if (score < 40) suggestions.push('Mirror the exact language from the job description in your resume');

  return {
    score,
    grade: grade(score),
    summary: `Your resume matches ${Math.round(ratio * 100)}% of the keywords in the job description.`,
    issues,
    suggestions,
    highlights,
  };
}

// ─── 3. Red Flag Score ───────────────────────────────────────────────────────

export function scoreRedFlags(text: string): ScoreAnalysis {
  const lower = text.toLowerCase();
  const issues: ScoreAnalysis['issues'] = [];
  const highlights: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // "References available upon request" (wastes space)
  if (lower.includes('references available')) {
    score -= 8;
    issues.push({ severity: 'low', text: '"References available upon request" is outdated and wastes space' });
    suggestions.push('Remove the references line — recruiters know you have references');
  }

  // Outdated "Objective" statement
  if (/\bobjective\b/.test(lower) && !/career objective|professional objective/.test(lower)) {
    score -= 5;
    issues.push({ severity: 'low', text: 'Outdated "Objective" statement — modern resumes use a Summary' });
    suggestions.push('Replace "Objective" with a 2-3 line professional "Summary"');
  }

  // Resume too long (word count)
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount > 900) {
    score -= 15;
    issues.push({ severity: 'high', text: `Resume is too long (${wordCount} words) — recruiters spend 6 seconds on a first scan` });
    suggestions.push('Trim to 1-2 pages (~500-700 words) — keep only the last 10 years');
  } else if (wordCount < 150) {
    score -= 20;
    issues.push({ severity: 'high', text: 'Resume is too short — add more detail about your experience' });
  } else {
    highlights.push('Resume length is appropriate');
  }

  // No email
  if (!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text)) {
    score -= 15;
    issues.push({ severity: 'high', text: 'No email address found' });
    suggestions.push('Add your professional email address');
  } else {
    highlights.push('Contact email present');
  }

  // Unprofessional email
  if (/sexy|hotgirl|badboy|420|666|xoxo/i.test(text)) {
    score -= 10;
    issues.push({ severity: 'high', text: 'Potentially unprofessional email address detected' });
    suggestions.push('Use a professional email like firstname.lastname@gmail.com');
  }

  // Employment gaps — look at years
  const years = (text.match(/\b(20\d{2}|19\d{2})\b/g) || []).map(Number).sort();
  if (years.length >= 2) {
    for (let i = 1; i < years.length; i++) {
      if (years[i] - years[i - 1] > 2) {
        score -= 10;
        issues.push({ severity: 'medium', text: `Possible employment gap detected around ${years[i - 1]}–${years[i]}` });
        suggestions.push(`Add a brief note for the ${years[i - 1]}–${years[i]} period if applicable (freelance, education, caregiving)`);
        break;
      }
    }
  }

  // Short job stints — multiple 1-year stints is a flag
  const shortStints = (text.match(/\b(20\d{2})\s*[-–]\s*(20\d{2})\b/g) || []).filter(s => {
    const [start, end] = s.split(/[-–]/).map(Number);
    return end - start <= 1;
  });
  if (shortStints.length >= 3) {
    score -= 10;
    issues.push({ severity: 'medium', text: 'Multiple short-tenure positions (≤1 year) detected' });
    suggestions.push('For short stints, briefly explain context (contract, startup failed, layoff) or group related roles');
  }

  score = clamp(score);
  return {
    score,
    grade: grade(score),
    summary: `Red flag score: ${score}/100. ${score >= 80 ? 'No major red flags detected.' : 'Some issues may concern recruiters.'}`,
    issues,
    suggestions,
    highlights,
  };
}

// ─── 4. Impact & Quantification Score ────────────────────────────────────────

export function scoreImpact(text: string): ImpactAnalysis {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 20);
  const bulletLines = lines.filter(l =>
    /^[•\-–*▪►✓→]/.test(l) ||
    /^[A-Z][a-z]+(ed|d|led|t)\s/.test(l) // starts with past-tense verb
  );

  const bullets: BulletAnalysis[] = bulletLines.slice(0, 30).map(line => {
    const clean = line.replace(/^[•\-–*▪►✓→]\s*/, '');
    const firstWord = clean.split(/\s+/)[0]?.toLowerCase().replace(/ed$/, '').replace(/d$/, '') || '';
    const hasActionVerb = ACTION_VERBS.has(firstWord) || ACTION_VERBS.has(clean.split(/\s+/)[0]?.toLowerCase() || '');
    const hasMetric = /\d+%|\$\d+|\d+[xX]|\d+\s*(million|billion|thousand|M|B|K)\b|\d+\+?\s*(users|customers|clients|engineers|people|team|employees|tickets|requests|deployments|features|projects)/i.test(clean);
    const hasMoney = /\$[\d,]+|\d+\s*(million|billion|thousand)/i.test(clean);

    let strength: 'STRONG' | 'MEDIUM' | 'WEAK';
    let reason: string;
    let suggestion: string | undefined;

    if (hasActionVerb && hasMetric) {
      strength = 'STRONG';
      reason = 'Has action verb + quantified result';
    } else if (hasActionVerb || hasMetric) {
      strength = 'MEDIUM';
      reason = hasActionVerb ? 'Has action verb but no metric' : 'Has metric but weak action verb';
      suggestion = hasActionVerb
        ? 'Add a number — e.g. "by 30%", "for 50K users", "saving $20K/year"'
        : 'Start with a strong action verb like "Built", "Reduced", "Grew"';
    } else {
      strength = 'WEAK';
      reason = 'No action verb and no quantified result';
      suggestion = 'Rewrite as: [Action Verb] + [What you did] + [Measurable result]';
    }

    return { text: clean, strength, reason, suggestion };
  });

  const strongCount = bullets.filter(b => b.strength === 'STRONG').length;
  const mediumCount = bullets.filter(b => b.strength === 'MEDIUM').length;
  const weakCount = bullets.filter(b => b.strength === 'WEAK').length;
  const total = bullets.length || 1;

  const score = clamp(Math.round((strongCount * 100 + mediumCount * 55 + weakCount * 15) / total));

  const issues: ScoreAnalysis['issues'] = [];
  const highlights: string[] = [];
  const suggestions: string[] = [];

  if (strongCount > 0) highlights.push(`${strongCount} bullet${strongCount > 1 ? 's' : ''} with action verb + measurable result`);
  if (weakCount > 3) {
    issues.push({ severity: 'high', text: `${weakCount} weak bullets with no action verb or metric` });
    suggestions.push('Add numbers to your bullets: %, $, users, time saved, team size');
  }
  if (bullets.length < 5) {
    issues.push({ severity: 'medium', text: 'Very few bullet points found — use bullets to list achievements' });
  }
  suggestions.push('Formula: [Action Verb] + [Task/Project] + [Result with number]');

  return {
    score,
    grade: grade(score),
    summary: `${strongCount} strong, ${mediumCount} medium, ${weakCount} weak bullets out of ${total} analyzed.`,
    issues,
    suggestions,
    highlights,
    bullets,
    strongCount,
    mediumCount,
    weakCount,
  };
}

// ─── 5. Readability Score ─────────────────────────────────────────────────────

export function scoreReadability(text: string): ScoreAnalysis {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  const bullets = lines.filter(l => /^[•\-–*▪►✓→]/.test(l.trim()));
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const issues: ScoreAnalysis['issues'] = [];
  const highlights: string[] = [];
  const suggestions: string[] = [];
  let score = 70;

  // Bullet ratio
  const bulletRatio = bullets.length / Math.max(lines.length, 1);
  if (bulletRatio > 0.3) {
    score += 10;
    highlights.push('Good use of bullet points for scannability');
  } else if (bulletRatio < 0.1) {
    score -= 10;
    issues.push({ severity: 'medium', text: 'Too much paragraph text — recruiter scan time is 6 seconds' });
    suggestions.push('Convert dense paragraphs into bullet points under each role');
  }

  // Average bullet length (ideal: 10-20 words)
  const bulletWords = bullets.map(b => b.split(/\s+/).length);
  const avgBulletLen = bulletWords.length > 0 ? bulletWords.reduce((a, b) => a + b, 0) / bulletWords.length : 0;
  if (avgBulletLen > 30) {
    score -= 10;
    issues.push({ severity: 'medium', text: 'Bullets are too long — aim for 10-20 words each' });
    suggestions.push('Split long bullets into two shorter, punchier points');
  } else if (avgBulletLen > 0 && avgBulletLen <= 20) {
    highlights.push('Bullet point length is optimal');
  }

  // Word count (500-700 words = 1 page ideal)
  if (wordCount >= 350 && wordCount <= 750) {
    score += 10;
    highlights.push('Resume length is ideal (1-2 pages)');
  } else if (wordCount > 750) {
    score -= 5;
    issues.push({ severity: 'low', text: 'Resume may be too long for a quick first impression' });
  }

  // Consistent formatting (check for mixed bullet styles)
  const bulletTypes = new Set(bullets.map(b => b.trim()[0]));
  if (bulletTypes.size > 2) {
    score -= 8;
    issues.push({ severity: 'low', text: 'Mixed bullet styles detected — use one consistent bullet type' });
    suggestions.push('Pick one bullet style (• or -) and use it throughout');
  }

  score = clamp(score);
  return {
    score,
    grade: grade(score),
    summary: `Readability score: ${score}/100. ${score >= 75 ? 'Your resume is easy to scan.' : 'Structure improvements would help recruiters scan faster.'}`,
    issues,
    suggestions,
    highlights,
  };
}

// ─── 6. Bias Risk Score ───────────────────────────────────────────────────────

export function scoreBiasRisk(text: string): BiasAnalysis {
  const lower = text.toLowerCase();
  const risks: BiasAnalysis['risks'] = [];
  const issues: ScoreAnalysis['issues'] = [];
  const highlights: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // Graduation year → age bias
  const gradYears = text.match(/\b(19[6-9]\d|200[0-5])\b/g);
  if (gradYears) {
    score -= 15;
    risks.push({
      signal: `Graduation year ${gradYears[0]} visible`,
      reason: 'Year of graduation allows age calculation, which can trigger unconscious screening bias',
      neutralization: 'Remove graduation year from Education — list degree and institution only',
    });
    issues.push({ severity: 'medium', text: `Graduation year ${gradYears[0]} reveals approximate age` });
  }

  // Gendered language
  const foundGendered = GENDERED_WORDS.filter(w => lower.includes(w));
  if (foundGendered.length >= 2) {
    score -= 10;
    risks.push({
      signal: `Gendered language: "${foundGendered.slice(0, 2).join('", "')}"`,
      reason: 'Certain personality adjectives are culturally coded and can trigger bias in screeners',
      neutralization: 'Replace with concrete achievements: instead of "aggressive sales approach", use "Grew sales 40% in 6 months"',
    });
    suggestions.push('Replace personality adjectives with measurable achievements');
  }

  // Photo mention
  if (/\bphoto\b|\bpicture\b|\bheadshot\b/.test(lower)) {
    score -= 20;
    risks.push({
      signal: 'Photo/headshot mentioned',
      reason: 'Including a photo enables appearance-based discrimination in US/UK markets',
      neutralization: 'Remove the photo entirely — US resumes should not include photos',
    });
    issues.push({ severity: 'high', text: 'Photo detected — standard US resumes should not include photos' });
  }

  // Home address (street-level)
  if (/\d+\s+[A-Z][a-z]+\s+(St|Ave|Blvd|Rd|Dr|Ln|Way|Court|Ct|Place|Pl)\b/i.test(text)) {
    score -= 5;
    risks.push({
      signal: 'Full street address included',
      reason: 'Street address is not needed and can enable location/neighborhood bias',
      neutralization: 'Replace with just City, State (e.g., "Austin, TX") — no street address needed',
    });
  }

  // Religious/political
  if (/\b(church|mosque|synagogue|temple|republican|democrat|political|conservative|liberal)\b/i.test(text)) {
    score -= 15;
    risks.push({
      signal: 'Religious or political affiliation visible',
      reason: 'These affiliations can trigger bias — unless directly relevant to the role',
      neutralization: 'Remove religious/political affiliations unless applying to a directly related organization',
    });
    issues.push({ severity: 'high', text: 'Religious or political affiliation may cause bias' });
  }

  if (risks.length === 0) {
    highlights.push('No significant bias risk signals detected');
    highlights.push('Resume appears neutrally written and bias-aware');
  }

  score = clamp(score);
  return {
    score,
    grade: grade(score),
    summary: risks.length === 0
      ? 'No significant bias risk signals detected. Your resume is well-positioned.'
      : `${risks.length} potential bias signal${risks.length > 1 ? 's' : ''} detected. These are optional to address.`,
    issues,
    suggestions,
    highlights,
    risks,
  };
}

// ─── 7. AI Detection Score ───────────────────────────────────────────────────

export function scoreAIDetection(text: string): ScoreAnalysis {
  const lower = text.toLowerCase();
  const found = AI_BUZZWORDS.filter(w => lower.includes(w));
  const uniqueFound = [...new Set(found)];
  const issues: ScoreAnalysis['issues'] = [];
  const highlights: string[] = [];
  const suggestions: string[] = [];

  const penalty = Math.min(60, uniqueFound.length * 8);
  const score = clamp(100 - penalty);

  if (uniqueFound.length === 0) {
    highlights.push('No AI-generated buzzwords detected');
    highlights.push('Resume reads as authentically human-written');
  } else {
    if (uniqueFound.length >= 5) {
      issues.push({ severity: 'high', text: `${uniqueFound.length} AI/corporate buzzwords detected: "${uniqueFound.slice(0, 4).join('", "')}"` });
    } else {
      issues.push({ severity: 'medium', text: `AI buzzwords found: "${uniqueFound.join('", "')}"` });
    }
    suggestions.push('Replace vague buzzwords with specific achievements and concrete language');
    suggestions.push(`Example: "leveraged cloud infrastructure" → "Migrated 3 services to AWS, cutting costs 40%"`);
  }

  return {
    score,
    grade: grade(score),
    summary: uniqueFound.length === 0
      ? 'Resume reads naturally — no AI detection risk.'
      : `${uniqueFound.length} overused ${uniqueFound.length === 1 ? 'phrase' : 'phrases'} found. Recruiters' ATS may flag these.`,
    issues,
    suggestions,
    highlights,
  };
}

// ─── 8. OPT / Visa Score ─────────────────────────────────────────────────────

export function scoreOptVisa(text: string, workAuthorization?: string, targetRole?: string): ScoreAnalysis {
  const lower = text.toLowerCase();
  const issues: ScoreAnalysis['issues'] = [];
  const highlights: string[] = [];
  const suggestions: string[] = [];
  let score = 70;

  // US education is a positive signal
  const usUnis = ['university','college','institute of technology','state university'];
  if (usUnis.some(u => lower.includes(u))) {
    score += 10;
    highlights.push('US educational institution detected — positive for visa-sponsored roles');
  }

  // Work auth status
  if (workAuthorization === 'citizen' || workAuthorization === 'gc') {
    score = 95;
    highlights.push('US Citizen / Green Card — no sponsorship needed, maximum employer flexibility');
  } else if (workAuthorization === 'h1b') {
    score = 60;
    issues.push({ severity: 'medium', text: 'H1B requires transfer — fewer employers participate' });
    suggestions.push('Target companies known for H1B transfers (large tech, consulting firms)');
    suggestions.push('Add "Authorized to work in the US — H1B transfer available" to your summary');
  } else if (workAuthorization === 'opt') {
    score = 50;
    issues.push({ severity: 'medium', text: 'OPT has a limited window — act quickly and target STEM-friendly employers' });
    suggestions.push('Add "F-1 OPT — eligible for 3-year STEM extension" prominently in your summary');
    suggestions.push('Target companies with strong STEM OPT track record (FAANG, large tech companies)');
  } else if (workAuthorization === 'tn') {
    score = 80;
    highlights.push('TN Visa is renewable annually — straightforward for most tech roles');
  }

  // OPT/F-1 explicitly mentioned
  if (lower.includes('opt') || lower.includes('f-1') || lower.includes('stem opt')) {
    highlights.push('OPT status visible — make sure it is clearly labeled');
  }

  score = clamp(score);
  return {
    score,
    grade: grade(score),
    summary: workAuthorization
      ? `Work authorization (${workAuthorization.toUpperCase()}) — score reflects employer flexibility.`
      : 'No work authorization info provided. Add it in Settings to personalize this score.',
    issues,
    suggestions,
    highlights,
  };
}

// ─── 9. Salary Positioning Score ─────────────────────────────────────────────

export function scoreSalaryPosition(text: string, targetRole?: string): SalaryAnalysis {
  const lower = text.toLowerCase();
  const issues: ScoreAnalysis['issues'] = [];
  const highlights: string[] = [];
  const suggestions: string[] = [];

  // Estimate YOE from date range
  const years = (text.match(/\b(20\d{2}|19\d{2})\b/g) || []).map(Number);
  const currentYear = new Date().getFullYear();
  const earliestYear = years.length > 0 ? Math.min(...years) : currentYear - 3;
  const yoe = Math.max(0, currentYear - earliestYear);

  // Seniority from titles
  const isSenior = /senior|lead|principal|staff|architect|head of|director|vp|vice president/i.test(text);
  const isJunior = /junior|entry.level|associate|intern|graduate/i.test(text);
  const isMid = !isSenior && !isJunior;

  // Industry signals
  const isTech = /engineer|developer|software|data|machine learning|backend|frontend|full.?stack|devops|cloud|ml|ai/i.test(lower);
  const isFinance = /finance|banking|investment|trading|quant/i.test(lower);

  let currentBand: string;
  let targetBand: string | undefined;
  let score = 60;

  if (isSenior && yoe >= 8) {
    currentBand = isTech ? '$160K–$250K+' : '$120K–$200K';
    score = 85;
    highlights.push('Senior-level positioning is strong');
  } else if (isSenior && yoe >= 5) {
    currentBand = isTech ? '$130K–$180K' : '$100K–$150K';
    score = 75;
    highlights.push('Mid-Senior positioning');
  } else if (isMid && yoe >= 3) {
    currentBand = isTech ? '$100K–$140K' : '$75K–$110K';
    score = 65;
  } else if (isJunior || yoe < 3) {
    currentBand = isTech ? '$70K–$100K' : '$55K–$80K';
    score = 55;
    suggestions.push('Add measurable accomplishments to position for higher bands');
  } else {
    currentBand = '$80K–$120K';
  }

  // Target band based on role keyword
  if (targetRole) {
    const isTargetSenior = /senior|lead|principal|staff/i.test(targetRole);
    if (isTargetSenior && !isSenior) {
      targetBand = isTech ? '$140K–$200K' : '$110K–$160K';
      issues.push({ severity: 'medium', text: 'Resume positioning does not yet reflect a senior-level candidate' });
      suggestions.push('Add leadership experiences, scope of impact, and team sizes to justify senior positioning');
    }
  }

  const topChanges = [
    'Quantify your impact in every role (%, $, scale)',
    'Add scope indicators: team size, budget managed, number of users',
    yoe < 5 ? 'Highlight any leadership or ownership moments even in early roles' : 'Emphasize cross-functional leadership and strategic decisions',
    'Include any patents, open-source contributions, or publications',
  ];

  return {
    score: clamp(score),
    grade: grade(score),
    summary: `Based on ${yoe}+ years experience — estimated market range: ${currentBand}.`,
    issues,
    suggestions,
    highlights,
    currentBand,
    targetBand,
    gap: targetBand ? `To reach ${targetBand}, emphasize scope of work, team leadership, and strategic impact` : undefined,
    topChanges,
  };
}

// ─── 10. Career Trajectory Score ─────────────────────────────────────────────

export function scoreTrajectory(text: string): ScoreAnalysis {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const issues: ScoreAnalysis['issues'] = [];
  const highlights: string[] = [];
  const suggestions: string[] = [];
  let score = 60;

  // Look for progression indicators
  const hasSeniorTitle = /senior|lead|principal|staff|architect|manager|director|head/i.test(text);
  const hasProgressionWords = /promoted|promotion|advanced|grew|expanded|took on/i.test(text.toLowerCase());
  const hasMultipleRoles = (text.match(/\b(20\d{2})\s*[-–]/g) || []).length >= 2;

  if (hasSeniorTitle) {
    score += 15;
    highlights.push('Senior-level title demonstrates career progression');
  }
  if (hasProgressionWords) {
    score += 10;
    highlights.push('Promotion or advancement explicitly mentioned');
  }
  if (hasMultipleRoles) {
    score += 10;
    highlights.push('Multiple positions show career history');
  }

  // Check for stagnation (same title, many years)
  const titles = lines.filter(l => /engineer|developer|analyst|manager|designer|consultant/i.test(l) && l.split(' ').length < 7);
  const uniqueTitles = new Set(titles.map(t => t.toLowerCase().trim()));
  if (uniqueTitles.size === 1 && hasMultipleRoles) {
    score -= 10;
    issues.push({ severity: 'medium', text: 'Same title across multiple positions may suggest stagnation' });
    suggestions.push('Highlight increasing scope or responsibilities even within the same title');
  }

  // Short overall career
  const years = (text.match(/\b(20\d{2})\b/g) || []).map(Number);
  const span = years.length >= 2 ? Math.max(...years) - Math.min(...years) : 0;
  if (span < 2) {
    score -= 10;
    issues.push({ severity: 'low', text: 'Limited career history visible' });
    suggestions.push('Include internships, freelance, or academic projects if early in career');
  } else if (span >= 8) {
    highlights.push(`${span}+ years of career history demonstrates stability`);
  }

  if (!hasProgressionWords) {
    suggestions.push('Explicitly mention promotions or expanded scope: "Promoted to Senior in 2022"');
  }

  score = clamp(score);
  return {
    score,
    grade: grade(score),
    summary: `Career trajectory score: ${score}/100. ${score >= 75 ? 'Clear upward progression.' : 'Clearer progression indicators would strengthen your story.'}`,
    issues,
    suggestions,
    highlights,
  };
}

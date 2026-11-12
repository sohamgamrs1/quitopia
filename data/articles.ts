export interface Article {
  id: string;
  title: string;
  minutes: number;
  category: 'Science' | 'Guide' | 'Course';
  summary: string;
  body: string[];
}

export const ARTICLES: Article[] = [
  {
    id: 'science-of-addiction',
    title: 'The science of addiction, without the jargon',
    minutes: 5,
    category: 'Science',
    summary: 'Why the urge feels like it is coming from outside you, and what is actually happening.',
    body: [
      'Every habit you would like to stop works the same way at the level of the brain. Something triggers a cue, the cue predicts a reward, and a small hit of dopamine moves you towards the action. Dopamine is not pleasure — it is anticipation. It is the feeling of "this is about to be good", which is why the pull arrives before anything happens.',
      'The important consequence is this: the anticipation is loudest right before the action, and it collapses the moment the action is complete. That is why an urge peaks, holds for roughly fifteen to twenty minutes, and then falls away on its own whether or not you do anything.',
      'Repeat the loop often enough and the brain trims the pathway down to a reflex. That is not weakness and it is not a moral failing; it is efficiency. The brain is doing exactly what it is built to do with anything that reliably produces relief.',
      'The good news is that the same mechanism works in reverse. Every time the cue appears and the reward does not follow, the prediction weakens a little. That is what the first two weeks are: not white-knuckling, but letting a prediction fail, over and over, until the brain updates it.',
      'This is why blocking works better than willpower. You are not trying to out-argue a prediction. You are removing the cue and letting the loop starve.'
    ]
  },
  {
    id: 'dopamine-baseline',
    title: 'Dopamine, baseline, and why week one feels flat',
    minutes: 4,
    category: 'Science',
    summary: 'The flat, irritable feeling in the first week is a predictable part of the process.',
    body: [
      'When you stop a behaviour that has been supplying frequent spikes, the baseline does not immediately return to normal. It dips. For a few days to a couple of weeks you feel flat, irritable, easily bored, and slightly worse than before you started.',
      'People almost always read this as evidence that quitting is making them unhappy. It is the opposite. It is the system recalibrating, and it is temporary.',
      'What helps: sleep, daylight, movement, and anything that produces a slow reward rather than a spike — cooking, walking, a conversation, finishing something small.',
      'What does not help: replacing one spike with another. Swapping the habit for endless short video feels like progress for about three days and then becomes the same problem with a different icon.'
    ]
  },
  {
    id: 'rebuild-focus',
    title: 'How to rebuild focus after years of scrolling',
    minutes: 4,
    category: 'Guide',
    summary: 'Attention is trainable, but not by trying harder.',
    body: [
      'Attention behaves like a muscle in one specific way: it adapts to the load you put on it. If your normal load is a seven-second video, a forty-minute task will feel impossible — not because you have lost the capacity, but because you have trained a different one.',
      'The rebuild is unglamorous. Start with twenty minutes of single-task work, phone in another room. When it gets uncomfortable, that is the training, not a signal to stop.',
      'Add ten minutes a week. Within a month, forty-five minutes feels normal again.',
      'Two rules make it work. First, no second screen. Second, when you notice you have drifted, return without commentary. The returning is the rep; the drift is not a failure.'
    ]
  },
  {
    id: 'thirty-day-reboot',
    title: 'The 30-day reboot course',
    minutes: 8,
    category: 'Course',
    summary: 'Four weeks, one job per week. Read this once, then follow it.',
    body: [
      'Week one — remove the cue. Do not attempt to be strong. Remove access: block the sites, move the apps, change where the phone charges. The goal of week one is not a clean week, it is a week in which the habit is inconvenient.',
      'Week two — replace the relief. The habit was doing a job: it relieved something. Find a slower substitute for the same job — a walk for restlessness, a message to a friend for loneliness, a shower for stress. It will feel worse than the original at first. That is expected.',
      'Week three — add a witness. Tell one person. Set a weekly check-in, even a two-line message. Social cost is the strongest force in this whole process, and it costs nothing.',
      'Week four — make it structural. Turn the things that worked into defaults: a schedule, a locked block window, a fixed bedtime. What you decide once does not need deciding again at 11pm.',
      'At the end of thirty days, read your own stats. Not to grade yourself — to see which day, which hour and which feeling is actually the problem. Then design month two around that one thing.'
    ]
  },
  {
    id: 'ninety-day-hard-mode',
    title: 'The 90-day hard mode guide',
    minutes: 6,
    category: 'Course',
    summary: 'For people who want the strict version and know why.',
    body: [
      'Hard mode means no substitute, no "just this once", and no negotiation with yourself. It is not better than a gradual approach — it is just simpler to follow, because it removes decisions.',
      'Three things make it survivable. First, a hard lock with a real timer, so the decision is made once and enforced by the app rather than by mood. Second, one person who knows, so the cost of breaking it is social rather than private. Third, a written reason, in your own words, that you read on the bad nights.',
      'Expect two hard weeks and one genuinely difficult month. Most people who quit hard mode do it in week three, on a weekend, alone, late.',
      'Ninety days is a marker, not a cure. The point of the number is that it is long enough for the routine to stop feeling like deprivation and start feeling like your life.'
    ]
  },
  {
    id: 'when-to-get-help',
    title: 'When this is bigger than an app',
    minutes: 3,
    category: 'Guide',
    summary: 'Honest guidance on the line between a habit and a health issue.',
    body: [
      'Quitopia is a barrier and a journal. It is not treatment, and no blocker is.',
      'Consider talking to a professional if any of these are true: you have stopped doing things you used to care about; you are spending money you cannot afford; you feel physically unwell when you stop; you have tried repeatedly and cannot get past a few days; the behaviour is affecting your work, sleep, or relationships.',
      'In India, you can start with a general physician, a clinical psychologist, or a psychiatrist — the last is the right first call if there is any physical withdrawal involved, particularly with alcohol.',
      'Asking for help is not the failure of the plan. It is the plan working.'
    ]
  }
];

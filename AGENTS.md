# thoughtform — working preferences

These are the user's explicit preferences for this project. Preserve them in future work.

## Product and design
- A quiet, intimate visual library of difficult ideas. The brand and architecture span thinkers; Jung is the first collection, not the brand.
- Mobile first: inspect 320, 360, 390, and 430px. OLED black, strict grayscale with warm gray, editorial typography, generous space. No educational SaaS, gamification, neon, stock illustrations, or quote-app clichés.
- Keep a beautiful working experience visible early. Build and run continuously; make meaningful small git commits at working milestones, before major experiments, and after content batches.
- Aim toward a substantial multi-thinker library, 200 cards total, approximately 50 per chosen author. Quality takes priority over counts. Do not pad or repeat an idea to meet a quota.

## Reading and gestures
- Swipe left for next, right for previous. Support mouse/trackpad drag, arrow keys, and subtle navigation.
- Tap anywhere on a card to expand or collapse its deeper reading. A larger visible reading control provides the same action. Exclude independent controls, bookmarks, source links, and the animation's manual stage controls.
- Expand inline within the same card, never in a separate details modal. Scroll vertically to read. Distinguish taps, horizontal swipes, and vertical scroll; use velocity, resistance, restrained springs, and depth.
- Show new visitors a full-screen animated overlay demonstrating left/right swipes and tapping to expand/collapse. The first touch or click anywhere smoothly dismisses it without activating the card underneath; Enter and Escape also dismiss. Show it only on the first visit, remember that locally, and respect reduced motion. Returning readers keep the existing uncluttered experience.
- Every card has exactly three deeper-reading paragraphs totaling around 1,500 characters, with two static explanatory drawings between the paragraphs. Preserve the question to sit with and source reading beneath. Keep the opening view succinct.

## Illustration quality
- The animation is the medium, not decoration. It should communicate the idea before the text is read.
- The user found early simple figures/motion amateur. Seek professional editorial motion design: deliberate multi-stage choreography, fuller original human forms, readable causality, held moments, meaningful kinetic text, and sufficient motion to sustain attention.
- Longer animations are welcome when a concept needs them. Avoid identical SVG scenes with substituted labels. Reuse primitives, compose different relationships.
- Default 1.0× playback uses twice the authored lesson beat durations. The user prefers this calm baseline, with an unobtrusive settings button at the animation's bottom right offering 0.5×, 0.75×, 1.0×, 1.25×, 1.5×, 1.75×, and 2.0× plus autoplay. Remember these preferences across thoughts and reloads.
- With autoplay off, tapping the animation's left/right sides, swiping within it, or using its small arrows/keyboard moves between stages. Keep these actions separate from the card's swipe and reading gestures; preserve native vertical scrolling and reduced motion.
- Review actual rendered animations and mobile screenshots. Do not approve art from source alone. Respect reduced motion and offer pause.

## Content and research
- Broaden to Nietzsche, Freud, Adler, Frankl, Kierkegaard, Dostoevsky, Simone Weil, Krishnamurti, Alan Watts, and later thinkers.
- Research primary works and reliable scholarly/institutional sources. Store specific work/section references and verified links. Write original paraphrases; never fabricate quotes.
- One real distinction per card. Sequences should advance understanding. Avoid motivational simplification, diagnosis, or presenting historical theories as established scientific fact.
- Distinguish literary speakers/pseudonyms and disputed interpretations from an author's asserted doctrine.

## Collaboration
- The user authorizes up to 10 subagents when useful; stay within the session's actual concurrency limit.
- Delegate bounded research/content work once the design/content pattern is established. The main agent owns app integration, interaction design, art direction, and publication.
- Delegate separate files and commit only owned files to avoid overlapping changes.

Expansion scrolls to the start of the descriptive body; collapsing returns to the page top. Keep the current mobile font sizes, which the user has approved.

## Latest motion and reading feedback
- The user explicitly rejects animations that are mainly repeated arrows or abstract motion. Each lesson must transfer its central distinction on first viewing through the headline, a changing explanatory drawing, and readable kinetic text.
- Think of a teacher drawing and explaining on a blackboard: show a concrete situation, reveal the mechanism, show what changes, and make the important qualification visible. Use more beats or text when useful; do not constrain all scenes to one template.
- Expansion and collapse must coordinate scrolling with layout. Prevent scroll anchoring or content-height changes from causing a bounce. Keep expanded content present while scrolling up to collapse; only then fold it away.

## Required review for every card
Treat every card as an editorial and visual teaching problem. Critique the result before accepting it.
1. State the single thing a newcomer should understand. If the card teaches several things, narrow it or make a connected sequence.
2. Generate several visual approaches before implementation. Choose a spatial relationship and a change that reveal the idea; reject decoration, habitual arrows, and reused metaphors that do not carry this particular concept.
3. Review the first full animation as someone who has never met the concept. The headline, drawing, and kinetic text must explain the central relationship without requiring the expanded body.
4. Check each beat: what does the viewer see, what changes, and what new understanding follows? Preserve necessary objects, show the origin of changes, and allow enough time to read.
5. Read the title, statement, and three paragraphs aloud in order. Make the prose calm, direct, specific, and easy to follow. Remove generic wisdom, unnecessary negation, formulaic contrasts, repetitive caveats, and sentences that do not earn their space. Retain qualifications that materially change the idea.
6. Give each static drawing a specific teaching purpose tied to its neighboring paragraph. If it repeats the animation or merely fills space, redraw it to explain an example, mechanism, or useful distinction.
7. Verify attribution and source details. Keep original illustrative dialogue distinct from an author's quotations; historical theories should retain their historical status.
8. Inspect every animation beat and both static drawings in the actual mobile page. Check reading order, legibility, clipping, crowding, timing, and whether the picture genuinely helps. Revise defects and inspect again.
9. Review the card beside neighboring cards. Vary metaphor, composition, pace, and explanatory approach when repetition would weaken learning.
10. Finish only when every element earns its place. Do not promise perfection or treat card count, clean code, or passing measurements as a substitute for editorial judgment.

## Browser review discipline
- Capture Motion animations in real time against a fixed build. Advancing a synthetic clock can advance lesson state while leaving browser animation transitions unfinished; a beat index alone is not proof that the drawing rendered correctly.
- Assert the visible caption, allow actor transitions to settle, and inspect the rendered drawing at each beat. Keep source updates separate from a running capture batch so live reloads cannot invalidate reading or animation checks.
- Test expansion from an actual visible tap. Browser automation that scrolls a button into view before clicking can hide the origin of a scroll jump. Check the scroll trajectory, interruption, and retained content during collapse.

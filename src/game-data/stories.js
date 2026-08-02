const originalReveal = 'assets/art/campaigns/original/reveals';
const adultReveal = 'assets/art/campaigns/adult-relocation/reveals';
const finalArt = 'assets/art/campaigns/finale/chapters';

const page = (kicker, title, image, alt, paragraphs, media) => ({ kicker, title, image, alt, paragraphs, media });

export const campaignStories = Object.freeze({
  original: {
    title: 'THE ORIGINAL',
    subtitle: 'One missing singer. One exhausted mover. Absolutely no overtime.',
    pages: [
      page('CAMPAIGN I · 1986', 'Uhall & Oates: The Game', `${originalReveal}/hall-oates-crawl-reveal-v1.png`, 'Daryl Hall and John Oates pose together in vivid 1980s colors', [
        'After their hit-making years, Daryl Hall and John Oates enter the only business less predictable than music: furniture moving. Daryl supplies jingles, hair, and morale. John supplies everything that can be measured in pounds.',
        'Their owner, Joe Timmins, wants Uhall & Oates to become the greatest moving company in America—preferably without wages, fuel, or acknowledging John’s vertebrae.',
      ]),
      page('CHAPTER 1 · OLD ORCHARD BEACH', 'Out of Touch in O.O.B.', `${originalReveal}/chapter-01-old-orchard-v1.png`, 'John and Daryl at a chaotic Old Orchard Beach pier promotion', [
        'At a crowded pier promotion, Jesse and Joe Reardon arrive with a fake “New Hit Record” crate. They tempt Daryl inside with the promise of a comeback recording, then load both singer and crate onto their truck.',
        'John repairs an arcade crane, negotiates with a French-fry-loving gull, and follows Daryl’s deliberately crooked shipping trail toward Manhattan.',
      ]),
      page('CHAPTER 2 · NEW YORK', 'Private Eyes in the Big Apple', `${originalReveal}/chapter-02-manhattan-v1.png`, 'John and Baltos investigate a neon Manhattan loading zone', [
        'In Manhattan, John meets Baltos, a private investigator whose strongest qualifications are confidence and proximity to free snacks. A Reardon shipping label leads them through a storage directory and a suspicious locker.',
        'Baltos tears open a pack of 1987 Topps cards, finds a Bo Jackson rookie, and reconstructs the invoice around it. The trail points to Luke Jacuzzi’s wiffle-ball stadium.',
      ]),
      page('CHAPTER 3 · JACUZZI PARK', 'Kiss on My List', `${originalReveal}/chapter-03-jacuzzi-park-v1.png`, 'John and Luke Jacuzzi beneath a spectacular wiffle-ball scoreboard', [
        'Luke Jacuzzi treats shipping paperwork like playoff baseball. John uses Baltos’s invoice to restore the batting order, then launches a wiffle ball through the scoreboard’s increasingly personal definition of the strike zone.',
        'The winning hit releases a London shipping label—and reveals that Huey Lewis Moving has been hauling Reardon equipment without realizing the villains plan to blame him for everything.',
      ]),
      page('CHAPTER 4 · LONDON', 'I Can’t Go for That', `${originalReveal}/chapter-04-london-v1.png`, 'John and Michael McDonald investigate a London shipping depot', [
        'The Reardons route physical contracts through a fake London customs operation. Michael McDonald helps John create an authorization that is both signed and sealed; delivery remains John’s department.',
        'By correcting the dishonest routing paperwork, John uncovers the real purpose of the Recall Clause machine: it uses a fresh recording to falsely approve new control over an artist’s old catalog. Daryl has been moved to Tokyo for calibration.',
      ]),
      page('CHAPTER 5 · TOKYO', 'Maneater on the Midnight Shipping', `${originalReveal}/chapter-05-tokyo-v1.png`, 'John and Huey Lewis pursue a recording truck through Tokyo', [
        'In Tokyo, Huey learns his fleet is meant to become disposable evidence and defects with the enthusiasm of a man renegotiating his billing. John follows a backstage delivery docket through a karaoke warehouse and secured service lift.',
        'Inside the Reardon recording truck, a deliberately awful moving jingle overloads the voice filter. John recovers Daryl’s counter-melody and a return manifest leading home to The Forks, Maine.',
      ]),
      page('CHAPTER 6 · THE FORKS', 'You Make My Dreams Come True in The Forks', `${originalReveal}/chapter-06-the-forks-v1.png`, 'The cast gathers near Moxie Falls for the final broadcast', [
        'At Moxie Falls, rafting guide Jamo contributes muscle, river knowledge, and a life vest with more confidence than flotation science. John retimes the broadcast tower and confronts the Reardons with every contradictory shipping record gathered along the way.',
        'The Recall Clause rejects itself. Daryl is freed, the contracts are exposed, and Joe Timmins claims the rescue as a management initiative before ordering John toward the trunk of a gold 1993 Nissan Maxima.',
      ], { type: 'video', src: 'assets/video/uhallandoates.mp4', label: 'WATCH THE ORIGINAL ENDING' }),
    ],
  },
  'adult-relocation': {
    title: 'ADULT RELOCATION',
    subtitle: 'Four decades. Three musicians. One management problem in every year.',
    pages: [
      page('CAMPAIGN II · TIME, IMPROPERLY PACKED', 'Adult Relocation', `${adultReveal}/adult-01-maxima-trunk-v1.png`, 'A gold Nissan Maxima trunk glows with unstable time-travel equipment', [
        'The Maxima’s trunk contains a surviving Reardon Catalog Relocation Unit. Built to classify artists as movable company property, it notices that the 1993 car is parked in 1986 and responds by shipping everyone to the wrong decade.',
        'John lands in 1993, Daryl in 1987, and Michael McDonald in 2001. Joe Timmins remains everywhere through memos, recordings, and a management philosophy that transcends causality.',
      ]),
      page('CHAPTERS 1–2 · 1993 / 1987', 'Danger, Copiers, and Formalwear', `${adultReveal}/adult-02-danger-zone-v1.png`, 'Daryl enters a brightly colored Reardon corporate danger zone', [
        'John repairs the time unit with a cassette adapter and one of Joe’s emergency neckties. In 1987, Daryl infiltrates a Reardon executive retreat by turning a decorative sash into a technically compliant safety vest.',
        'Kenny Loggins, the retreat’s intensely sincere safety director, gives Daryl a Priority Danger cassette. Daryl uses it to quarantine Joe’s handbook and replace its artist-ownership rules with a harmless vocal warm-up chart.',
      ]),
      page('CHAPTERS 3–4 · 1993', 'So Close, Yet So Auctioned', `${adultReveal}/adult-04-storage-auction-v1.png`, 'John, Baltos, and Jamo face a bizarre temporal storage auction', [
        'John records the least exciting emergency announcement in mall history, closes a temporal kiosk, and retrieves the Maxima’s routing chip along with proof that Joe calls him an employee only when work is required.',
        'At a storage auction, Baltos inflates a useless future collectible into a bidding frenzy while Jamo hauls a time-soaked locker from the river. John recovers the regulator and evidence that Huey’s fleet was meant to take the blame.',
      ]),
      page('CHAPTER 5 · 2001', 'Your Hard Drive Is on My List', `${adultReveal}/adult-05-smoothmove-v1.png`, 'Michael McDonald and Michael Bolton confront a neon corporate server', [
        'Michael McDonald reaches SmoothMove.com, where singer and chief technology officer Michael Bolton operates a network that routes data by pitch. Their matching account names have locked both men out of the Reardon audit.',
        'The two Michaels reconcile their identities, harmonize the network into compliance, and release an audit log proving the scheme reaches back to 1976. Virtual Joe denies everything with machine-perfect accuracy.',
      ]),
      page('CHAPTER 6 · THREE YEARS AT ONCE', 'Out of Touch-Tone', `${adultReveal}/adult-06-touch-tone-v1.png`, 'Daryl, John, and Michael communicate across decades by telephone', [
        'Daryl sings a filing classification through a 1987 switchboard. John converts it into pager language at a 1993 mall payphone. Michael combines the translation with the 2001 audit metadata.',
        'The Maxima’s shared trunk carries each clue between them. Together they decode an impossible filing number: Joe’s handbook was officially registered before Joe wrote it.',
      ]),
      page('CHAPTER 7 · 1976', 'Back Together Again, Pending Approval', `${adultReveal}/adult-07-timeline-v1.png`, 'The heroes confront a warehouse fractured across four decades', [
        'At the original warehouse, four years occupy the same loading dock. John assembles the ledger, handbook, contractor form, fleet lien, audit log, and impossible filing number into one devastating administrative truth.',
        'The handbook cannot prove who wrote it, when it existed, or whether anyone it classified consented. The system collapses under Joe’s contradictions, restoring the timeline while Joe takes credit for “cross-decade restructuring.”',
      ]),
      page('EPILOGUE · 1993', 'You Make My Wings Come True', 'assets/art/campaigns/adult-relocation/minigames/temporal-truck-v1.png', 'The Uhall and Oates truck flies on moving-blanket wings', [
        'Back at the restored depot, a loose shipping label dated 2008 slips from Joe’s revised anniversary handbook and blows into the final time rift.',
        'The Uhall truck sprouts moving-blanket wings and chases it through six eras of badly packed history. John catches the label. Joe records the flight as an unpaid lunch break. The future has scheduled one last campaign.',
      ]),
    ],
  },
  finale: {
    title: 'THE SOUND OF MOVING ON',
    subtitle: 'The company was temporary. The music was the thing worth carrying.',
    pages: [
      page('CAMPAIGN III · 2008', 'The Sound of Moving On', `${finalArt}/final-01/depot-anniversary-v1.png`, 'John and Daryl return to the Uhall depot for its anniversary', [
        'The 2008 label leads John and Daryl to a rehearsal recording made before the moving company existed. It is unfinished, jointly credited, and proof that neither man’s contribution ever fit inside the Reardons’ categories.',
        'Joe has already sold their reunion as a cardboard-sponsored anniversary commercial. The Reardons have attached one last Purpose Clause declaring that anything created at Uhall belongs to the company.',
      ]),
      page('CHAPTERS 1–2 · MAINE / MANHATTAN', 'Back Together, in Stereo', `${finalArt}/final-02/listening-room-v1.png`, 'John and Daryl listen to separate channels in a private listening room', [
        'John retrieves the damaged rehearsal reel from Joe’s anniversary files and restores it with packing materials that finally improve the sound instead of merely protecting a lamp.',
        'At the One on One Listening Room, John’s arrangement and Daryl’s melody occupy separate channels. Playing them together reveals a shared set list and a transfer made through Michael McDonald’s Chicago studio.',
      ]),
      page('CHAPTER 3 · CHICAGO', 'Method of Modern Music', `${finalArt}/final-03/chicago-studio-v1.png`, 'Michael McDonald helps restore a colorful multitrack studio recording', [
        'Michael helps recover the complete session. The old metadata describes John as labor, Daryl as talent, and Michael as a keyboard-shaped witness—an insult with impressive database longevity.',
        'The musicians reconnect the contributor tracks and prove the arrangement belongs to everyone who made it. The restored mix ends with Joe commissioning a Los Angeles comeback commercial.',
      ]),
      page('CHAPTER 4 · LOS ANGELES', 'I Can’t Go for That Jingle', `${finalArt}/final-04/commercial-studio-v1.png`, 'Huey Lewis and John confront an overbuilt commercial-production console', [
        'Huey joins John inside a studio designed to turn every feeling into a sponsor message. By satisfying its harmless production checklist, they convince the machine that the commercial is complete.',
        'John quietly preserves one unsponsored live channel. Huey returns the route card after securing top billing in the transportation acknowledgments.',
      ]),
      page('CHAPTER 5 · REHEARSAL', 'Out of Touch, In Rehearsal', `${finalArt}/final-05/rehearsal-tent-v1.png`, 'John and Daryl rehearse together beneath a glowing performance tent', [
        'The rehearsal floor forces John and Daryl to share the beat instead of retreating into their usual specialties. John cannot carry the arrangement alone; Daryl cannot charm a silent channel into doing the work.',
        'They finish a new arrangement together. It contains no archived recording, corporate slogan, solo escape route, or instructions for moving a sectional sofa.',
      ]),
      page('CHAPTER 6 · OLD ORCHARD BEACH', 'Do What You Want, Be What You Are', `${finalArt}/final-06/pier-concert-v1.png`, 'John and Daryl prepare a live concert on the Old Orchard Beach pier', [
        'At the pier, John files proof that their music existed before the company and feeds the shared arrangement into the live channel. The Purpose Clause cannot classify a voluntary new performance as cargo.',
        'The final Reardon system rejects itself. John and Daryl choose music—not because a label, owner, or machine requires it, but because they finally agree it is what they want to carry together.',
      ]),
      page('EPILOGUE · THE NEXT MORNING', 'The Things That Move Us', `${finalArt}/final-outro/hall-oates-performance-v1.png`, 'Daryl Hall and John Oates perform together in the game’s illustrated style', [
        'The moving truck is retired from furniture duty and filled with instruments. Joe is handed the final box. Daryl agrees to carry one amplifier, subject to an interpretation of the word “carry.”',
        'John and Daryl perform their new original song, “You’re Doing It, No You’re Doing It!” This time the argument becomes harmony—and nothing moves except the beat.',
      ], { type: 'audio', src: 'assets/audio/music/youre-doing-it.mp3', label: 'PLAY “YOU’RE DOING IT”' }),
    ],
  },
});

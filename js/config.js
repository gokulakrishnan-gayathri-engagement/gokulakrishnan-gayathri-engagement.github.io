/* =====================================================================
   ENGAGEMENT INVITE — CONTENT CONFIG
   ---------------------------------------------------------------------
   Every word, date, name, link and the song lives here.
   Edit values, save, refresh. Nothing else needs to change.

   Tips
   • Use "\n" inside a string for a line break.
   • Set any section in `sections` to false to hide it entirely.
   • Leave a field as "" to hide that single line.
   • Personalised links: add ?to=Name to the URL, e.g.
       index.html?to=Ravi%20Mama%20%26%20Family
     and the invite greets that guest by name.
   ===================================================================== */

window.INVITE = {
  pageTitle: "Gokulakrishnan & Gayathri · Nichayathartham",

  sections: {
    intro: true,        // temple-door opening screen
    countdown: true,
    story: true,        // "Two hearts · One beginning" + photos
    invitation: true,   // date, time, venue + map
    closing: true,      // "தங்கள் வருகையை எதிர்நோக்கும்" + parents
  },

  // Traditional opening line at the very top of the invite
  invocation: {
    symbol: "உ",
    line: "ஸ்ரீ அம்மன் துணை",
  },

  couple: {
    groom: {
      name: "Gokulakrishnan",
      tamilName: "கோகுலகிருஷ்ணன்",
      initial: "G",
    },
    bride: {
      name: "Gayathri",
      tamilName: "காயத்திரி",
      initial: "G",
    },
  },

  guest: {
    urlParam: "to",                 // ?to=Name
    greeting: "Dear",               // "Dear Ravi Mama & Family"
    invitedLine: "you are cordially invited",
  },

  intro: {
    eyebrow: "Nichayathartham",
    tapText: "Tap to open",
  },

  hero: {
    preTitle: "Together with their families",
    announce: "would like to invite you to their",
    // followed by event.tamilName in gold and event.subtitle beneath it
  },

  countdown: {
    eyebrow: "Counting down to",
    label: "the auspicious hour",
    doneText: "The celebration has begun",
  },

  story: {
    eyebrow: "Two hearts · One beginning",
    tamilTitle: "ஒரு புதிய தொடக்கம்",
    // Couple photos, shown in gold arched frames. Leave empty to hide.
    photos: [
      // { src: "assets/images/couple-1.jpg", alt: "Gokul and Gayathri", caption: "" },
    ],
    text:
      "Our families found each other first.\nThe rest of the story is still unwritten — and we would love for you to be there as the very first page is turned.",
  },

  // The one and only event
  event: {
    tamilName: "நிச்சயதார்த்தம்",
    subtitle: "Engagement Ceremony",
    // Optional heading of the details card (leave "" for no heading)
    cardTitle: "சுப முகூர்த்தம்",
    cardSubtitle: "An auspicious day, an auspicious hour",
    // ISO date-time with timezone (+05:30 = IST). Drives the countdown.
    start: "2026-11-29T10:30:00+05:30",
    dayText: "Sunday",
    dateText: "29 November 2026",
    timeText: "10:30 AM – 12:00 PM",
    tamilDate: "ஸ்ரீ பராபவ வருடம்\nகார்த்திகை 13 · ஞாயிற்றுக்கிழமை",   // \n = new line
  },

  venue: {
    name: "Barathi Party Hall",
    address: "Johnsonpet, Salem – 636007",
    mapsQuery: "Barathi Party Hall, Johnsonpet, Salem",  // what the embedded map searches for
    mapsLink: "https://maps.app.goo.gl/Ye9z6xFbhd6Rfs8V9", // used by "Get directions"
    showMap: true,
  },

  closing: {
    tamilTitle: "தங்கள் வருகையை எதிர்நோக்கும்",
    englishLine: "",
    groomSide: {
      // Each name is either "Name" or { name, title } — title shows on its own line beneath
      names: [
        {
          name: "Dr. Anebarassou Candassamy",
          title: "Former Head, Dept. of French,\nTagore Govt. Arts and Science College, Puducherry",
        },
        "Mrs. Chakila Anebarassou",
      ],
      label: "",          // e.g. "Groom's Parents" — "" hides it
      tamilLabel: "",     // e.g. "மணமகனின் பெற்றோர்"
    },
    brideSide: {
      names: [
        {
          name: "Mr. Sivakumar Krishnasami",
          title: "Health Inspector (Retd.),\nDept. of Public Health, Govt. of Tamil Nadu",
        },
        "Mrs. Gomathi Sivakumar",
      ],
      label: "",          // e.g. "Bride's Parents"
      tamilLabel: "",     // e.g. "மணமகளின் பெற்றோர்"
    },
    // Closing verse at the very end ("" text hides it)
    saying: {
      text: "அன்பும் அறனும் உடைத்தாயின் இல்வாழ்க்கை\nபண்பும் பயனும் அது",
      meaning: "When love and virtue dwell in a home,\nthat is its grace and its reward.",
      source: "திருக்குறள் · 45",
    },
  },

  // Music starts when the doors open. Use either a YouTube clip or an audio file
  // (leave both empty to hide the music button).
  music: {
    youtube: { id: "", start: 0, end: 0 },   // the Vazhithunaiye uploads block embedding (error 150)
    src: "assets/music/vazhithunaiye.mp3",   // 0:27 – 1:49 of the song, trimmed
    startAt: 0,           // for src: seconds into the file to begin
    endAt: 0,             // for src: seconds to loop back at (0 = play to the end)
    title: "Vazhithunaiye · Dragon",   // shown briefly when the song starts
    tapHint: "Tap ♪ for music",        // shown if the phone blocks autoplay
    volume: 0.6,
  },

  // Optional colour overrides (CSS variables). Leave empty for the default palette.
  theme: {
    // "--maroon-900": "#2e050b",
    // "--crimson-600": "#7d1022",
    // "--gold-400": "#d4af37",
  },
};

/* Personalise the venue branch, RSVP number and gallery photos here. */
const INVITATION = {
  // Default branch is Mövenpick Hotel Amman. Update both fields if your event is elsewhere.
  venueName: "Mövenpick Hotel Amman",
  venueAddress: "Madina Al Monawarah Street, Amman, Jordan",
  mapSearch: "Mövenpick Hotel Amman, Jordan",

  // Add the phone number with country code, without + or spaces.
  // Example: 9627XXXXXXXX
  rsvpPhone: "",

  rsvpMessage:
    "Hello! I’m replying to Elina and Abdulrahman’s wedding invitation on 27 January 2027. I would like to RSVP: ",

  // Replace null with your own image URLs, or leave as null for the sample photos.
  galleryImages: [null, null, null],

  eventTitle: "Elina & Abdulrahman — Wedding",
  eventStartISO: "2027-01-27T20:00:00+03:00",
  eventEndISO: "2027-01-27T23:00:00+03:00"
};

const $ = (selector) => document.querySelector(selector);

const mapUrl =
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    INVITATION.mapSearch
  )}`;

$(".venue-name").textContent = INVITATION.venueName;
$(".venue-address").textContent = INVITATION.venueAddress;
$("#mapButton").href = mapUrl;

// Open the digital envelope and scroll to the invitation.
const envelope = $(".envelope");

envelope.addEventListener("click", () => {
  const opened = envelope.classList.toggle("open");
  envelope.setAttribute("aria-expanded", String(opened));

  if (opened) {
    setTimeout(() => {
      $("#details").scrollIntoView({ behavior: "smooth" });
    }, 450);
  }
});

// Countdown to the wedding.
const weddingTime = new Date(INVITATION.eventStartISO).getTime();

function updateCountdown() {
  const remaining = weddingTime - Date.now();

  if (remaining <= 0) {
    $(".countdown-block h2").textContent = "Today is the day!";
    $(".countdown").innerHTML =
      '<p>We cannot wait to celebrate with you. · <span lang="ar" dir="rtl">بانتظاركم بكل شوق</span></p>';
    return;
  }

  const units = {
    days: 24 * 60 * 60 * 1000,
    hours: 60 * 60 * 1000,
    minutes: 60 * 1000,
    seconds: 1000
  };

  let value = remaining;

  for (const [id, size] of Object.entries(units)) {
    document.getElementById(id).textContent = String(
      Math.floor(value / size)
    ).padStart(2, "0");

    value %= size;
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

// RSVP through WhatsApp. Add a phone number in INVITATION.rsvpPhone to direct it.
$("#rsvpButton").addEventListener("click", (event) => {
  event.preventDefault();

  const phone = INVITATION.rsvpPhone.replace(/\D/g, "");
  const url = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(
        INVITATION.rsvpMessage
      )}`
    : `https://wa.me/?text=${encodeURIComponent(INVITATION.rsvpMessage)}`;

  window.open(url, "_blank", "noopener,noreferrer");
});

// Download an .ics calendar event.
$("#calendarButton").addEventListener("click", () => {
  const formatDate = (value) =>
    new Date(value)
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.000Z$/, "Z");

  const calendarEvent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Elina and Abdulrahman//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `DTSTART:${formatDate(INVITATION.eventStartISO)}`,
    `DTEND:${formatDate(INVITATION.eventEndISO)}`,
    `SUMMARY:${INVITATION.eventTitle}`,
    `LOCATION:${INVITATION.venueName}, ${INVITATION.venueAddress}`,
    "DESCRIPTION:Wedding celebration of Elina and Abdulrahman.",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const file = new Blob([calendarEvent], {
    type: "text/calendar;charset=utf-8"
  });

  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(file);
  downloadLink.download = "elina-abdulrahman-wedding.ics";

  document.body.append(downloadLink);
  downloadLink.click();
  downloadLink.remove();

  URL.revokeObjectURL(downloadLink.href);
});

// Optional gallery image URLs.
document.querySelectorAll(".photo").forEach((photo, index) => {
  const imageUrl = INVITATION.galleryImages[index];

  if (imageUrl) {
    photo.style.backgroundImage =
      `linear-gradient(0deg, #34251a66, transparent 55%), url("${imageUrl}")`;
  }
});

// Reveal sections as they scroll into view.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

// Floating gold petals.
const particleLayer = $(".particle-layer");

for (let i = 0; i < 18; i++) {
  const petal = document.createElement("span");
  petal.className = "petal";
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.animationDuration = `${12 + Math.random() * 15}s`;
  petal.style.animationDelay = `${-Math.random() * 24}s`;
  petal.style.opacity = String(0.18 + Math.random() * 0.35);
  particleLayer.append(petal);
}

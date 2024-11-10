import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const USERNAME = "ManmeetKaur1525";

async function fetchContributionData() {
  const response = await fetch(`https://github.com/users/${USERNAME}/contributions`);
  const text = await response.text();

  // Use jsdom to parse the HTML
  const dom = new JSDOM(text);
  const document = dom.window.document;
  const days = document.querySelectorAll("rect.ContributionCalendar-day");

  const contributions = Array.from(days).map(day => ({
    date: day.getAttribute("data-date"),
    count: parseInt(day.getAttribute("data-count")),
    level: day.getAttribute("data-level")
  }));

  return contributions;
}

function generateSVG(contributions) {
  const svgParts = [
    `<svg width="700" height="110" xmlns="http://www.w3.org/2000/svg">`,
    `<style>
       .commit { animation: blink 2s infinite; }
       @keyframes blink {
         0%, 100% { fill: rgba(40, 167, 69, 1); }
         50% { fill: rgba(40, 167, 69, 0); }
       }
     </style>`
  ];

  let x = 10;
  let y = 10;

  contributions.forEach((day, index) => {
    const color = day.count > 0 ? "class='commit'" : "fill='rgba(40, 167, 69, 0)'";
    svgParts.push(`<rect x="${x}" y="${y}" width="10" height="10" ${color} />`);

    x += 12;
    if ((index + 1) % 7 === 0) {
      x = 10;
      y += 12;
    }
  });

  svgParts.push(`</svg>`);
  return svgParts.join("");
}

(async () => {
  const contributions = await fetchContributionData();
  const svgContent = generateSVG(contributions);
  console.log(svgContent);  // Output SVG directly to console
})();

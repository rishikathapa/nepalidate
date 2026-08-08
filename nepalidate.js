document.addEventListener("DOMContentLoaded", function() {
  let dateElements = document.querySelectorAll('.location-date');

  dateElements.forEach(function(el) {
    // अङ्ग्रेजी मिति Parse गर्ने (उदा: "2026-08-08" वा "August 8, 2026")
    let rawText = el.innerText.trim();
    let cleanText = rawText.replace(/[^\w\s,-]/gi, '').trim();
    let parsedDate = new Date(cleanText);

    if (!isNaN(parsedDate.getTime())) {
      try {
        let bsDate = new NepaliDate(parsedDate);

        let nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
        let nepaliMonths = ['वैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कात्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत'];
        let nepaliDays = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];

        let toNepDigits = function(num) {
          return num.toString().split('').map(d => nepaliDigits[d] || d).join('');
        };

        let year = toNepDigits(bsDate.getYear());
        let month = nepaliMonths[bsDate.getMonth()];
        let day = toNepDigits(bsDate.getDate());
        let dayOfWeek = nepaliDays[parsedDate.getDay()];

        let icon = el.querySelector('i');
        let iconHTML = icon ? icon.outerHTML + ' ' : '<i class="fa-regular fa-calendar-days"></i> ';

        // आउटपुट: शनिबार, २४ श्रावण २०८३
        el.innerHTML = `${iconHTML}${dayOfWeek}, ${day} ${month} ${year}`;
      } catch (e) {
        console.error("Date conversion failed:", e);
      }
    }
  });
});

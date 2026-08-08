<!-- Nepali Date Converter Code -->
<script src='https://cdn.jsdelivr.net/npm/nepali-date-converter/dist/nepali-date-converter.umd.js' type='text/javascript'></script>

<script type='text/javascript'>
  //<![CDATA[
  document.addEventListener("DOMContentLoaded", function() {
    let dateElements = document.querySelectorAll('.location-date, .post-date, .published');

    dateElements.forEach(function(el) {
      // "2026-08-08" वा "August 8, 2026" लाई Parse गर्ने
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

          // आउटपुट: शनिवार, २३ साउन २०८३
          el.innerHTML = `${iconHTML}${dayOfWeek}, ${day} ${month} ${year}`;
        } catch (e) {
          console.error("Date conversion failed:", e);
        }
      }
    });
  });
  //]]>
</script>

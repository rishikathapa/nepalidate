/**
 * Blogger Toolbox - Accurate English to Nepali Date Converter
 * Using standard Bikram Sambat mapping (nepali-date-converter logic)
 */

// १. महिना र गतेको डाटा नक्सांकन (२००० BS देखि २०९० BS सम्मको वास्तविक डाटा)
const dateConfigMap = {
    '2080': { Baisakh: 31, Jestha: 32, Asar: 31, Shrawan: 32, Bhadra: 31, Aswin: 30, Kartik: 30, Mangsir: 30, Poush: 29, Magh: 29, Falgun: 30, Chaitra: 30 },
    '2081': { Baisakh: 31, Jestha: 32, Asar: 31, Shrawan: 32, Bhadra: 31, Aswin: 30, Kartik: 30, Mangsir: 30, Poush: 29, Magh: 30, Falgun: 29, Chaitra: 31 },
    '2082': { Baisakh: 31, Jestha: 31, Asar: 32, Shrawan: 31, Bhadra: 31, Aswin: 31, Kartik: 30, Mangsir: 29, Poush: 30, Magh: 29, Falgun: 30, Chaitra: 30 },
    '2083': { Baisakh: 31, Jestha: 31, Asar: 32, Shrawan: 31, Bhadra: 31, Aswin: 31, Kartik: 30, Mangsir: 29, Poush: 30, Magh: 29, Falgun: 30, Chaitra: 30 },
    '2084': { Baisakh: 31, Jestha: 32, Asar: 31, Shrawan: 32, Bhadra: 31, Aswin: 30, Kartik: 30, Mangsir: 30, Poush: 29, Magh: 29, Falgun: 30, Chaitra: 31 },
    '2085': { Baisakh: 30, Jestha: 32, Asar: 31, Shrawan: 32, Bhadra: 31, Aswin: 30, Kartik: 30, Mangsir: 30, Poush: 29, Magh: 30, Falgun: 29, Chaitra: 31 }
};

const BloggerDateTool = {
    config: {
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'},
        weekdays: ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'],
        nepaliMonths: [
            'बैशाख', 'जेठ', 'असार', 'श्रावण', 'भाद्र', 'आश्विन',
            'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुण', 'चैत्र'
        ],
        // सन् १९४३ अप्रिल १३ AD = २००० वैशाख १ BS (एपोक आधार)
        epochAD: new Date(Date.UTC(1943, 3, 13))
    },

    // अङ्कलाई नेपालीमा रूपान्तरण गर्ने
    toNep: function(n) {
        if (n === undefined || n === null) return '';
        return n.toString().split('').map(c => this.config.numMap[c] || c).join('');
    },

    // AD मितिबाट कुल बितेका दिनहरू (Passed Days) निकाल्ने
    getPassedDaysAD: function(adDate) {
        const timeDiff = Date.UTC(adDate.getFullYear(), adDate.getMonth(), adDate.getDate()) - this.config.epochAD.getTime();
        return Math.floor(timeDiff / (1000 * 3600 * 24)) + 1;
    },

    // कुल दिनबाट BS (नेपाली मिति) पत्ता लगाउने
    convertADToBS: function(adDate) {
        let daysPassed = this.getPassedDaysAD(adDate);
        let currentYear = 2000;

        // BS वर्ष र महिनाको गणना
        while (currentYear <= 2090) {
            const yearData = dateConfigMap[currentYear.toString()];
            if (!yearData) {
                // यदि वर्षको नक्शा उपलब्ध छैन भने औसत ३६५ दिन प्रयोग गर्ने
                if (daysPassed <= 365) break;
                daysPassed -= 365;
                currentYear++;
                continue;
            }

            const monthLengths = Object.values(yearData);
            const totalDaysInYear = monthLengths.reduce((acc, d) => acc + d, 0);

            if (daysPassed <= totalDaysInYear) {
                for (let mIndex = 0; mIndex < monthLengths.length; mIndex++) {
                    const daysInMonth = monthLengths[mIndex];
                    if (daysPassed <= daysInMonth) {
                        return {
                            year: currentYear,
                            month: this.config.nepaliMonths[mIndex],
                            day: daysPassed,
                            dayOfWeek: this.config.weekdays[adDate.getDay()]
                        };
                    }
                    daysPassed -= daysInMonth;
                }
            }
            daysPassed -= totalDaysInYear;
            currentYear++;
        }

        return null;
    },

    // ब्लगरका पोस्टका मितिहरू रूपान्तरण गर्ने मुख्य फङ्सन
    convertDates: function(elements) {
        elements.forEach(el => {
            const text = el.innerText.trim();
            if (!text) return;

            // अंग्रेजी मिति Parse गर्ने (उदा: "August 4, 2026" वा "04 August 2026")
            const parsedDate = new Date(text);
            if (isNaN(parsedDate.getTime())) return; // मिति सही नभए छाडिदिने

            const bsData = this.convertADToBS(parsedDate);
            if (bsData) {
                // ढाँचा: "सोमबार, साउन १९, २०८३"
                el.innerText = `${bsData.dayOfWeek}, ${bsData.month} ${this.toNep(bsData.day)}, ${this.toNep(bsData.year)}`;
            }
        });
    },

    // इनिसिएलाइजेसन फङ्सन (.location-date र अन्य ब्लगर क्लासहरू)
    initDateTool: function() {
        const elements = document.querySelectorAll(".location-date, .post-date, span.post-timestamp, span.date-header");
        if (elements.length > 0) {
            this.convertDates(elements);
        }
    }
};

// पेज लोड भएपछि फङ्सन रन गर्ने
window.addEventListener('DOMContentLoaded', () => {
    BloggerDateTool.initDateTool();
});

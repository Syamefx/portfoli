/**
 * Supply Chain Portfolio - JavaScript Functionality
 * Author: Alex Morgan (Supply Chain Executive)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. Current Year Footer Update
    // --------------------------------------------------------------------------
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --------------------------------------------------------------------------
    // 2. Dark / Light Theme Toggle & Local Storage
    // --------------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check system preference or saved local storage theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else if (prefersDark) {
        htmlElement.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);

            // Re-render chart if active so colors match theme
            if (kpiChart) {
                updateChartColors(newTheme);
            }
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggleBtn) return;
        const icon = themeToggleBtn.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.className = 'fa-solid fa-sun';
            } else {
                icon.className = 'fa-solid fa-moon';
            }
        }
    }

    // --------------------------------------------------------------------------
    // 3. Mobile Navigation Hamburger Menu
    // --------------------------------------------------------------------------
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Active Nav Indicator on Scroll
    window.addEventListener('scroll', () => {
        let currentSection = '';
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // --------------------------------------------------------------------------
    // 4. Hero Counter Animation
    // --------------------------------------------------------------------------
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    function animateStats() {
        if (animatedStats) return;

        const heroSection = document.getElementById('hero');
        if (!heroSection) return;

        const sectionPos = heroSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight;

        if (sectionPos < screenPos) {
            animatedStats = true;
            statNumbers.forEach(stat => {
                const target = parseFloat(stat.getAttribute('data-target'));
                const isCurrency = stat.textContent.includes('$');
                const isPercent = stat.textContent.includes('%');
                const isPlus = stat.textContent.includes('+');

                let count = 0;
                const speed = target / 50;

                const updateCount = () => {
                    count += speed;
                    if (count < target) {
                        if (isCurrency) {
                            stat.textContent = `$${count.toFixed(1)}M`;
                        } else if (isPercent) {
                            stat.textContent = `${count.toFixed(1)}%`;
                        } else if (isPlus) {
                            stat.textContent = `${Math.floor(count)}+`;
                        } else {
                            stat.textContent = Math.floor(count);
                        }
                        setTimeout(updateCount, 25);
                    } else {
                        if (isCurrency) stat.textContent = `$${target.toFixed(1)}M`;
                        else if (isPercent) stat.textContent = `${target.toFixed(1)}%`;
                        else if (isPlus) stat.textContent = `${Math.floor(target)}+`;
                        else stat.textContent = target;
                    }
                };

                updateCount();
            });
        }
    }

    animateStats();
    window.addEventListener('scroll', animateStats);

    // --------------------------------------------------------------------------
    // 5. Interactive Chart.js KPI Performance Analytics
    // --------------------------------------------------------------------------
    const chartCtx = document.getElementById('kpiChart');
    let kpiChart = null;

    const metricData = {
        otif: {
            title: 'On-Time In-Full (OTIF) Rate - 12 Month Trend',
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [92.1, 93.4, 94.0, 95.2, 96.1, 96.8, 97.5, 98.2, 98.9, 99.1, 99.3, 99.4],
            benchmark: '92.0%',
            current: '99.4%',
            delta: '+7.4%',
            unit: '%',
            desc: 'Achieved industry-leading OTIF by integrating real-time IoT tracking across 3PL carriers and automated safety-stock triggers in SAP S/4HANA.'
        },
        inventory: {
            title: 'Inventory Turnover Ratio - Annual Performance',
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [7.2, 7.8, 8.5, 9.1, 9.8, 10.4, 11.2, 12.0, 12.8, 13.5, 13.9, 14.2],
            benchmark: '8.0x',
            current: '14.2x',
            delta: '+6.2x',
            unit: 'x',
            desc: 'Increased inventory velocity nearly 2x through ABC inventory rationalization, dynamic lead-time monitoring, and Lean warehouse pull systems.'
        },
        freight: {
            title: 'Freight Cost per Shipped Unit ($)',
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [3.45, 3.30, 3.15, 2.95, 2.80, 2.65, 2.50, 2.40, 2.30, 2.22, 2.18, 2.15],
            benchmark: '$3.50',
            current: '$2.15',
            delta: '-37.6%',
            unit: '$',
            desc: 'Slashed unit freight spend by optimizing LTL load consolidation, backhaul route matching, and carrier contract re-negotiations.'
        },
        leadtime: {
            title: 'Average Fulfillment Order Lead Time (Days)',
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [8.5, 8.0, 7.4, 6.8, 6.2, 5.8, 5.3, 4.9, 4.6, 4.4, 4.3, 4.2],
            benchmark: '8.0 Days',
            current: '4.2 Days',
            delta: '-50.5%',
            unit: ' Days',
            desc: 'Halved fulfillment order lead times by deploying AS/RS goods-to-person automation and strategic regional hub placement.'
        }
    };

    function initKPIChart(metricKey = 'otif') {
        if (!chartCtx) return;

        const isDark = htmlElement.getAttribute('data-theme') === 'dark';
        const primaryColor = isDark ? '#38bdf8' : '#0284c7';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';
        const textColor = isDark ? '#cbd5e1' : '#475569';

        const config = metricData[metricKey];

        if (kpiChart) {
            kpiChart.destroy();
        }

        kpiChart = new Chart(chartCtx, {
            type: 'line',
            data: {
                labels: config.labels,
                datasets: [{
                    label: config.title,
                    data: config.data,
                    borderColor: primaryColor,
                    backgroundColor: isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 132, 199, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.35,
                    pointBackgroundColor: primaryColor,
                    pointRadius: 4,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        padding: 10,
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        titleColor: isDark ? '#f8fafc' : '#0f172a',
                        bodyColor: isDark ? '#cbd5e1' : '#475569',
                        borderColor: isDark ? '#334155' : '#e2e8f0',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return ` Value: ${context.parsed.y}${config.unit}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    },
                    y: {
                        grid: { color: gridColor },
                        ticks: {
                            color: textColor,
                            callback: function(val) { return val + config.unit; }
                        }
                    }
                }
            }
        });
    }

    function updateChartColors(theme) {
        if (!kpiChart) return;
        const activeTab = document.querySelector('.kpi-tab.active');
        const activeMetric = activeTab ? activeTab.getAttribute('data-metric') : 'otif';
        initKPIChart(activeMetric);
    }

    if (chartCtx) {
        initKPIChart('otif');
    }

    // Tab Switching for KPI Dashboard
    const kpiTabs = document.querySelectorAll('.kpi-tab');
    kpiTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            kpiTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const metric = tab.getAttribute('data-metric');
            const data = metricData[metric];

            // Update UI elements
            document.getElementById('chart-title').textContent = data.title;
            document.getElementById('metric-benchmark').textContent = data.benchmark;
            document.getElementById('metric-current').textContent = data.current;
            document.getElementById('metric-delta').textContent = data.delta;
            document.getElementById('metric-description').textContent = data.desc;

            // Re-draw chart
            initKPIChart(metric);
        });
    });

    // --------------------------------------------------------------------------
    // 6. Case Study Project Category Filtering
    // --------------------------------------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || filter === category) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // --------------------------------------------------------------------------
    // 7. Modal Popups for Case Studies
    // --------------------------------------------------------------------------
    const openModalBtns = document.querySelectorAll('.open-modal');
    const closeModalBtns = document.querySelectorAll('.modal-close, .modal-overlay');

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Lock scroll
            }
        });
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto'; // Unlock scroll
            }
        });
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                activeModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    });

    // --------------------------------------------------------------------------
    // 8. Supply Chain Interactive ROI & Lead Time Calculator
    // --------------------------------------------------------------------------
    const spendSlider = document.getElementById('spend-slider');
    const freightSlider = document.getElementById('freight-slider');
    const leadtimeSlider = document.getElementById('leadtime-slider');
    const strategySelect = document.getElementById('strategy-select');

    const spendDisplay = document.getElementById('spend-display');
    const freightDisplay = document.getElementById('freight-display');
    const leadtimeDisplay = document.getElementById('leadtime-display');

    // Result fields
    const calcSavings = document.getElementById('calc-savings');
    const calcLeadtime = document.getElementById('calc-leadtime');
    const newLeadtime = document.getElementById('new-leadtime');
    const calcFreightSavings = document.getElementById('calc-freight-savings');
    const calcCapital = document.getElementById('calc-capital');
    const calcRoi = document.getElementById('calc-roi');

    function calculateROI() {
        if (!spendSlider || !freightSlider || !leadtimeSlider || !strategySelect) return;

        const annualSpend = parseFloat(spendSlider.value);
        const freightPct = parseFloat(freightSlider.value) / 100;
        const currentLeadTime = parseInt(leadtimeSlider.value);
        const strategy = strategySelect.value;

        // Display slider current values formatted
        spendDisplay.textContent = `$${(annualSpend / 1000000).toFixed(1)}M`;
        freightDisplay.textContent = `${freightSlider.value}%`;
        leadtimeDisplay.textContent = `${currentLeadTime} Days`;

        // Multipliers based on chosen strategic focus
        let savingsRate = 0.10; // Default 10%
        let leadTimeReductionRate = 0.30; // Default 30% reduction
        let capitalFreeUpRate = 0.15; // 15% inventory capital
        let roiRatio = 4.2;

        if (strategy === 'logistics') {
            savingsRate = 0.09;
            leadTimeReductionRate = 0.40;
            capitalFreeUpRate = 0.12;
            roiRatio = 4.5;
        } else if (strategy === 'procurement') {
            savingsRate = 0.14;
            leadTimeReductionRate = 0.20;
            capitalFreeUpRate = 0.10;
            roiRatio = 5.2;
        } else if (strategy === 'inventory') {
            savingsRate = 0.08;
            leadTimeReductionRate = 0.25;
            capitalFreeUpRate = 0.25;
            roiRatio = 3.9;
        } else if (strategy === 'balanced') {
            savingsRate = 0.1125;
            leadTimeReductionRate = 0.30;
            capitalFreeUpRate = 0.15;
            roiRatio = 4.8;
        }

        // Calculations
        const totalAnnualSavings = annualSpend * savingsRate;
        const totalFreightSpend = annualSpend * freightPct;
        const totalFreightSavings = totalFreightSpend * 0.15; // 15% freight optimization average
        const daysSaved = Math.round(currentLeadTime * leadTimeReductionRate);
        const updatedLeadTime = Math.max(1, currentLeadTime - daysSaved);
        const freedCapital = annualSpend * 0.20 * capitalFreeUpRate;

        // Render calculated values to DOM
        calcSavings.textContent = `$${totalAnnualSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
        calcLeadtime.textContent = `${daysSaved} Days`;
        newLeadtime.textContent = `${updatedLeadTime} Days`;
        calcFreightSavings.textContent = `$${totalFreightSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
        calcCapital.textContent = `$${freedCapital.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
        calcRoi.textContent = `${roiRatio}x`;
    }

    if (spendSlider && freightSlider && leadtimeSlider && strategySelect) {
        spendSlider.addEventListener('input', calculateROI);
        freightSlider.addEventListener('input', calculateROI);
        leadtimeSlider.addEventListener('input', calculateROI);
        strategySelect.addEventListener('change', calculateROI);

        // Initial run
        calculateROI();
    }

    // --------------------------------------------------------------------------
    // 9. Contact Form Validation & Submission Handling
    // --------------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');

            let isValid = true;

            // Validate Name
            if (!nameInput.value.trim()) {
                setError(nameInput);
                isValid = false;
            } else {
                removeError(nameInput);
            }

            // Validate Email
            if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
                setError(emailInput);
                isValid = false;
            } else {
                removeError(emailInput);
            }

            // Validate Subject
            if (!subjectInput.value.trim()) {
                setError(subjectInput);
                isValid = false;
            } else {
                removeError(subjectInput);
            }

            // Validate Message
            if (!messageInput.value.trim()) {
                setError(messageInput);
                isValid = false;
            } else {
                removeError(messageInput);
            }

            if (isValid) {
                formStatus.className = 'form-status success';
                formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully. I will review your operational requirements and get back to you shortly.';
                contactForm.reset();

                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 7000);
            }
        });
    }

    function setError(inputElement) {
        const formGroup = inputElement.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('error');
        }
    }

    function removeError(inputElement) {
        const formGroup = inputElement.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('error');
        }
    }

    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});

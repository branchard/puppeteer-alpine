const puppeteer = require('puppeteer-core');

const URL = 'https://github.com/trending/';

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'chromium-browser',
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--purge_hint_cache_store', // Purges the hint cache store on startup, so that it's guaranteed to be using fresh data.
            // '--disable-web-security', // Don't enforce the same-origin policy.
            '--disable-dev-shm-usage', // The /dev/shm partition is too small in certain VM environments, causing Chrome to fail or crash (see http://crbug.com/715363). Use this flag to work-around this issue (a temporary directory will always be used to create anonymous shared memory files).
            '--disable-dinosaur-easter-egg',
            '--disable-auto-reload', // Disable auto-reload of error pages.
            '--disable-gpu', // Disables GPU hardware acceleration. If software renderer is not in place, then the GPU process won't launch.
            '--no-zygote', // Disables the use of a zygote process for forking child processes. Instead, child processes will be forked and exec'd directly. Note that --no-sandbox should also be used together with this flag because the sandbox needs the zygote to work.
            // '--allow-insecure-localhost', // Enables TLS/SSL errors on localhost to be ignored (no interstitial, no blocking of requests).
            // '--allow-loopback-in-peer-connection', // Allows loopback interface to be added in network list for peer connection.
            // '--disable-background-networking',
            '--disable-default-apps',
            '--disable-extensions',
            '--disable-sync',
            '--disable-translate',
            '--hide-scrollbars',
            // '--metrics-recording-only',
            '--mute-audio',
            '--no-first-run',
            // '--safebrowsing-disable-auto-update',
            // '--ignore-certificate-errors',
            // '--ignore-ssl-errors',
            // '--ignore-certificate-errors-spki-list',
            '--user-data-dir=/tmp',
            '--disable-software-rasterizer'
        ]
    });

    const page = await browser.newPage();

    await page.goto(URL, {
        timeout: 20_000,
        waitUntil: 'networkidle2',
    });

    await page.setViewport({
        width: 1920,
        height: 1080,
    });

    const scrollHeight = await page.evaluate(() => {
        window.scrollTo(0, 0);
        return document.documentElement.scrollHeight;
    });

    await page.setViewport({
        width: 1920,
        height: scrollHeight,
    });

    const date = new Date();
    const fileName = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.jpg`;

    await page.screenshot({
        path: `./screenshots/${fileName}`,
        type: 'jpeg',
        quality: 85,
        fullPage: false,
    });

    await page.close();

    await browser.close();
})().catch((e) => {
    console.error(e);
    process.exit(1);
});

